import React from "react";
import { StyleSheet,View, Text, Animated,Image} from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister  } from 'react-native-event-listeners';
import SongListView from '../../Views/SongListView.js';
import MusicOnline from '../../Views/MusicOnlineButton.js';
import Header from '../Header/index';
import Header4 from '../Header/header4';
import SearchInput from '../../Views/SearchInput';
import Utils from "../../Utils/Utils.js";
import BTELib from "react-native-bte-lib";

export default class SongListScreen extends BaseScreen {
    static propTypes = {
        ...this.props,
        onBack: PropTypes.func,
        listType: PropTypes.number,
        songType: PropTypes.number,
        title: PropTypes.string,
    };

    // static defaultProps ={
    //     ...this.defaultProps,
    //     // songType: GLOBALS.SONG_TYPE.ALL,
    //     listType: GLOBALS.SONG_LIST_TYPE.ALL,
    // }
    _songList = null
    constructor(props) {
        super(props);

        this.songChanged = false;
        this.reLoad = false;
        this.listType = (this.props.listType == null || this.props.listType == undefined)?GLOBALS.SONG_LIST_TYPE.ALL:this.props.listType
        this.state = {
            singerName : "",
            singerId : -1,
            songType : GLOBALS.SONG_TYPE.ALL,
            title:(this.props.title != null)?this.props.title:"",
            avatar : ""
        }

        this.MAX_SCROLL_HEIGHT = 105;
    }
    componentWillMount() {
        // selected song changed
        this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
            if(this._isVisible && this._songList != null){
                this._songList.updateSong();
            }
            else{
                this.songChanged = true;
            }
        });

        this._listenerDownloadSongEvent = EventRegister.addEventListener('SongDownloadUpdate', () => {
            if(this._isVisible && this._songList != null){
                this._songList.updateDownloadSong();
            }
        });
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerSongUpdateEvent);
        EventRegister.removeEventListener(this._listenerDownloadSongEvent);
    }
    _onBack = () => {
        const { onBack } = this.props;
        //this._searchInput.blur();
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () =>{
        if(this.reLoad){
            this._songList.refreshData("");
            this.reLoad = false;
        }
        else if(this.songChanged){
            this._songList.updateSong();
            this.songChanged = false;
        }
    }
    _onSearch = (value) =>{
       // this._term = value;
        //console.warn("_onSearch = "+value);
        this._serach(value);
    }
    _onSearchChange = (value) =>{
       // console.warn("_onSearchChange = "+value);
        this._serach(value);
    }
    _serach = (value) => {
        this._songList.searchData(value);
        this._musicOnline.setTerm(value);
    }
    updateSinger = (name)=>{
        if(name != this.state.title){
            this._allowLoad = true;
            this.setState({
                singerName:name,
                title: name
            });

            BTELib.getUrlActorAvatar(name,0,(url,_index)=>{
                this.setState({
                    avatar:url,
                });
            });

            this.reLoad = true;
            this.clear();
        }
    }
    updateSongType = (type,name)=>{
        if(type != this.state.songType){
            this._allowLoad = true;
            this.setState({
                songType:type,
                title:name
            })
            this.reLoad = true;
            this.clear();
        }
    }
    loadData = () =>{
        this.setVisible(true);
        this._songList.loadData("");
    }
    clear = () =>{
        if(this._songList != null)
            this._songList.clear();

        this._searchHeader.clear();
    }
    scrollExtendComponent = (top) =>{
        this._musicOnline.setTopValue(top);
    }
    renderContent = () =>{
        const {singerName,songType,} = this.state;
        if(!this.props.preLoad || this._allowLoad){
            if(GLOBALS.LANDSCAPE){
                return (
                    <View style={{flex:1}}>
                        <MusicOnline 
                            style={{top:50}} 
                            ref={ref =>(this._musicOnline = ref)}
                            onOpenOnline = {()=>{
                                //this._searchInput.blur();
                            }} />
    
                        <SongListView 
                            ref={ref=>(this._songList = ref)} 
                            listType = {this.listType} 
                            actor ={singerName} 
                            songType = {songType}
                            onScroll = {this._handleListViewScroll} 
                            top={this.MAX_SCROLL_HEIGHT}
                        />
                    </View>
                )
            }
            else{
                return (
                    <View style={{flex:1}}>
                        <MusicOnline 
                            style={{top:55,height:40}} 
                            ref={ref =>(this._musicOnline = ref)}
                            onOpenOnline = {()=>{
                                //this._searchInput.blur();
                            }} />
    
                        <SongListView 
                            ref={ref=>(this._songList = ref)} 
                            listType = {this.listType} 
                            actor ={singerName} 
                            songType = {songType}
                            onScroll = {this._handleListViewScroll} 
                            top={this.MAX_SCROLL_HEIGHT}
                            onSearch = {(value)=>{
                                this._searchHeader.showIndicator(value);
                            }}
                        />
                    </View>
                )
            }
            
        }
    }

    renderContentView = () => {
        const {title } = this.state;
        const {searchHolder} = this.props;
        
        if(GLOBALS.LANDSCAPE){
            return (
                <View style={{ flex: 1,width:'100%' }}>
                    <Animated.View style={[styles.headerContainer,{ transform: [{ translateY: this._scrollY }]}]}>
                        <Header 
                            ref = {ref=>(this._searchHeader = ref)}
                            h={40}
                            onBack = {this._onBack}
                            onSearch = {this._onSearch}
                            onSearchChange = {this._onSearchChange}
                            center ={
                                <View style={{flex:1,justifyContent:"center",alignItems:"center", flexDirection:"row"}}>
                                    {this.state.avatar !="" && 
                                        <Image style={{width:34,height:34,borderRadius:17}} 
                                            source={{uri:this.state.avatar}} />}
                                    <Text style={[styles.title]}> {title}</Text>
                                </View>
                            }
                        />
                    </Animated.View>
                    {this.renderContent()}
                </View>
            );
        }
        else{
            return (
                <View style={{ flex: 1,width:'100%' }}>
                    <Animated.View style={[styles.headerContainer,{height:GLOBALS.HEADER_HEIGHT, transform: [{ translateY: this._scrollY }]}]}>
                        <Header4
                            ref={ref=>(this._searchHeader = ref)}
                            searchHolder = {searchHolder}
                            onSearch={this._onSearch}
                            onSearchChange = {this._onSearchChange}
                            onBack = {this._onBack}
                            left={this.state.avatar !="" && 
                                    <View style={{width:45,height:40, fjustifyContent:"flex-start",alignItems:"center", flexDirection:"row"}}>
                                        <Image style={{width:34,height:34,borderRadius:17}} 
                                            source={{uri:this.state.avatar}} />
                                    {/* <Text style={[styles.title]}> {title}</Text> */}
                                 </View>}
                        />
                    </Animated.View>
                    {this.renderContent()}
                </View>
            );
        }
        
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 40,
        width:"100%",
        top:0,
        position:"absolute",
        zIndex:3,
    },
    title: {
        fontSize: 20,
        fontWeight: '300',
        marginLeft:5,
        color:"#fff",
        fontFamily:GLOBALS.FONT.BOLD
    },
})