import React from "react";
import { StyleSheet, Dimensions,Text,View,ScrollView} from "react-native";
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
import CustomIcon from '../Components/CustomIcon';

let { height, width } = Dimensions.get('window');
export default class SongListView extends React.Component {
    static propTypes = {
        lan: PropTypes.string,
        actor : PropTypes.string,
        songType : PropTypes.number,
        listType : PropTypes.number,
        top: PropTypes.number,
        onScroll : PropTypes.func,
        //onOptionOverlayOpen: PropTypes.func,
        //onBack: PropTypes.func,
        //duration : PropTypes.number
        onSearch : PropTypes.func

    };
    static defaultProps = {
        lan : GLOBALS.LANGUAGE_KEY.all,
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
    _pageCount = 20;
    _searchTerm = "";
    _hasChanged = false;
    _actionButtons = [];
    _selectedList = true;
    constructor(props) {
        super(props);

        if(this.props.listType == GLOBALS.SONG_LIST_TYPE.SELECTED
            || this.props.listType == GLOBALS.SONG_LIST_TYPE.DOWNLOADING
                || this.props.listType == GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD){
            this._selectedList = false;
        }
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
                        dim.width = width-31;
                        dim.height = 65;
                        break;
                    default:
                        dim.width = width/2;
                        dim.height = 65;
                }
            }
        );

        this._loadData = this._loadData.bind(this);
        this._actionButtons = this.generateSongActions();
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
        //console.warn("updateDownloadSong");
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
        
        this._onSearch(true);
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
    
    loadData = () =>{
        this.loadData(this._searchTerm);
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
        if(this._indicator == null)
            return;

        this._loading = false;
        var newDatas = [];
        //console.warn("_handleFetchDataCompleted data length = "+datas.length);
        if(this._loaded){
            startId = this.state.datas.length;
            newDatas = this.state.datas.concat(datas);
        }
        else{
            newDatas = datas;
        }

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

        this._onSearch(false);
        this.setState({
            dataProvider: this.state.dataProvider.cloneWithRows(newDatas),
            datas: newDatas
        });
    }
    _onSearch = (isSearching) =>{
        if(this.props.onSearch != null){
            this.props.onSearch(isSearching);
        }
    }
    _onPressSong = (id, status) => {
        //return;
        BoxControl.selectSong(id);
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
        var _height = this._actionButtons.length*50+10;
        
        EventRegister.emit('ShowOptOverlay', 
                {overlayType:overlayType,
                data:{
                    songId:id,
                    buttons: this._actionButtons,
                    height:_height,
                    actor:actor}
                });
    }
    getCurrentScrollOffset= () =>{
        return this._listView.getCurrentScrollOffset();
    }
    _handleActionSong=(type,id,actor)=>{
        if(type == GLOBALS.SONG_ACTION.DOWNLOAD){
            BoxControl.downloadSong(id,(errorCode)=>{
            });
        }
        else if(type == GLOBALS.SONG_ACTION.PLAY){
            BoxControl.playNow(id);
        }
        else if(type == GLOBALS.SONG_ACTION.PRIORITY){
            BoxControl.priority(id);
        }
        else if(type == GLOBALS.SONG_ACTION.SINGER){
            EventRegister.emit("OpenSingerSong",{name:actor});
        }
    }
    _renderFooter = () => {
        return (this._loading && this._loaded) ?
            <View style={{ height: 60, width: '100%', justifyContent: "center", alignContent: "center" }}>
                <IndicatorView isShow ={true} />
            </View> :
            <View style={{ height: 1, width: '100%' }} />;
    }
    _renderActionButton = (songId,overlayType,actor)=>{
        const {listType} = this.props;
        if(this._actionButtons.length == 0)
            return;
        else if(this._actionButtons.length == 1){
            return(
                <View style={{ width: 40, height: 40 }}>
                            <IconRippe vector={true} name={this._actionButtons[0].icon} size={20} 
                                onPress={()=>{
                                    if(listType == GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD){
                                        BoxControl.downloadSong(songId,(errorCode)=>{
                                        });        
                                    }
                                }} 
                            />
                        </View>
            );
        }
        else{
            return(
                <View style={{ width: 40, height: 40 }}>
                    <IconRippe vector={true} name={GLOBALS.LANDSCAPE?"tuychon2":"tuychon"} size={20} 
                        onPress={this._showOptOverlay.bind(this,songId,overlayType,actor)} 
                    />
                </View>
            );
        }
    }
    _rowRenderer = (type, item, index) => {
        const {id,name,actor,singerName,status} = item;
        const {listType} = this.props;
        var _status = (listType != GLOBALS.SONG_LIST_TYPE.SELECTED)?status:GLOBALS.SING_STATUS.NORMAL;
        const singColor = GLOBALS.SING_COLORS[_status];
        const singerColor = GLOBALS.SINGER_COLORS[_status];
        let singPrefix = GLOBALS.SING_PREFIX[_status];
        let overlayType = GLOBALS.SING_OVERLAY.NORMAL;
       // console.warn("_status = "+_status+" , singColor = "+singColor);
        if(status == GLOBALS.SING_STATUS.DOWNLOADING){
            singPrefix = "[ " + item.progress  + "% ]";
        }
        else{
            singPrefix = (singPrefix != "") ? ("(" + singPrefix  + item.index  + ")") : "";
        }

        var hasOptionButton = (status  == GLOBALS.SING_STATUS.NO_DOWNLOADED
                                || status  == GLOBALS.SING_STATUS.DOWNLOADING)?false:true;
        var containerStyle = {};
        if(index == 0){
            containerStyle.borderTopWidth = 0.5;
            //containerStyle.borderColor= '#00ECBC';
        }
        return (
            <ListItem
                style={[styles.listItem,containerStyle]}
                onPress={this._onPressSong.bind(this, id, status)}
                selected={this._selectedList}
                >
                <View style={{
                    flex: 1, flexDirection: "row", justifyContent: "center",
                    alignItems: "center", height: 60, marginLeft: 15, marginRight: 5}}>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={[styles.songText, {fontSize:19,color: singColor }]}>
                            {name + singPrefix}
                        </Text>
                        <Text style={[styles.singerText, {fontSize:15,color: singerColor }]}>
                            {singerName}
                        </Text>
                    </View>
                    { this._renderActionButton(id,overlayType,actor)} 
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
        // var hasOptionButton = (status  == GLOBALS.SING_STATUS.NO_DOWNLOADED
        //                         || status  == GLOBALS.SING_STATUS.DOWNLOADING)?false:true;
        //var buttons = this.generateSongActions(status);

        return (
            <View style={styles.listItem2}>
                <ListItem
                    style={{width:"100%",height:53}}
                    rippleRound = {true}
                        onPress={this._onPressSong.bind(this, id, status)}
                    >
                    <View style={{
                        flex: 1, flexDirection: "row", justifyContent: "center",alignItems:"center"}}>
                        <View  style={{ flex:1, flexDirection:"row"}}>
                            <View style={{ flex:1, justifyContent:"center",alignItems:"flex-start", paddingLeft:15, paddingRight:10}}>
                                <Text numberOfLines={2} style={[styles.songText, {color: singColor }]}>
                                        {name  + singPrefix}
                                </Text>
                            </View>
                            
                            <View style={{ width:"30%", justifyContent:"center",alignItems:"flex-start", paddingRight:10}}>
                                <Text numberOfLines={0} style={[styles.singerText, {color: singerColor,}]}>
                                    {singerName}
                                </Text>
                            </View>
                            { this._renderActionButton(id,overlayType,actor)} 
                        </View>
                    </View>
                </ListItem>
            </View>
        );
    }

    generateSongActions = () =>{
        var buttons = [];
        const {listType} = this.props
        if(listType == GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD){
            buttons.push({
                icon : "download",
                type: GLOBALS.SONG_ACTION.DOWNLOAD,
                name :"Tải bài"
            });
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.USB 
                || listType == GLOBALS.SONG_LIST_TYPE.DOWNLOADING){
            buttons = [];         
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.AUTO){
            buttons.push({
                icon : "closeMenu",
                type: GLOBALS.SONG_ACTION.REMOVE_AUTO,
                name:"Xóa bài"
            });
        }
        else{
            buttons.push({
                icon : "play2",
                type: GLOBALS.SONG_ACTION.PLAY,
                name: "Hát ngay"
            });
            buttons.push({
                icon : "uutien",
                type: GLOBALS.SONG_ACTION.PRIORITY,
                name: "Ưu tiên"
            });
            if(listType == GLOBALS.SONG_LIST_TYPE.SELECTED){
                buttons.push({
                    icon : "closeMenu",
                    type: GLOBALS.SONG_ACTION.REMOVE_SELECT,
                    name: "Xóa chọn"
                });
            }
            if(listType != GLOBALS.SONG_LIST_TYPE.SINGER
                && listType != GLOBALS.SONG_LIST_TYPE.SELECTED){
                buttons.push({
                    icon : "singerOpt",
                    type: GLOBALS.SONG_ACTION.SINGER,
                    name: "Ca sỹ"
                });
            }
            buttons.push({
                icon : "auto",
                type: GLOBALS.SONG_ACTION.ADD_AUTO,
                name: "Bài tự động"
            });
        }
        //console.warn("buttons length = "+buttons.length);
        return buttons;
    }

    render = () => {
        var containerStyle = {};
       
        return (
            <View style={{ flex: 1 }}>
                <RecyclerListView
                    ref={ref => (this._listView = ref)}
                    style={[{ flex: 1},containerStyle]}
                    //contentContainerStyle={{ margin: 3 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this._onEndReached}
                    dataProvider={this.state.dataProvider}
                    layoutProvider={(GLOBALS.LANDSCAPE)?this._layoutProvider2:this._layoutProvider}
                    rowRenderer={(GLOBALS.LANDSCAPE)?this._rowRenderer2:this._rowRenderer}
                    renderFooter={this._renderFooter}
                    extendedState={this.state.dataProvider} 
                    renderAheadOffset = {(GLOBALS.LANDSCAPE)?300:250}
                    externalScrollView={this.renderScroll}
                    onScroll = {(rawEvent, offsetX, offsetY)=>{
                        if(this.props.onScroll != null){
                            this.props.onScroll(offsetY);
                        }
                    }}
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
        borderBottomWidth: 0.5,
        borderColor: '#00ECBC',
    },

    listItem2: {
        marginLeft:5,
        marginRight:5,
        height: 55,
        borderWidth: 0,
        borderColor: '#B3DADF',
        borderRadius: 5,
        backgroundColor:"#3D4B84",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },

    songText: {
        color: "#fff",
        lineHeight: 25, 
        fontSize:20,
        fontFamily:GLOBALS.FONT.BOLD
    },

    singerText:{
        color: "#fff",
        fontFamily:GLOBALS.FONT.REGULAR,
        fontSize:17, 
        fontFamily:GLOBALS.FONT.MEDIUM
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
