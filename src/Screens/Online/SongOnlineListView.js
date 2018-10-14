import React from "react";
import { StyleSheet, View,ScrollView } from "react-native";
import PropTypes from 'prop-types';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import GLOBALS from '../../DataManagers/Globals.js';
import Databases from '../../DataManagers/DatabaseManager.js';
import IndicatorView from '../../Views/IndicatorView';
import SongOnlineItem from './SongOnlineItem';
import OnlineItem2 from './onlineItem.lanscape';
import Utils from '../../Utils/Utils';
import BoxControl from '../../DataManagers/BoxControl';
import DataInfo from '../../DataManagers/DataInfo';
import {EventRegister} from 'react-native-event-listeners';

//let height = Utils.Width()*18/32 + 90;
export default class SongOnlineListView extends React.Component {
    static propTypes = {
        onlineType: PropTypes.number,
        onScroll : PropTypes.func,
        top : PropTypes.number
    };
    static defaultProps = {
        onlineType : GLOBALS.SONG_ONLINE.YOUTUBE,
        top: 50
    };
    //page = 0;
    state = {
        datas: [],
        dataProvider: new DataProvider((r1, r2) => {
            return r1 !== r2;
        })
    };

    _page = "";
    _offsetPage = 0;
    _dataKey = {}
    _loading = false;
    _loaded = false;
    _hasData = true;
    _pageCount = 30;
    _searchTerm = "";
    _hasChanged = false;

    constructor(props) {
        super(props);

        if(!GLOBALS.LANDSCAPE){
            this.width2 = Utils.Width();
            this.height2 = this.width2*18/32 + 100;
            this._layoutProvider = new LayoutProvider(
                index => {
                    return "FULL";
                },
                (type, dim) => {
                    switch (type) {
                        case "FULL":
                            dim.width = Utils.Width();
                            dim.height = this.height2;
                            break;
                        default:
                            break;
                            // dim.width = Utils.Width();
                            // dim.height = height;
                    }
                }
            );
        }
        else{
            this.width2 = (Utils.Width()-32)/3;
            this.height2 = this.width2*18/32 + 100;
            //let height2 = Utils.Width()*18/32 + 90;
        // console.warn("width2 = "+this.width2 +", height2 = "+this.height2);
            this._layoutProvider2 = new LayoutProvider(
                index => {
                    return "FULL";
                },
                (type, dim) => {
                    switch (type) {
                        case "FULL":
                            dim.width = this.width2;
                            dim.height = this.height2;
                            break;
                        default:
                            break;
                            // dim.width = Utils.Width();
                            // dim.height = height;
                    }
                }
            );
        }

        this._loadData = this._loadData.bind(this);
    }
    searchData = (term)=>{
        if(this._loading || term == this._searchTerm)
            return;
       /// console.warn("searchData "+term);
        this._searchTerm = term;
        this._loaded = false;
        this._page = "";
        this._offsetPage = 0;
        this._loadData(this._pageCount,term,this._offsetPage);
    }

    refreshData = (term) =>{
        //console.warn("type = "+this.props.type);
        if (!this._loading) {
            this._searchTerm = term;
            this._loaded = false;
            this._page = "";
            this._offsetPage = 0;
            this._indicator.show();
            this._loadData(this._pageCount,term,this._offsetPage);
        }
    }

    clear =()=>{
        if (!this._loading) {
            this._searchTerm = "";
            this._loaded = false;
            this._page = "";
            this._offsetPage = 0;
            this.setState({
                dataProvider: this.state.dataProvider.cloneWithRows([]),
                datas: []
            });
        }
    }

    componentWillMount() {
        this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
            this.hasChanged = true;
        });
    }
    
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerSongUpdateEvent);
    }

    updateSong = () =>{
        this.hasChanged = false;
        var isChange = false;
        var newDs = [];
        //newDs = //this.state.datas.slice();
        for(i = 0; i < this.state.datas.length; i++){
            let selectIndex = DataInfo.PLAY_QUEUE.indexOf(this.state.datas[i].id);
            if(selectIndex > -1){
                if(this.state.datas[i].isSelected != 1){
                    this.state.datas[i].isSelected = 1;
                    //this.state.datas[i].id= "100";
                    isChange = true;
                }
            }
            else if(this.state.datas[i].isSelected){
                this.state.datas[i].isSelected = 0;
                isChange = true;
            }
            
        }
        
        if(isChange){
            this.setState({
                dataProvider: this.state.dataProvider.cloneWithRows(this.state.datas),
                datas:this.state.datas
            });
            // newDs[0].id = id;
            // this.setState({
            //     dataProvider: this.state.dataProvider.cloneWithRows(newDs),
            //     datas:newDs
            // });
        }
            
    }

    loadData = (term) => {
        if(this._loading)
            return;
        if (this._loaded && this._searchTerm == term) {
            if(this.hasChanged)
                setTimeout(() => {
                    this.updateSong();
                }, 50);
            return;
        }
       // console.warn("loadData "+term);
        this._searchTerm = term;
        this._loaded = false;
        this._page = "";
        this._offsetPage = 0;
        this._indicator.show();
        this._loadData(this._pageCount,term,this._offsetPage);
    }

    async _loadData(pageCount, term,page){
        // if (this._loading)
        //     return;
        this._loading = true;
        var that = this;
        var _page = (this.props.onlineType == GLOBALS.SONG_ONLINE.MIXCLOUD)?page:that._page;
        await Databases.fetchOnlineSongData(_page,pageCount,term,this.props.onlineType,
            function (datas,nextPage) {
                if(that.props.onlineType == GLOBALS.SONG_ONLINE.MIXCLOUD){
                    that._offsetPage = page;
                }
                else{
                    that._page = nextPage;
                }
                
                that._handleFetchDataCompleted(datas);
            },
            function(error){
                this._loading = false;
                this._indicator.hide();
            });
    }

    _handleFetchDataCompleted = (datas) =>{
        this._loading = false;
        var newDatas = [];
        if(this._loaded){
            newDatas = this.state.datas.concat(datas);
        }
        else{
            newDatas = datas;
        }

        this.setState({
            dataProvider: this.state.dataProvider.cloneWithRows(newDatas),
            datas: newDatas
        });

        if(datas.length <this._pageCount){
            this._hasData = false;
        }
        else{
            this._hasData = true;
        }

        this._indicator.hide();
        this._loaded = true;
    }

    _onPressSong = (id) => {
        // const data = {
        //     songId: id,
        //     cmd: GLOBALS.CONTROL_CMD.SELECT
        // }

        // BoxControl.selectSong(id);
    }

    _onEndReached = () => {
        if (this._hasData && !this._loading && this._loaded) {
            this._loadData(this._pageCount,this._searchTerm,this._offsetPage + 1);
            this.setState({});
        }
    }

    _showOptOverlay = (id,overlayType) =>{
       // EventRegister.emit('ShowOptOverlay', {id:id,overlayType:overlayType});
    }

    _renderFooter = () => {
        return (this._loading && this._loaded) ?
            <View style={{ height: 60, width: '100%', justifyContent: "center", alignContent: "center" }}>
                <IndicatorView isShow ={true} />
            </View> :
            <View style={{ height: 1, width: '100%' }} />;
    }

    _onPress = (id,title,type) =>{
        BoxControl.selectYoutubeSong(id,title,"0");
    }
    _onPlayPress = (id) =>{
        BoxControl.playNow(id);
    }
    _rowRenderer = (type, item) => {
        const {thumb,id,title,channelTitle,isSelected} = item;
       // console.warn("title "+title +" , channelTitle = "+channelTitle);
        return (
            <OnlineItem2  
                width={this.width2}
               // height = {this.height2}
                height2 = {this.height2}
                thumbnail={thumb} 
                id ={id} title={title}
                channel={channelTitle} 
                isSelected = {isSelected}
                onPress = {this._onPress.bind(this,id,title,"0")}
                onPlayPress = {this._onPlayPress.bind(this,id)}
                />
        );
    };

    _rowRenderer2 = (type, item) => {
        const {thumb,id,title,channelTitle,isSelected} = item;
        // console.warn("width2 "+this.width2 +" , height2 = "+this.height2);
        return (
            <OnlineItem2  
                width={this.width2 - 10}
               // height = {this.height2}
                height2 = {this.height2}
                thumbnail={thumb} 
                id ={id} title={title}
                channel={channelTitle} 
                isSelected = {isSelected}
                onPress = {()=>{
                    console.warn("OnlineItem2 id = "+id+" , title = "+title+"video Type = 0");
                    BoxControl.selectYoutubeSong(id,title,0);
                }}
                />
        );
    };

    _handleScroll = (rawEvent, offsetX, offsetY) =>{
       // console.warn("offsetY = "+offsetY);
       if(this.props.onScroll != null){
            this.props.onScroll(offsetY);
       }
    }
    render = () => {
        //const {_loading} = this.state;
        var containerStyle = {};
        if(GLOBALS.LANDSCAPE){
            containerStyle = {
                marginLeft:15,
                marginRight:15
            }
        }
        return (
            <View style={[{ flex: 1 },containerStyle]}>
                <RecyclerListView
                    style={{ flex: 1 }}
                    ref = {ref=>(this._listview = ref)}
                    //contentContainerStyle={{ margin: 3 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this._onEndReached}
                    dataProvider={this.state.dataProvider}
                    layoutProvider={(GLOBALS.LANDSCAPE)?this._layoutProvider2:this._layoutProvider}
                    rowRenderer={GLOBALS.LANDSCAPE?this._rowRenderer2:this._rowRenderer}
                    renderFooter={this._renderFooter}
                    onScroll = {this._handleScroll}
                    externalScrollView={this.renderScroll}
                    extendedState={this.state.dataProvider}
                    scrollThrottle = {16}
                    renderAheadOffset = {GLOBALS.LANDSCAPE? 300: 250}
                    //extendedState={this.state.dataProvider} 
                    />
                <IndicatorView ref={ref => (this._indicator = ref)}/>
            </View>
        );
    }

    renderScroll = (props) => {
        return (
            <ScrollView
        // ref="refs"
            {...props}
            scrollEventThrottle={16}
            contentContainerStyle={{
                paddingTop: this.props.top 
            }}
            />
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: '300',
        textAlign: 'center',
        margin: 20,
    },
    listItem: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0.5,
        borderColor: '#00ECBC',
    },

    listText: {
        color: "#fff",
        fontFamily:'SF-Pro-Text-Regular'
    },

    indicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
