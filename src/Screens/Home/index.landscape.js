import React from "react";
import { StatusBar,StyleSheet,View,TextInput } from "react-native";

// screens
import Footer from '../Footer/footer.landscape.js';
import HomeScreen from './home.landscape';
import SongTabScreen from '../BaiHat/SongTabScreen';
import SelectedSong from '../BaiHat/SelectedSong.js';
import SingerScreen from '../Singer/index.js';
import SingOptionOverlay from '../Overlay/OptionOverlay.js';
//import TheloaiScreen from '../TheLoai/index.js'
import OnlineScreen from '../Online/index.js'
import SecondScreen from '../../SideBar/SecondScreen';
import SongOnlineScreen from '../Online/onlineScreen.landscape';
import SongListScreen from '../../Screens/BaiHat/SongListScreen';
import AdminScreen from '../../Screens/Admin/index';
import Utils from '../../Utils/Utils';

import { EventRegister } from 'react-native-event-listeners'
import GLOBALS from "../../DataManagers/Globals.js";
import BoxControl from "../../DataManagers/BoxControl.js";
import DATA_INFO from "../../DataManagers/DataInfo.js";
import BTElib from 'react-native-bte-lib';
import { DeviceEventEmitter } from 'react-native';

export default class Landscape extends React.Component {
    _currentScreen = null;
    constructor(props) {
        super(props);
        //console.ignoredYellowBox = true;
        //console.disableYellowBox = true;
        console.disableYellowBox = ['Warning: Stateless'];
        GLOBALS.INFO.VERSION = GLOBALS.BOX_VERSION.S650;
        GLOBALS.INFO.CONNECT = GLOBALS.DATABASE_CONNECT.HTTP;
       // GLOBALS.INFO.CONNECT = GLOBALS.DATABASE_CONNECT.SQLITE;
        GLOBALS.LANDSCAPE = true;
    }

    componentDidMount() {
        //console.warn("componentDidMount");
       // this._currentScreen = this._homeScreen; 

        BTElib.checkConnectToWifiBox();
        BTElib.syncPlaybackQueue();
        BTElib.syncPlaybackInfo();
        BTElib.syncDownloadQueue();

        DeviceEventEmitter.addListener('ConnectToBox', this.handleConnectToBox);
        DeviceEventEmitter.addListener('PlaybackInfoUpdate', this.handlePlaybackChange);
        DeviceEventEmitter.addListener('SongQueueChange', this.handleSongQueueChange);
        DeviceEventEmitter.addListener('DownloadQueue', this.handleDownloadQueue);
    }

    handleConnectToBox = (e) =>{
        GLOBALS.IS_BOX_CONNECTED = e['isConnected'];
        GLOBALS.IS_NO_WIFI_CHECKED = false;
        // connect to box event
        EventRegister.emit("ConnectToBox",e);
        // Refresh song list
        EventRegister.emit("SongUpdate",{});
        BoxControl.getDownloadQueue();
    }   
    handlePlaybackChange = (e) =>{
        DATA_INFO.PLAYBACK_INFO.IsPlaying = (e['play']== 1)?true:false;
        DATA_INFO.PLAYBACK_INFO.IsMute = (e['mute'] == 1)?true:false;
        DATA_INFO.PLAYBACK_INFO.IsOriginal = (e['original'] == 1)?true:false;
        DATA_INFO.PLAYBACK_INFO.Volume = e['volume']/100;

        EventRegister.emit("PlaybackInfoChange",{});
    }
    handleSongQueueChange = (e) =>{
        DATA_INFO.PLAY_QUEUE = e['queue'];
        // Refresh song list
        EventRegister.emit("SongUpdate",{});

    }
    handleDownloadQueue = (e)=>{
        BoxControl.getDownloadQueue();
    }
    componentWillMount() {
        // Hide Footer
        this._listenerHideFooterEvent = EventRegister.addEventListener('HideFooter', (data) => {
            this._footer.hide();
        });
        // Show Footer
        this._listenerShowFooterEvent = EventRegister.addEventListener('ShowFooter', (data) => {
            setTimeout(()=>{
                this._footer.show();
            },300);
        });

        // Show overlay
        this._listenerShowOptOverlayEvent = EventRegister.addEventListener('ShowOptOverlay', (data) => {
            this._showOverlay(data);
        });

        // Open Second screen
        this._listenerOpenSecondScreenEvent = EventRegister.addEventListener('OpenSecondScreen', (data) => {
            this._secondScreen.open(data.type);
        });

        //show online screen
        this._listenerShowOnlineScreenEvent = EventRegister.addEventListener('ShowOnlineScreen', (data) => {
            if(data.type == GLOBALS.SONG_ONLINE.YOUTUBE){
                this.youtubeSong.show();
            }
            else if(data.type == GLOBALS.SONG_ONLINE.SOUNDCLOUD){
                this.soundSong.show();
            }
            else if(data.type == GLOBALS.SONG_ONLINE.MIXCLOUD){
                this.mixSong.show();
            }

            if(data.term != null)
                setTimeout(()=>{
                    if(data.type == GLOBALS.SONG_ONLINE.YOUTUBE){
                        this.youtubeSong.focus(data.term);
                    }
                    else if(data.type == GLOBALS.SONG_ONLINE.SOUNDCLOUD){
                        this.soundSong.focus(data.term);
                    }
                    else if(data.type == GLOBALS.SONG_ONLINE.MIXCLOUD){
                        this.mixSong.focus(data.term);
                    }
                },200);
        });

        this._listenerSingerSongEvent = EventRegister.addEventListener('OpenSingerSong', (data) => {
            this._singerSong.updateSinger(data.name);
            this._singerSong.show();
        });

        this._listenerAdminScreenEvent = EventRegister.addEventListener('OpenAdminScreen', (data) => {
            this._adminScreen.show();
        });

        this._listenerShowKeybroardEvent = EventRegister.addEventListener('ShowKeybroard', (data) => {
            this._showOverlay({overlayType:GLOBALS.SING_OVERLAY.KEYBROARD,data:{input:data.input}});
        });

        this._listenerHideKeybroardEvent = EventRegister.addEventListener('HideKeybroard', (data) => {
            this._singOverlay.hide();
        });
    }
    componentWillUnmount() {
        //EventRegister.removeEventListener(this._listenerControlEvent);
        EventRegister.removeEventListener(this._listenerHideFooterEvent);
        EventRegister.removeEventListener(this._listenerShowFooterEvent);
        EventRegister.removeEventListener(this._listenerShowOptOverlayEvent);
        EventRegister.removeEventListener(this._listenerOpenSecondScreenEvent);
        EventRegister.removeEventListener(this._listenerShowOnlineScreenEvent);
        EventRegister.removeEventListener(this._listenerSingerSongEvent);
        EventRegister.removeEventListener(this._listenerAdminScreenEvent);
        EventRegister.removeEventListener(this._listenerShowKeybroardEvent);
        EventRegister.removeEventListener(this._listenerHideKeybroardEvent);
    }
    _showOverlay= (data)=>{
        this._singOverlay.updateView(data.overlayType,data.data);
        this._footer.hide();
        this._singOverlay.show();
    }
    _onOpenSearch = () => {
        this._searchScreen.show();
        setTimeout(()=>{
            this._searchScreen.focusSearchInput();
        },500);

        this._currentScreen = this._searchScreen;
    }
    _onOpenSinger = () =>{
        this._singerScreen.show();
        this._currentScreen = this._singerScreen;
        //console.warn("Landscape width = "+Utils.Width()+" , Height = "+Utils.Height());
    }
    _onOpenSong = () =>{
        this._songScreen.show();
        this._currentScreen = this._songScreen;
    }
    _onOpenHotSong = () =>{
        this._hotScreen.show();
        this._currentScreen = this._hotScreen;
    }
    _onOpenTheloai = () =>{
        this._theloaiScreen.show();
        this._currentScreen = this._theloaiScreen;
    }
    _onOnlineScreen = () => {
        this._onlineScreen.show();
        this._currentScreen = this._onlineScreen;
    }
    _onOpenSelectedSong = () => {
       // this._currentScreen.hide();
        this._selectedSong.show();
    }
   
    _onBackHome = ()=>{
        this._currentScreen.hide();
        this._currentScreen = this._homeScreen; 
    }
    _onCloseSelectedSong = () => {
        this._selectedSong.hide();
        //this._currentScreen.show();
    }
    _onSingOverlayClose = () => {
        this._footer.show();
    }
    render() {
        return (
            <View style={{ flex: 1}}>
                
                 <SecondScreen 
                    bottom = {0}
                    opacity= {0} 
                    maxZindex ={11} 
                    transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                    duration={250}
                    onBack={()=>{
                        this._secondScreen.hide();
                    }} 
                    ref={ref => (this._secondScreen = ref)} />

                <SingOptionOverlay 
                    opacity={0} 
                    maxZindex={10} 
                    ref={ref => (this._singOverlay = ref)} 
                    onClose ={this._onSingOverlayClose}
                />
                <SongListScreen 
                    ref = {ref => (this._singerSong = ref)} 
                    transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                    maxZindex = {6}
                    listType={GLOBALS.SONG_LIST_TYPE.SINGER}
                    onBack = {() => {
                        this._singerSong.hide();}} 
                    bottom={60}
                        />

                <OnlineScreen  opacity= {0} maxZindex ={2} 
                    transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                    duration={250}
                    onBack={this._onBackHome} 
                    ref={ref => (this._onlineScreen = ref)} 
                    bottom={60}
                />
                
                <SongTabScreen 
                    opacity= {0} maxZindex ={5} transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                    duration={250}
                    onBack={this._onBackHome} ref={ref => (this._songScreen = ref)}
                    bottom={60}
                />
                <SongListScreen opacity= {0} maxZindex ={5} transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                    duration={250}
                    listType={GLOBALS.SONG_LIST_TYPE.HOT}
                    title ={"Bài Hot"}
                    onBack={this._onBackHome} ref={ref => (this._hotScreen = ref)}
                    bottom={60}
                />
                
                <SongTabScreen 
                    opacity= {0} maxZindex ={5} transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                    duration={250}
                    onBack={this._onBackHome} ref={ref => (this._theloaiScreen = ref)}
                    bottom={60}
                    tabType={GLOBALS.SONG_TAB.SONG_TYPE}
                />

                
                <SelectedSong maxZindex ={7} transition = {GLOBALS.TRANSITION.SLIDE_TOP}
                    onBack={this._onCloseSelectedSong} ref={ref => (this._selectedSong = ref)}
                    bottom={60}
                />

                <SongOnlineScreen 
                    ref = {ref => (this.youtubeSong = ref)} 
                    type = {GLOBALS.SONG_ONLINE.YOUTUBE}
                    transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                    maxZindex = {6}
                    onBack = {() => {
                        this.youtubeSong.hide();
                    }}
                    bottom={60}
                />
                <SongOnlineScreen 
                    ref = {ref => (this.soundSong = ref)} 
                    type = {GLOBALS.SONG_ONLINE.SOUNDCLOUD}
                    transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                    maxZindex = {6}
                    onBack = {() => {
                        this.soundSong.hide();
                    }}
                    bottom={60}
                />
                <SongOnlineScreen 
                    ref = {ref => (this.mixSong = ref)} 
                    type = {GLOBALS.SONG_ONLINE.MIXCLOUD}
                    transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                    maxZindex = {6}
                    onBack = {() => {
                        this.mixSong.hide();
                    }}
                    bottom={60}
                />    

               
                <SongTabScreen opacity= {0} maxZindex ={5} transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                    duration={250}
                    onBack={this._onBackHome} ref={ref => (this._searchScreen = ref)}
                    bottom={60}
                />

                <AdminScreen 
                    ref = {ref => (this._adminScreen = ref)} 
                    transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                    maxZindex = {12}
                    bottom = {10}
                    onBack = {() => {
                        this._adminScreen.hide();
                    }}
                />

                
                <SingerScreen 
                        opacity= {1}
                        maxZindex ={2} 
                        transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={250}
                        onBack={this._onBackHome} 
                        ref={ref => (this._singerScreen = ref)}
                        bottom={60}
                    />
                

                <HomeScreen 
                        //zIndex={1}  
                       // opacity= {1} maxZindex ={1} 
                        onOpenSearch={this._onOpenSearch}
                        onOpenSinger = {this._onOpenSinger}
                        onOpenTheloai = {this._onOpenTheloai}
                        onOpenSong = {this._onOpenSong}
                        onOpenHotSong = {this._onOpenHotSong}
                        onOnlineScreen = {this._onOnlineScreen}
                        onOpenMenu = {() =>{
                            //this.props.navigation.openDrawer();        
                        }}
                        ref={ref => (this._homeScreen = ref)} 
                        //bottom={60}
                    />  

                <Footer ref={ref => (this._footer = ref)} maxZindex ={8} 
                    onSelectedSong={this._onOpenSelectedSong} />
                <StatusBar
                    backgroundColor={GLOBALS.COLORS.STATUS_BAR}
                    // translucent={true}
                    barStyle="light-content"
                ></StatusBar>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
})
