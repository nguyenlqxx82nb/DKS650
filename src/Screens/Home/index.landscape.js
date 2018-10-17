import React from "react";
import { StatusBar,StyleSheet,View,Platform ,AsyncStorage, BackHandler } from "react-native";

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

import Language from "../../DataManagers/Language";
import SplashScreen from 'react-native-splash-screen';
import Toast, { DURATION } from 'react-native-easy-toast';

export default class Landscape extends React.Component {
    _currentScreen = null;
    _isLan = false;
    _isConnected = false;
    _screens = [];
    constructor(props) {
        super(props);
        //console.ignoredYellowBox = true;
        console.disableYellowBox = true;
        //console.ignoredYellowBox = ['Warning:']; // = ['Warning: Stateless'];
        GLOBALS.INFO.VERSION = GLOBALS.BOX_VERSION.S650;
        //GLOBALS.INFO.CONNECT = GLOBALS.DATABASE_CONNECT.HTTP;
        //GLOBALS.INFO.CONNECT = GLOBALS.DATABASE_CONNECT.SQLITE;
        GLOBALS.INFO.CONNECT = GLOBALS.DATABASE_CONNECT.MYSQL;
        GLOBALS.LANDSCAPE = true;
        if(GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.SQLITE){
            GLOBALS.IS_DATABASE_CONNECTED = true;
        }

        var minSize = Math.min(Utils.Width(), Utils.Height());
        if (minSize < 610) {
            GLOBALS.LANDSCAPE_SMALL = true;
            GLOBALS.FOOTER_HEIGHT = 60;
            GLOBALS.HEADER_HEIGHT = 40;
        }
        else if(minSize < 705){
            GLOBALS.LANDSCAPE_NORMAL = true;
            GLOBALS.FOOTER_HEIGHT = 70;
            GLOBALS.HEADER_HEIGHT = 45;
            GLOBALS.ICON_SIZE = 25;
        }
        else {
            GLOBALS.LANDSCAPE_LARGE = true;
            GLOBALS.FOOTER_HEIGHT = 80;
            GLOBALS.HEADER_HEIGHT = 55;
            GLOBALS.ICON_SIZE = 30;
        }

        if (GLOBALS.MOBILE_SMALL) {
            GLOBALS.TITLE.fontSize = 18;
        }

        this._retrieveLanguage();
    }

    _retrieveLanguage = async () => {
        try {
            GLOBALS.LAN = await AsyncStorage.getItem('lan');
            GLOBALS.PASS = await AsyncStorage.getItem('pass');
            if (GLOBALS.LAN == null) {
                // We have data!!
                GLOBALS.LAN = 'vn'
            }
            GLOBALS.PASS = (GLOBALS.PASS == null) ? "12345" : GLOBALS.PASS;

            this._isLan = true;
            Language.Strings.setLanguage(GLOBALS.LAN);
            this.setState({});
            EventRegister.emit("ChangeLanguage", { lan: GLOBALS.LAN });
        } catch (error) {
            // Error retrieving data
            //console.warn("lan 1 = "+error);
        }
        finally {
            //console.warn("lan 1 = "+GLOBALS.LAN);
        }
    }

    _storeLanguage = async (lan) => {
        try {
            await AsyncStorage.setItem('lan', lan);
        } catch (error) {
            // Error saving data
        }
    }

    componentDidMount() {
        BTElib.TryConnectToBox();
        BTElib.syncPlaybackQueue();
        BTElib.syncPlaybackInfo();
        BTElib.syncDownloadQueue();

        DeviceEventEmitter.addListener('ConnectToBox', this.handleConnectToBox);
        DeviceEventEmitter.addListener('PlaybackInfoUpdate', this.handlePlaybackChange);
        DeviceEventEmitter.addListener('SongQueueChange', this.handleSongQueueChange);
        DeviceEventEmitter.addListener('DownloadQueue', this.handleDownloadQueue);

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        SplashScreen.hide();
    }
    handleConnectToBox = (e) =>{
        GLOBALS.IS_BOX_CONNECTED = e['isConnected'];
        GLOBALS.IS_NO_WIFI_CHECKED = false;

        if(GLOBALS.INFO.CONNECT != GLOBALS.DATABASE_CONNECT.SQLITE
            && !GLOBALS.IS_BOX_CONNECTED){
            GLOBALS.IS_DATABASE_CONNECTED = false;
        }
        else{
            GLOBALS.IS_DATABASE_CONNECTED = true;
        }

        // connect to box event
        EventRegister.emit("ConnectToBox",e);
        // Refresh song list
        EventRegister.emit("SongUpdate",{});

        if (GLOBALS.IS_BOX_CONNECTED) {
            BoxControl.fetchSystemInfo();
            BoxControl.getDownloadQueue();
        }
        //console.warn("IS_BOX_CONNECTED = "+GLOBALS.IS_BOX_CONNECTED);
        setTimeout(() => {
            this._showConnectWarning();
        }, 3000);
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
    _showConnectWarning = () => {
        if (!GLOBALS.IS_BOX_CONNECTED) {
            if (!this._isConnected)
                EventRegister.emit("ShowToast", { message: Language.Strings.notConnect, type: GLOBALS.TOAST_TYPE.ERROR });
            else
                EventRegister.emit("ShowToast", { message: Language.Strings.lostConnect, type: GLOBALS.TOAST_TYPE.ERROR });
        }
        else {
            this._isConnected = true;
            //EventRegister.emit("ShowToast",{message:Language.Strings.CON,type:GLOBALS.TOAST_TYPE.INFO});
        }
    }
    componentWillMount() {
        // Hide Footer
        this._listenerHideFooterEvent = EventRegister.addEventListener('HideFooter', (data) => {
            setTimeout(()=>{
                this._footer.hide();
            },150);
        });
        // Show Footer
        this._listenerShowFooterEvent = EventRegister.addEventListener('ShowFooter', (data) => {
            setTimeout(()=>{
                this._footer.show();
            },100);
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

        this._listenerChangeLanguage = EventRegister.addEventListener('ChangeLanguage', (data) => {
            if (GLOBALS.LAN != data.lan) {
                GLOBALS.LAN = data.lan;
                this._storeLanguage(GLOBALS.LAN);
                Language.Strings.setLanguage(data.lan);
                this.setState({});
            }
        });

        this._listenerShowToast = EventRegister.addEventListener('ShowToast', (data) => {
            this._showToast(data);
        });

        this._listenerShowScreen = EventRegister.addEventListener('ShowScreen', (data) => {
            this._screens.push(data.obj);
            data.obj.setIndex(this._screens.length - 1);
        });

        this._listenerHideScreen = EventRegister.addEventListener('HideScreen', (data) => {
            let index = data.obj.getIndex();
            this._screens.splice(index, 1);
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
        EventRegister.removeEventListener(this._listenerChangeLanguage);
        EventRegister.removeEventListener(this._listenerShowToast);
        EventRegister.removeEventListener(this._listenerShowScreen);
        EventRegister.removeEventListener(this._listenerHideScreen);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    handleBackPress = () => {
        //this.goBack(); // works best when the goBack is async
        // console.warn("back handle");
        if (this._screens.length > 0) {
            this._screens[this._screens.length - 1].hide();
        }
        return true;
    }
    _showToast = (data) => {
        var duration = (data.duration != null) ? data.duration : 1000;
        var type = (data.type != null) ? data.type : GLOBALS.TOAST_TYPE.INFO;
        if (type == GLOBALS.TOAST_TYPE.INFO)
            this._toast.show(data.message, duration);
        else if (type == GLOBALS.TOAST_TYPE.ERROR) {
            this._etoast.show(data.message, duration);
        }
        else if (type == GLOBALS.TOAST_TYPE.WARNING) {
            this._wtoast.show(data.message, duration);
        }
    }
    _showOverlay= (data)=>{
        this._singOverlay.updateView(data.overlayType,data.data);
        if(data.overlayType == GLOBALS.SING_OVERLAY.KEYBROARD)
            this._footer.hide();
        this._singOverlay.show();
    }
    _onOpenSearch = () => {
        this._songScreen.show();
        setTimeout(()=>{
            this._songScreen.focusSearchInput();
        },600);
    }
    _onOpenSinger = () =>{
        this._singerScreen.updateHolder(Language.Strings.tim);
        this._singerScreen.show();
    }
    _onOpenSong = () =>{
        this._songScreen.updateHolder(Language.Strings.tim);
        this._songScreen.show();
    }
    _onOpenHotSong = () =>{
        this._hotScreen.updateHolder(Language.Strings.tim);
        this._hotScreen.show();
    }
    _onOpenTheloai = () =>{
        this._hotScreen.updateHolder(Language.Strings.tim);
        this._theloaiScreen.show();
    }
    _onOnlineScreen = () => {
        this.youtubeSong.show();
        //this._onlineScreen.show();
    }
    _onOpenSelectedSong = () => {
       // this._currentScreen.hide();
        this._selectedSong.show();
    }
    _onBackHome = ()=>{
        this._currentScreen.hide();
    }
    _onCloseSelectedSong = () => {
        this._selectedSong.hide();
    }
    _onSingOverlayClose = () => {
        this._footer.show();
    }
    render() {
        if (!this._isLan)
            return (
                <View style={{ flex: 1, backgroundColor: "#3A3A72" }}>
                    <StatusBar
                        backgroundColor={GLOBALS.COLORS.STATUS_BAR}
                        // translucent={true}
                        barStyle="light-content"
                    ></StatusBar>
                </View>)
        else
            return (
                <View style={{ position:"absolute",
                                width:"100%",height:"100%"}}>
                    <HomeScreen 
                        zIndex={1}  
                        opacity= {1} maxZindex ={1} 
                        onOpenSearch={this._onOpenSearch}
                        onOpenSinger = {this._onOpenSinger}
                        onOpenTheloai = {this._onOpenTheloai}
                        onOpenSong = {this._onOpenSong}
                        onOpenHotSong = {this._onOpenHotSong}
                        onOnlineScreen = {this._onOnlineScreen}
                        onOpenMenu = {() =>{
                            EventRegister.emit("OpenDrawer",{});     
                        }}
                        ref={ref => (this._homeScreen = ref)} 
                        preLoad={false}
                    />  
                    
                    <SingerScreen 
                            opacity= {1}
                            maxZindex ={2} 
                            transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                            duration={250}
                            onBack={()=>{ this._singerScreen.hide();}} 
                            ref={ref => (this._singerScreen = ref)}
                        />
                    <OnlineScreen  opacity= {0} maxZindex ={2} 
                        transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={250}
                        onBack={()=>{ this._onlineScreen.hide();}} 
                        ref={ref => (this._onlineScreen = ref)} />
                        
                    <SongTabScreen 
                        opacity= {0} maxZindex ={5} 
                        transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={250}
                        onBack={()=>{ this._songScreen.hide();}} 
                        ref={ref => (this._songScreen = ref)}
                        title={Language.Strings.baihat.toUpperCase()}
                    />
                    <SongListScreen opacity= {0} maxZindex ={5} transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={250}
                        listType={GLOBALS.SONG_LIST_TYPE.HOT}
                        title ={Language.Strings.baihot.toUpperCase()}
                        onBack={()=>{ this._hotScreen.hide();}} 
                        ref={ref => (this._hotScreen = ref)}
                    />
                    
                    <SongTabScreen 
                        opacity= {0} maxZindex ={5} transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={250}
                        onBack={()=>{ this._theloaiScreen.hide();}}
                        ref={ref => (this._theloaiScreen = ref)}
                        tabType={GLOBALS.SONG_TAB.SONG_TYPE}
                        title={Language.Strings.tl.toUpperCase()}
                    />

                    
                    {/* <SelectedSong 
                        maxZindex ={7} 
                        transition = {GLOBALS.TRANSITION.SLIDE_TOP}
                        onBack={this._onCloseSelectedSong} ref={ref => (this._selectedSong = ref)}
                        bottom={60}
                    /> */}

                    <SongListScreen 
                        ref = {ref => (this._singerSong = ref)} 
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                        maxZindex = {6}
                        listType={GLOBALS.SONG_LIST_TYPE.SINGER}
                        onBack = {() => {
                            this._singerSong.hide();}} 
                            />
                    <SongOnlineScreen 
                        ref = {ref => (this.youtubeSong = ref)} 
                        type = {GLOBALS.SONG_ONLINE.YOUTUBE}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                        maxZindex = {6}
                        onBack = {() => {
                            this.youtubeSong.hide();
                        }}
                    />
                    <SongOnlineScreen 
                        ref = {ref => (this.soundSong = ref)} 
                        type = {GLOBALS.SONG_ONLINE.SOUNDCLOUD}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                        maxZindex = {6}
                        onBack = {() => {
                            this.soundSong.hide();
                        }}
                    />
                    <SongOnlineScreen 
                        ref = {ref => (this.mixSong = ref)} 
                        type = {GLOBALS.SONG_ONLINE.MIXCLOUD}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                        maxZindex = {6}
                        onBack = {() => {
                            this.mixSong.hide();
                        }}
                    />    
                    <SecondScreen 
                        opacity= {0} 
                        maxZindex ={11} 
                        transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={250}
                        onBack={()=>{
                            this._secondScreen.hide();
                        }} 
                        ref={ref => (this._secondScreen = ref)} 
                        preLoad = {false}
                        />
                        
                    <AdminScreen 
                        ref = {ref => (this._adminScreen = ref)} 
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                        maxZindex = {12}
                        onBack = {() => {
                            this._adminScreen.hide();
                        }}
                    />
                    <SelectedSong
                        ref={ref => (this._selectedSong = ref)}
                        maxZindex={12}
                        transition={GLOBALS.TRANSITION.SLIDE_TOP}
                        onBack={this._onCloseSelectedSong}
                    />
                    <Footer ref={ref => (this._footer = ref)} maxZindex ={13} 
                        onSelectedSong={this._onOpenSelectedSong} />

                    <SingOptionOverlay 
                        opacity={0} 
                        maxZindex={14} 
                        ref={ref => (this._singOverlay = ref)} 
                        onClose ={this._onSingOverlayClose} />

                    <StatusBar
                        backgroundColor={GLOBALS.COLORS.STATUS_BAR}
                        // translucent={true}
                        barStyle="light-content"
                    ></StatusBar>
                    <Toast ref={ref => (this._toast = ref)}
                            style={{
                                borderRadius: 10,
                                backgroundColor: "#000",
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                elevation: 2,
                            }}
                            position='center'
                            // positionValue={200}
                            // fadeInDuration={750}
                            // fadeOutDuration={1000}
                            opacity={0.9}
                            textStyle={{ color: '#fff', fontSize: 17, fontFamily: GLOBALS.FONT.MEDIUM, marginLeft: 10, marginRight: 10 }}
                        />

                        <Toast ref={ref => (this._etoast = ref)}
                            style={{
                                borderRadius: 10,
                                backgroundColor: "#FF2625",
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                elevation: 2,
                            }}
                            position='center'
                            // positionValue={200}
                            // fadeInDuration={750}
                            // fadeOutDuration={1000}
                            opacity={0.85}
                            textStyle={{ color: '#fff', fontSize: 17, fontFamily: GLOBALS.FONT.MEDIUM, marginLeft: 10, marginRight: 10 }}
                        />

                        <Toast ref={ref => (this._wtoast = ref)}
                            style={{
                                borderRadius: 10,
                                backgroundColor: "#E97A1E",
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                elevation: 2,
                            }}
                            position='center'
                            // positionValue={200}
                            // fadeInDuration={750}
                            // fadeOutDuration={1000}
                            opacity={0.85}
                            textStyle={{ color: '#fff', fontSize: 17, fontFamily: GLOBALS.FONT.MEDIUM, marginLeft: 10, marginRight: 10 }}
                        />
                </View>
            );
    }
}

const styles = StyleSheet.create({
    
})
