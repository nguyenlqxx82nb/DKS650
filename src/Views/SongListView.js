import React from "react";
import { StyleSheet, Dimensions,Text,View } from "react-native";
import PropTypes from 'prop-types';
import ListItem from '../Components/ListItem.js';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import IconRippe from '../Components/IconRippe.js'
import GLOBALS from '../DataManagers/Globals.js';
import { EventRegister } from 'react-native-event-listeners';
import Databases from '../DataManagers/DatabaseManager.js';
import DataInfo from '../DataManagers/DataInfo.js';
import IndicatorView from './IndicatorView.js';
import BoxControl from '../DataManagers/BoxControl.js';

let { height, width } = Dimensions.get('window');
export default class SongListView extends React.Component {
    static propTypes = {
        lan: PropTypes.string,
        actor : PropTypes.string,
        songType : PropTypes.number,
        listType : PropTypes.number
        //onOptionOverlayOpen: PropTypes.func,
        //onBack: PropTypes.func,
        //duration : PropTypes.number

    };
    static defaultProps = {
        lan : GLOBALS.LANGUAGE_KEY.ALL,
        songType : GLOBALS.SONG_TYPE.ALL,
        listType: GLOBALS.SONG_LIST_TYPE.ALL,
        actor : ""
    };
    //page = 0;
    state = {
        datas: [],
        dataProvider: new DataProvider((r1, r2) => {
            return r1 !== r2;
        })
    };

    _page = 0;
    _dataKey = {}
    _loading = false;
    _loaded = false;
    _hasData = true;
    _pageCount = 30;
    _searchTerm = "";
    _hasChanged = false;

    constructor(props) {
        super(props);

        this._layoutProvider = new LayoutProvider(
            index => {
                return "FULL";
            },
            (type, dim) => {
                switch (type) {
                    case "FULL":
                        dim.width = width;
                        dim.height = 60;
                        break;
                    default:
                        dim.width = width;
                        dim.height = 60;
                }
            }
        );

        this._layoutProvider2 = new LayoutProvider(
            index => {
                return "FULL";
            },
            (type, dim) => {
                switch (type) {
                    case "FULL":
                        dim.width = (width-30)/2 - 1;
                        dim.height = 65;
                        break;
                    default:
                        dim.width = width/2;
                        dim.height = 65;
                }
            }
        );

        this._loadData = this._loadData.bind(this);
    }
    
    componentWillMount() {
        this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
            this.hasChanged = true;
        });
    }
    
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerSongUpdateEvent);
    }

    updateSong = () => {
        this.hasChanged = false;
        if(this.props.listType == GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD)
            return;

        var isChange = false;
        for(i = 0; i < this.state.datas.length; i++){
            let selectIndex = DataInfo.PLAY_QUEUE.indexOf(this.state.datas[i].id);
            if(selectIndex > -1){
                this.state.datas[i].status = GLOBALS.SING_STATUS.SELECTED;
                this.state.datas[i].index = " "+(selectIndex + 1);
                isChange = true;
            }
            else if(this.state.datas[i].status == GLOBALS.SING_STATUS.SELECTED){
                this.state.datas[i].status = GLOBALS.SING_STATUS.NORMAL;
                isChange = true;
            }
        }

        if(isChange)
            this.setState({
                dataProvider: this.state.dataProvider.cloneWithRows(this.state.datas)
            });
    }

    updateDownloadSong = () =>{
       // console.warn("updateDownloadSong");
        var newDatas = [];
        for(i = 0; i < this.state.datas.length; i++){
            var id = this.state.datas[i].id;
            if(DataInfo.DOWN_QUEUE[id] != null){
                this.state.datas[i].status = GLOBALS.SING_STATUS.DOWNLOADING;
                this.state.datas[i].progress = DataInfo.DOWN_QUEUE[id].progress;
                newDatas.push(this.state.datas[i]);
            }
            else if(this.state.datas[i].status != GLOBALS.SING_STATUS.DOWNLOADING){
                newDatas.push(this.state.datas[i]);
            }
            else if(this.state.datas[i].status == GLOBALS.SING_STATUS.DOWNLOADING
                        && this.state.datas[i].progress == 0){
                //console.warn("id = "+this.state.datas[i].id+", name = "+this.state.datas[i].name);   
                this.state.datas[i].status = GLOBALS.SING_STATUS.NO_DOWNLOADED; 
                newDatas.push(this.state.datas[i]);     
            }
        }
        this.state.datas = newDatas;
        this.setState({
            dataProvider: this.state.dataProvider.cloneWithRows(newDatas)
        });
    }

    searchData = (term)=>{
        if(!GLOBALS.IS_BOX_CONNECTED && GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.HTTP)
            return;
        if(this._loading || term == this._searchTerm)
            return;
            
        this._searchTerm = term;
        this._loaded = false;
        this._page = 0;
        this._loadData(this.props.lan, this._page, this._pageCount,term);
    }

    refreshData = (term) =>{
        if(this._loading 
            || (!GLOBALS.IS_BOX_CONNECTED && GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.HTTP))
            return;
        
        this.hasChanged = false;
        this._searchTerm = term;
        this._loaded = false;
        this._page = 0;
        this._indicator.show();
        this._loadData(this.props.lan, this._page, this._pageCount,term);
    }

    clear =()=>{
        if (!this._loading) {
            this._searchTerm = "";
            this._loaded = false;
            this._page = 0;
            this.setState({
                dataProvider: this.state.dataProvider.cloneWithRows([]),
                datas: []
            });
        }
    }

    loadData = (term) => {
        if(this._loading 
                || (!GLOBALS.IS_BOX_CONNECTED && GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.HTTP))
            return;
        if (this._loaded && this._searchTerm == term) {
            if(this.hasChanged)
                setTimeout(() => {
                    this.updateSong();
                }, 50);
            return;
        }
       // console.warn("Song List loadData ="+term);
        this._searchTerm = term;
        this._loaded = false;
        this._page = 0;
        this._indicator.show();
        this._loadData(this.props.lan, this._page, this._pageCount,term);
    }
    async _loadData(lan, page, pageCount, term)  {
        const {songType,listType,actor} = this.props;
        if (this._loading )
            return;
      //  console.warn("_loadData term = "+term);
        this._loading = true;
        var that = this;
        await Databases.fetchSongData(lan,page,pageCount,term,songType,listType,actor,
            function (datas) {
                that._page = page;
                that._handleFetchDataCompleted(datas);
            },
            function(error){
                that._indicator.hide();
                that._loading = false;    
            });
    }
    _handleFetchDataCompleted = (datas) =>{
        this._loading = false;
        var newDatas = [];
    //    console.warn("_handleFetchDataCompleted data length = "+datas.length);
        if(this._loaded){
            startId = this.state.datas.length;
            newDatas = this.state.datas.concat(datas);
        }
        else{
            newDatas = datas;
        }

        this.setState({
            dataProvider: this.state.dataProvider.cloneWithRows(newDatas),
            datas: newDatas
        });

        if(this.props.listType !== GLOBALS.SONG_LIST_TYPE.SELECTED){
            if(datas.length <this._pageCount){
                this._hasData = false;
            }
            else{
                this._hasData = true;
            }

            this._indicator.hide();
            this._loaded = true;
        }
        else{
            this._indicator.hide();
            this._loaded = true;
            this._hasData = false;
        }
    }
    _onPressSong = (id, status) => {
        return;
        if(status == GLOBALS.SING_STATUS.NO_DOWNLOADED)
        {
            BoxControl.downloadSong(id,(errorCode)=>{
            });        
        }
        else{
            BoxControl.selectSong(id);
        }
    }
    _onEndReached = () => {
        if(!GLOBALS.IS_BOX_CONNECTED && GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.HTTP){
            return ;
        }
        if (this._hasData && !this._loading && this._loaded) {
            this._loadData(this.props.lan, this._page + 1,this._pageCount,this._searchTerm);
            this.setState({});
        }
    }
    _showOptOverlay = (id,overlayType,actor) =>{
        const {listType}=this.props;
        var _height = 200;
        var _songMenutype = GLOBALS.SONG_MENU_TYPE.NORMAL;
        
        if(listType ==GLOBALS.SONG_LIST_TYPE.SINGER ){
            _height = 150;
            _songMenutype = GLOBALS.SONG_MENU_TYPE.SINGER;
        }

        EventRegister.emit('ShowOptOverlay', 
                {overlayType:overlayType,
                data:{
                    menuType: _songMenutype,
                    songId:id,
                    height:_height,
                    actor:actor}
                });
    }
    _renderFooter = () => {
        return (this._loading && this._loaded) ?
            <View style={{ height: 60, width: '100%', justifyContent: "center", alignContent: "center" }}>
                <IndicatorView isShow ={true} />
            </View> :
            <View style={{ height: 1, width: '100%' }} />;
    }
    _rowRenderer = (type, item) => {
        const {id,name,actor,singerName,status} = item;
        const {listType} = this.props;
        var _status = (listType != GLOBALS.SONG_LIST_TYPE.SELECTED)?status:GLOBALS.SING_STATUS.NORMAL;
        const singColor = GLOBALS.SING_COLORS[_status];
        const singerColor = GLOBALS.SINGER_COLORS[_status];
        let singPrefix = GLOBALS.SING_PREFIX[_status];
        let overlayType = GLOBALS.SING_OVERLAY.NORMAL;
       // console.warn("Name = "+item["Name"]+" , item = "+item);
        if(status == GLOBALS.SING_STATUS.DOWNLOADING){
            singPrefix = "[ " + item.progress  + "% ]";
        }
        else{
            singPrefix = (singPrefix != "") ? ("(" + singPrefix  + item.index  + ")") : "";
        }
        var hasOptionButton = (status  == GLOBALS.SING_STATUS.NO_DOWNLOADED
                                || status  == GLOBALS.SING_STATUS.DOWNLOADING)?false:true;

        return (
            <ListItem
                style={styles.listItem}
                onPress={this._onPressSong.bind(this, id, status)}
               // underlayColor="white"
                >
                <View style={{
                    flex: 1, flexDirection: "row", justifyContent: "center",
                    alignItems: "center", height: 60, marginLeft: 17, marginRight: 5}}>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={[styles.songText, {color: singColor }]}>
                            {name + singPrefix}
                        </Text>
                        <Text style={[styles.singerText, {color: singerColor }]}>
                            {singerName}
                        </Text>
                    </View>
                    { hasOptionButton &&
                        <View style={{ width: 55, height: 55 }}>
                            <IconRippe vector={true} name="tuychon" size={20} 
                                onPress={this._showOptOverlay.bind(this,id,overlayType,actor)} />
                        </View> }
                </View>
            </ListItem>
        );
    };

    _rowRenderer2 = (type, item) => {
        const {id,name,actor,singerName,status} = item;
        const {listType} = this.props;
        var _status = (listType != GLOBALS.SONG_LIST_TYPE.SELECTED)?status:GLOBALS.SING_STATUS.NORMAL;
        const singColor = GLOBALS.SING_COLORS[_status];
        const singerColor = GLOBALS.SINGER_COLORS[_status];
        let singPrefix = GLOBALS.SING_PREFIX[_status];
        let overlayType = GLOBALS.SING_OVERLAY.NORMAL;
       // console.warn("Name = "+item["Name"]+" , item = "+item);
        if(status == GLOBALS.SING_STATUS.DOWNLOADING){
            singPrefix = "[ " + item.progress  + "% ]";
        }
        else{
            singPrefix = (singPrefix != "") ? ("(" + singPrefix  + item.index  + ")") : "";
        }
        var hasOptionButton = (status  == GLOBALS.SING_STATUS.NO_DOWNLOADED
                                || status  == GLOBALS.SING_STATUS.DOWNLOADING)?false:true;

        return (
            <View style={styles.listItem2}>
                <ListItem
                    style={{width:"100%",height:53}}
                    rippleRound = {true}
                    onPress={this._onPressSong.bind(this, id, status)}
                    >
                    <View style={{
                        flex: 1, flexDirection: "row", justifyContent: "center",alignItems:"center"}}>
                        <View  style={{ flex:1,justifyContent: "center"}}>
                            <Text numberOfLines={1} style={[styles.songText, {color: singColor,fontSize:19,marginLeft:10,fontFamily:GLOBALS.FONT.BOLD }]}>
                                    {name  + singPrefix}
                            </Text>
                            <Text style={[styles.singerText, {color: singerColor,fontSize:16, marginLeft:10,fontFamily:GLOBALS.FONT.MEDIUM}]}>
                                {singerName}
                            </Text>
                        </View>
                        
                        { hasOptionButton &&
                            <View style={{ width: 40, height: 40 }}>
                                <IconRippe vector={true} name="tuychon2" size={20} 
                                    onPress={this._showOptOverlay.bind(this,id,overlayType,actor)} />
                            </View> }
                    </View>
                </ListItem>
            </View>
        );
    };
    render = () => {
        return (
            <View style={{ flex: 1 }}>
                <RecyclerListView
                    style={{ flex: 1,marginLeft:15,marginRight:15 }}
                    //contentContainerStyle={{ margin: 3 }}
                    showsHorizontalScrollIndicator={false}
                    //showsVerticalScrollIndicator={false}
                    onEndReached={this._onEndReached}
                    dataProvider={this.state.dataProvider}
                    layoutProvider={(GLOBALS.LANDSCAPE)?this._layoutProvider2:this._layoutProvider}
                    rowRenderer={(GLOBALS.LANDSCAPE)?this._rowRenderer2:this._rowRenderer}
                    renderFooter={this._renderFooter}
                    extendedState={this.state.dataProvider} 
                    renderAheadOffset = {1000}
                    />
                <IndicatorView ref={ref => (this._indicator = ref)}/>
            </View>

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

    listItem2: {
        marginLeft:5,
        marginRight:5,
        height: 55,
        borderWidth: 1,
        borderColor: '#B3DADF',
        borderRadius: 5,
        backgroundColor:"#3D4B84"
        // justifyContent:"center",
        // alignItems:"center"
    },

    songText: {
        color: "#fff",
        fontFamily:GLOBALS.FONT.MEDIUM,
        fontSize: 18, 
        lineHeight: 25, 
    },

    singerText:{
        color: "#fff",
        fontFamily:GLOBALS.FONT.REGULAR,
        fontSize: 13
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
