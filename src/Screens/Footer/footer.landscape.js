import React from "react";
import { View, StyleSheet, Dimensions, Animated, Platform } from "react-native";

import { Col, Grid, Row } from "react-native-easy-grid";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from "../../DataManagers/Globals.js";
import DATA_INFO from '../../DataManagers/DataInfo.js';
import BoxControl from '../../DataManagers/BoxControl.js';
import { EventRegister } from 'react-native-event-listeners';
import Slider from 'react-native-slider';
import SongTextRun from '../../Views/SongTextRun.js';
import Utils from '../../Utils/Utils.js';


export default class FooterLanscape extends React.Component {
    static propTypes = {
        //number: PropTypes.number.isRequired,
        //color: PropTypes.string.isRequired,
        onSelectedSong: PropTypes.func,
        onOpenEmoji: PropTypes.func
        //duration : PropTypes.number
    };

    constructor(props) {
        super(props);
        //this.onPlayPress = this.onPlayPress.bind(this);

        this._state = {
            bottomValue: new Animated.Value(0),
        }

        this._topViewOpacity = {
            text: new Animated.Value(1),
            volume: new Animated.Value(0),
        }

        this.state = {
            volume: DATA_INFO.PLAYBACK_INFO.Volume,
        }

    }

    componentWillMount() {
        // Update playback info
        this._listenerPlaybackInfoEvent = EventRegister.addEventListener('PlaybackInfoChange', (data) => {
            this._playBtn.setIconType(DATA_INFO.PLAYBACK_INFO.IsPlaying ? 2 : 1);
            this._micBtn.setIconType((DATA_INFO.PLAYBACK_INFO.IsOriginal == 0) ? 2 : 1);
            
            this.setState({ volume: DATA_INFO.PLAYBACK_INFO.Volume });
        });

        this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
            if (GLOBALS.IS_BOX_CONNECTED)
                this._listBtn.updateBagde(DATA_INFO.PLAY_QUEUE.length);
        });

        this._listenerConnectToBoxEvent = EventRegister.addEventListener('ConnectToBox', (data) => {
            this._connectToBox(data);
        });

    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerPlaybackInfoEvent);
        EventRegister.removeEventListener(this._listenerSongUpdateEvent);
        EventRegister.removeEventListener(this._listenerConnectToBoxEvent);
    }

    _onPlayPress = () => {
        const { onTest } = this.props;
        // BTELib.getPlaybackInfo((volume)=>{
        //     BTELib.alert('volume = '+volume);
        // });
        BoxControl.play();
    }

    _onMicPress = () => {
        BoxControl.tachloi();
    }

    _onEmojiPress = () => {
        var height = 150;
        if(GLOBALS.LANDSCAPE_NORMAL){
            height = 170;
        }
        else if(GLOBALS.LANDSCAPE_LARGE){
            height = 190;
        }
        EventRegister.emit('ShowOptOverlay',
            {
                overlayType: GLOBALS.SING_OVERLAY.EMOJI,
                data: { height: height}
            });
    }
    _openSongList = () => {
        const { onSelectedSong } = this.props;
        if (onSelectedSong != null) {
            onSelectedSong();
        }
    }

    show = () => {
        let container = this._container;
        const { maxZindex } = this.props;

        Animated.timing(this._state.bottomValue, {
            toValue: 0,
            useNativeDriver: Platform.OS === 'android',
            duration: 250,
        }).start(function onComplete() {
            container.setNativeProps({
                style: {
                    zIndex: maxZindex
                }
            });
        });
    }

    hide = () => {
        let container = this._container;
        const { maxZindex } = this.props;
        //console.warn("maxZindex = "+maxZindex);
        //if(maxZindex == '')
        Animated.timing(this._state.bottomValue, {
            toValue: 120,
            useNativeDriver: Platform.OS === 'android',
            duration: 150,
        }).start(function onComplete() {
            container.setNativeProps({
                style: {
                    zIndex: 0
                }
            });
        });
    }

    _openVolumeView = () => {
        let that = this;
        Animated.timing(this._topViewOpacity.text, {
            toValue: 0,
            useNativeDriver: Platform.OS === 'android',
            duration: 200,
        }).start(function onComplete() {
            that._textView.setNativeProps({
                style: {
                    zIndex: 0
                }
            });
        });

        Animated.timing(this._topViewOpacity.volume, {
            toValue: 1,
            useNativeDriver: Platform.OS === 'android',
            duration: 400,
        }).start(function onComplete() {
            that._volmView.setNativeProps({
                style: {
                    zIndex: 1
                }
            });
        });
    }
    _closeVolumeView = () => {
        let that = this;
        Animated.timing(this._topViewOpacity.text, {
            toValue: 1,
            useNativeDriver: Platform.OS === 'android',
            duration: 400,
        }).start(function onComplete() {
            that._textView.setNativeProps({
                style: {
                    zIndex: 1
                }
            });
        });

        Animated.timing(this._topViewOpacity.volume, {
            toValue: 0,
            useNativeDriver: Platform.OS === 'android',
            duration: 200,
        }).start(function onComplete() {
            that._volmView.setNativeProps({
                style: {
                    zIndex: 0
                }
            });
        });
    }

    _onVolumeChange = () => {
        //console.warn("_onVolumeChange = "+this.state.volume);
        BoxControl.volumeChange(this.state.volume);
    }

    _connectToBox = (data) => {
        //console.warn("ConnectToBox : "+GLOBALS.IS_BOX_CONNECTED);
        this.setState({});
    }
    _renderRightIcon = () => {
        let songNumber = DATA_INFO.PLAY_QUEUE.length;
        var status = (GLOBALS.IS_NO_WIFI_CHECKED || !GLOBALS.IS_BOX_CONNECTED) ? GLOBALS.ICON_STATUS.OFFLINE : GLOBALS.ICON_STATUS.ONLINE;
        if (GLOBALS.IS_NO_WIFI_CHECKED || GLOBALS.IS_BOX_CONNECTED) {
            return (
                <View style={styles.iconTopRight}>
                    <IconRippe status={status} vector={true} size={25} name="list" onPress={this._openSongList} badge={songNumber} ref={ref => (this._listBtn = ref)} />
                </View>)
        }
        else {
            return (
                <View style={styles.iconTopRight}>
                    <IconRippe vector={true} size={25} name="wifi" color={GLOBALS.COLORS.ERROR} />
                </View>)
        }
    }

    render() {
        const { bottomValue } = this._state;
        const { maxZindex } = this.props;

        var playIconType = (DATA_INFO.PLAYBACK_INFO.IsPlaying) ? 2 : 1;
        var micIconType = (DATA_INFO.PLAYBACK_INFO.IsOriginal == 0) ? 2 : 1;
        let songNumber = DATA_INFO.PLAY_QUEUE.length;

        var status = (GLOBALS.IS_NO_WIFI_CHECKED || !GLOBALS.IS_BOX_CONNECTED) ? GLOBALS.ICON_STATUS.OFFLINE : GLOBALS.ICON_STATUS.ONLINE;
        var button_style = {};
        var icon_sizes = [];
        var normal_size ;
        var play_size 
        if(GLOBALS.LANDSCAPE_SMALL){
            button_style = {
                width:62,
            }
            normal_size = 25;
            play_size = 50;
        }
        else if(GLOBALS.LANDSCAPE_NORMAL){
            button_style = {
                width:80,
            }

            normal_size = 30;
            play_size = 60;
        }
        else if(GLOBALS.LANDSCAPE_LARGE){
            button_style = {
                width:95,
            }

            normal_size = 35;
            play_size = 70;
        }
        return (
            <Animated.View
                ref={ref => (this._container = ref)}
                style={[styles.footerContainer, {height:GLOBALS.FOOTER_HEIGHT, zIndex: maxZindex, transform: [{ translateY: bottomValue }] }]}>
                    <View style={{width:"28%",justifyContent:"flex-start",alignItems:"center",flexDirection: "row",
                            paddingLeft:10,paddingRight:5}}>
                        <View style={{height:"100%",width:normal_size+25}}>
                            <IconRippe 
                                status={status} 
                                vector={true} 
                                size={normal_size} 
                                name1="volumn" 
                                name="volumnOn"
                                iconType={1}
                                onPress={()=>{}} />
                        </View>
                        <View style={{flex: 1,
                                        height:40,
                                        alignItems: 'stretch',
                                        justifyContent: 'center',
                                        marginRight:15}}>
                            <Slider
                                thumbTintColor ="#fff"
                                minimumTrackTintColor = "#fff"
                                maximumTrackTintColor ="#69669C"
                                value={this.state.volume} 
                                onValueChange={(value) => this.setState({volume : value})}
                                onSlidingComplete = {this._onVolumeChange}
                                /> 
                        </View>
                        
                    </View>

                    <View style={{flex:1, flexDirection:"row", justifyContent:"center",alignItems:"center"}}>
                            <View style={[styles.buttonControl,button_style]}>
                                <IconRippe status={status} vector={true} 
                                        size={normal_size} name="emoji" 
                                            onPress={this._onEmojiPress} />
                            </View>
                            <View style={[styles.buttonControl,button_style]}>
                                <IconRippe status={status} vector={true} size={normal_size} name="replay"
                                                onPress={() => { BoxControl.rePlay();}} />
                            </View>
                            <View style={[styles.buttonControl,button_style]}>
                            <IconRippe status={status} ref={ref => (this._playBtn = ref)} 
                                    vector={true} size={play_size} name="play" name1="pause" iconType={playIconType}
                                    onPress={this._onPlayPress} />
                            </View>
                            <View style={[styles.buttonControl,button_style]}>
                                <IconRippe status={status} vector={true} size={normal_size-2} name="next"
                                            onPress={() => { BoxControl.nextSong();}}/>
                            </View>
                            <View style={[styles.buttonControl,button_style]}>
                                <IconRippe status={status} ref={ref => (this._micBtn = ref)} vector={true} 
                                        size={normal_size-2}
                                                name="micOn" name1="micOff" iconType={micIconType}
                                                onPress={this._onMicPress}/>
                            </View>
                    </View>
                    
                    <View style={{width:"28%", flexDirection:"row",justifyContent:"flex-end",alignItems:"center",
                        paddingRight:5,paddingLeft:10}}>
                        <SongTextRun />
                        <View style={{height:"100%",width:normal_size+20,marginRight:5,marginLeft:5}}>
                            <IconRippe status={status} vector={true} 
                                size={normal_size} name="list" 
                                onPress={this._openSongList} badge={songNumber} 
                                ref={ref => (this._listBtn = ref)} />
                        </View>
                    </View> 

            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container_center: {
        justifyContent: "center",
        alignItems: "center"
    },
    footerContainer: {
        position: "absolute",
        width: Utils.Width(),
        height: 60,
        zIndex: 2,
        bottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 4,
        width:"100%",
        backgroundColor: "#444083",
        flexDirection:"row"
    },
    buttonControl :{
        height:"100%",
        // justifyContent:"center",
        // alignItems:"center",
        // backgroundColor:"red"

    },
    iconTopLeft: {
        width: 40,
        height: "100%",
    },
    iconTopRight: {
        width: 40,
        height: 40,
        marginRight: 10,
        marginLeft: 10
    }
})
