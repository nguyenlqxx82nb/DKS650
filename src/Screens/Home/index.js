import React from "react";
import { StatusBar, View, AsyncStorage, BackHandler } from "react-native";

// screens
import Footer from '../Footer/footer.js';
import HomeScreen from './Home.js';
import SongTabScreen from '../BaiHat/SongTabScreen';
import SelectedSong from '../BaiHat/SelectedSong.js';
import SingerScreen from '../Singer/index.js';
import SingOptionOverlay from '../Overlay/OptionOverlay.js';
import TheloaiScreen from '../TheLoai/index.js'
import OnlineScreen from '../Online/index.js'
import SecondScreen from '../../SideBar/SecondScreen';
import SongOnlineScreen from '../Online/onlineScreen.landscape';
import SongListScreen from '../../Screens/BaiHat/SongListScreen';
import AdminScreen from '../../Screens/Admin/index';

import { EventRegister } from 'react-native-event-listeners'
import GLOBALS from "../../DataManagers/Globals.js";
import BoxControl from "../../DataManagers/BoxControl.js";
import DATA_INFO from "../../DataManagers/DataInfo.js";
import BTElib from 'react-native-bte-lib';
import { DeviceEventEmitter } from 'react-native';
import Utils from "../../Utils/Utils.js";
import Language from "../../DataManagers/Language";
import SplashScreen from 'react-native-splash-screen';

//import Storage from 'react-native-key-value-store';
import Toast, { DURATION } from 'react-native-easy-toast'

export default class Taisao extends React.Component {
    _currentScreen = null;
    _isLan = false;
    _isConnected = false;
    _screens = [];
    constructor(props) {
        super(props);
        BTElib.TryConnectToBox();
        console.disableYellowBox = true; // ['Warning: Stateless'];
        GLOBALS.INFO.VERSION = GLOBALS.BOX_VERSION.S650;
        //GLOBALS.INFO.CONNECT = GLOBALS.DATABASE_CONNECT.HTTP;
        //GLOBALS.INFO.CONNECT = GLOBALS.DATABASE_CONNECT.SQLITE;
        GLOBALS.INFO.CONNECT = GLOBALS.DATABASE_CONNECT.MYSQL;

        GLOBALS.LANDSCAPE = false;
        GLOBALS.FOOTER_HEIGHT = 57;
        GLOBALS.HEADER_HEIGHT = 45;

        var minSize = Math.min(Utils.Width(), Utils.Height());
        if (minSize < 370) {
            GLOBALS.MOBILE_SMALL = true;
            GLOBALS.FOOTER_HEIGHT = 55;
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
        }
        finally {
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
    handleBackPress = () => {
        //this.goBack(); // works best when the goBack is async
        // console.warn("back handle");
        if (this._screens.length > 0) {
            this._screens[this._screens.length - 1].hide();
        }
        return true;
    }
    handleConnectToBox = (e) => {
        GLOBALS.IS_BOX_CONNECTED = e['isConnected'];
        GLOBALS.IS_NO_WIFI_CHECKED = false;
        // connect to box event
        EventRegister.emit("ConnectToBox", e);
        // Refresh song list
        EventRegister.emit("SongUpdate", {});

        if (GLOBALS.IS_BOX_CONNECTED) {
            BoxControl.fetchSystemInfo();
            BoxControl.getDownloadQueue();
        }
        //console.warn("IS_BOX_CONNECTED = "+GLOBALS.IS_BOX_CONNECTED);
        setTimeout(() => {
            this._showConnectWarning();
        }, 2000);
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
    handlePlaybackChange = (e) => {
        DATA_INFO.PLAYBACK_INFO.IsPlaying = (e['play'] == 1) ? true : false;
        DATA_INFO.PLAYBACK_INFO.IsMute = (e['mute'] == 1) ? true : false;
        DATA_INFO.PLAYBACK_INFO.IsOriginal = (e['original'] == 1) ? true : false;
        DATA_INFO.PLAYBACK_INFO.Volume = e['volume'] / 100;

        EventRegister.emit("PlaybackInfoChange", {});
    }
    handleSongQueueChange = (e) => {
        DATA_INFO.PLAY_QUEUE = e['queue'];
        //console.warn("PLAY_QUEUE = "+DATA_INFO.PLAY_QUEUE.length);
        // Refresh song list
        EventRegister.emit("SongUpdate", {});
    }
    handleDownloadQueue = (e) => {
        BoxControl.getDownloadQueue();
    }
    componentWillMount() {
        // Hide Footer
        this._listenerHideFooterEvent = EventRegister.addEventListener('HideFooter', (data) => {
            this._footer.hide();
        });
        // Show Footer
        this._listenerShowFooterEvent = EventRegister.addEventListener('ShowFooter', (data) => {
            setTimeout(() => {
                this._footer.show();
            }, 300);
        });

        // Show overlay
        this._listenerShowOptOverlayEvent = EventRegister.addEventListener('ShowOptOverlay', (data) => {
            this._showOverlay(data);
        });

        // // Show overlay
        // this._listenerShowOptOverlayEvent = EventRegister.addEventListener('ShowOptOverlay', (data) => {
        //     this._singOverlay.updateView(data.overlayType,data.data);
        //     this._footer.hide();
        //     this._singOverlay.show();
        // });

        // Open Second screen
        this._listenerOpenSecondScreenEvent = EventRegister.addEventListener('OpenSecondScreen', (data) => {
            this._secondScreen.open(data.type);
        });

        //show online screen
        this._listenerShowOnlineScreenEvent = EventRegister.addEventListener('ShowOnlineScreen', (data) => {
            if (data.type == GLOBALS.SONG_ONLINE.YOUTUBE) {
                this.youtubeSong.show();
            }
            else if (data.type == GLOBALS.SONG_ONLINE.SOUNDCLOUD) {
                this.soundSong.show();
            }
            else if (data.type == GLOBALS.SONG_ONLINE.MIXCLOUD) {
                this.mixSong.show();
            }

            if (data.term != null)
                setTimeout(() => {
                    if (data.type == GLOBALS.SONG_ONLINE.YOUTUBE) {
                        this.youtubeSong.focus(data.term);
                    }
                    else if (data.type == GLOBALS.SONG_ONLINE.SOUNDCLOUD) {
                        this.soundSong.focus(data.term);
                    }
                    else if (data.type == GLOBALS.SONG_ONLINE.MIXCLOUD) {
                        this.mixSong.focus(data.term);
                    }
                }, 200);
        });

        this._listenerSingerSongEvent = EventRegister.addEventListener('OpenSingerSong', (data) => {
            //console.warn("OpenSingerSong "+data.name);
            this._singerSong.updateSinger(data.name);
            this._singerSong.show();
        });

        this._listenerAdminScreenEvent = EventRegister.addEventListener('OpenAdminScreen', (data) => {
            this._adminScreen.show();
        });

        this._listenerShowKeybroardEvent = EventRegister.addEventListener('ShowKeybroard', (data) => {
            this._showOverlay({ overlayType: GLOBALS.SING_OVERLAY.KEYBROARD, data: { input: data.input } });
        });

        this._listenerHideKeybroardEvent = EventRegister.addEventListener('HideKeybroard', (data) => {
            this._singOverlay.hide();
        });

        this._listenerOpenTypeSongEvent = EventRegister.addEventListener('OpenTypeSong', (data) => {
            this.theloaiSong.updateSongType(data.type, data.name);
            this.theloaiSong.show();
        });

        this._listenerCloseDrawerEvent = EventRegister.addEventListener('CloseDrawer', (data) => {
            this.props.navigation.closeDrawer();
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
        EventRegister.removeEventListener(this._listenerHideKeybroardEvent);
        EventRegister.removeEventListener(this._listenerShowKeybroardEvent);
        EventRegister.removeEventListener(this._listenerOpenTypeSongEvent);
        EventRegister.removeEventListener(this._listenerCloseDrawerEvent);
        EventRegister.removeEventListener(this._listenerChangeLanguage);
        EventRegister.removeEventListener(this._listenerShowToast);
        EventRegister.removeEventListener(this._listenerShowScreen);
        EventRegister.removeEventListener(this._listenerHideScreen);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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
    _showOverlay = (data) => {
        this._singOverlay.updateView(data.overlayType, data.data);
        if (data.overlayType == GLOBALS.SING_OVERLAY.KEYBROARD)
            this._footer.hide();

        this._singOverlay.show();
    }

    _onOpenSearch = () => {
        this._searchScreen.show();
        setTimeout(() => {
            this._searchScreen.focusSearchInput();
        }, 300);
    }
    _onOpenSinger = () => {
        this._singerScreen.updateHolder(Language.Strings.casy);
        this._singerScreen.show();
    }
    _onOpenSong = () => {
        this._songScreen.updateHolder(Language.Strings.baihat);
        this._songScreen.show();
    }
    _onOpenHotSong = () => {
        this._hotScreen.updateHolder(Language.Strings.baihot);
        this._hotScreen.show();
    }
    _onOpenTheloai = () => {
        this._theloaiScreen.show();
    }
    _onOnlineScreen = () => {
        this._onlineScreen.show();
    }
    _onOpenSelectedSong = () => {
        this._selectedSong.show();
    }
    _onCloseSelectedSong = () => {
        this._selectedSong.hide();
    }
    _onSingOverlayClose = () => {
        this._footer.show();
    }
    _onBackHome = (screen) => {
        screen.hide();
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
                <View style={{ flex: 1 }}>
                    <HomeScreen zIndex={1}
                        opacity={1} maxZindex={1}
                        onOpenSearch={this._onOpenSearch}
                        onOpenSinger={this._onOpenSinger}
                        onOpenTheloai={this._onOpenTheloai}
                        onOpenSong={this._onOpenSong}
                        onOpenHotSong={this._onOpenHotSong}
                        onOnlineScreen={this._onOnlineScreen}
                        onOpenMenu={() => {
                            this.props.navigation.openDrawer();
                        }}
                        ref={ref => (this._homeScreen = ref)} />

                    <SongListScreen
                        ref={ref => (this._hotScreen = ref)}
                        opacity={0}
                        maxZindex={2}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={150}
                        listType={GLOBALS.SONG_LIST_TYPE.HOT}
                        title={Language.Strings.baihot.toUpperCase()}
                        searchHolder={Language.Strings.baihot + " ..."}
                        onBack={() => { this._hotScreen.hide() }}
                        forceLoad={true}
                    />

                    <TheloaiScreen
                        ref={ref => (this._theloaiScreen = ref)}
                        opacity={0} maxZindex={2}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={150}
                        onBack={() => { this._theloaiScreen.hide() }}
                    />

                    <SongTabScreen
                        ref={ref => (this._songScreen = ref)}
                        title={Language.Strings.baihat.toUpperCase()}
                        searchHolder={Language.Strings.baihat + " ..."}
                        opacity={0}
                        maxZindex={2}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={150}
                        onBack={() => { this._songScreen.hide() }}
                    />

                    <SingerScreen
                        ref={ref => (this._singerScreen = ref)}
                        opacity={0}
                        maxZindex={2}
                        searchHolder={Language.Strings.casy + " ..."}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={150}
                        onBack={() => { this._singerScreen.hide() }}
                    />

                    <OnlineScreen
                        ref={ref => (this._onlineScreen = ref)}
                        opacity={0}
                        maxZindex={2}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={150}
                        onBack={() => { this._onlineScreen.hide() }}
                    />

                    <SongListScreen
                        //searchHolder = {"Tìm bài hát ..."}
                        ref={ref => (this.theloaiSong = ref)}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        maxZindex={4}
                        onBack={() => { this.theloaiSong.hide() }} />

                    <SongListScreen
                        //searchHolder = {"Tìm bài hát ..."}
                        ref={ref => (this._singerSong = ref)}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        maxZindex={6}
                        listType={GLOBALS.SONG_LIST_TYPE.SINGER}
                        onBack={() => { this._singerSong.hide() }} />

                    <SongOnlineScreen
                        ref={ref => (this.soundSong = ref)}
                        type={GLOBALS.SONG_ONLINE.SOUNDCLOUD}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        maxZindex={7}
                        onBack={() => {
                            this.soundSong.hide();
                        }}
                    />
                    <SongOnlineScreen
                        ref={ref => (this.mixSong = ref)}
                        type={GLOBALS.SONG_ONLINE.MIXCLOUD}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        maxZindex={7}
                        onBack={() => {
                            this.mixSong.hide();
                        }}
                    />
                    <SongOnlineScreen
                        ref={ref => (this.youtubeSong = ref)}
                        type={GLOBALS.SONG_ONLINE.YOUTUBE}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        maxZindex={8}
                        onBack={() => {
                            this.youtubeSong.hide();
                        }}
                    />
                    <SecondScreen
                        ref={ref => (this._secondScreen = ref)}
                        opacity={0}
                        maxZindex={9}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        duration={250}
                        onBack={() => {
                            this._secondScreen.hide();
                        }}
                    />

                    <AdminScreen
                        ref={ref => (this._adminScreen = ref)}
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT}
                        maxZindex={9}
                        onBack={() => {
                            this._adminScreen.hide();
                        }}
                    />
                    <SelectedSong
                        ref={ref => (this._selectedSong = ref)}
                        maxZindex={10}
                        transition={GLOBALS.TRANSITION.SLIDE_TOP}
                        onBack={this._onCloseSelectedSong}
                    />
                    <SingOptionOverlay
                        opacity={0}
                        maxZindex={10}
                        ref={ref => (this._singOverlay = ref)}
                        onClose={this._onSingOverlayClose}
                    />
                    <Footer
                        ref={ref => (this._footer = ref)} maxZindex={15}
                        onSelectedSong={this._onOpenSelectedSong} />
                        
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

