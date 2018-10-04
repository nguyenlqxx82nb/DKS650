import React from "react";
import {View, StyleSheet, Animated, Platform } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from "../../DataManagers/Globals.js";
import DATA_INFO from '../../DataManagers/DataInfo.js';
import BoxControl from '../../DataManagers/BoxControl.js';
import { EventRegister } from 'react-native-event-listeners';
import Slider from 'react-native-slider';
import SongTextRun from '../../Views/SongTextRun.js';
import Utils from '../../Utils/Utils';


export default class FooterHome extends React.Component {
    static propTypes = {
        //number: PropTypes.number.isRequired,
        //color: PropTypes.string.isRequired,
        onSelectedSong: PropTypes.func,
        onOpenEmoji : PropTypes.func
        //duration : PropTypes.number
    };

    constructor(props) {
        super(props);
        //this.onPlayPress = this.onPlayPress.bind(this);

        this._state = {
            bottomValue: new Animated.Value(0),
        }

        this._topViewOpacity = {
            text : new Animated.Value(1),
            volume : new Animated.Value(0),
        }

        this.state = {
            volume : DATA_INFO.PLAYBACK_INFO.Volume,
        }

    }

    componentWillMount() {
        // Update playback info
        this._listenerPlaybackInfoEvent = EventRegister.addEventListener('PlaybackInfoChange', (data) => {
            this._playBtn.setIconType(DATA_INFO.PLAYBACK_INFO.IsPlaying ? 2 : 1);
            this._micBtn.setIconType(DATA_INFO.PLAYBACK_INFO.IsMute ? 2 : 1);
            //console.warn("volume = "+DATA_INFO.PLAYBACK_INFO.Volume);
            this.setState({volume:DATA_INFO.PLAYBACK_INFO.Volume});
        });

        this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
            // if(GLOBALS.IS_BOX_CONNECTED)
            //     this._listBtn.updateBagde(DATA_INFO.PLAY_QUEUE.length);
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
        BoxControl.mic();
    }

    _onEmojiPress = () => {
        EventRegister.emit('ShowOptOverlay', 
            {   overlayType:GLOBALS.SING_OVERLAY.EMOJI,
                data:{height:220}
            });
    }
    _openSongList = () =>{
        const { onSelectedSong } = this.props;
        if(onSelectedSong != null){
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

    // _openVolumeView = () =>{
    //     let that = this;
    //     Animated.timing(this._topViewOpacity.text, {
    //         toValue: 0,
    //         useNativeDriver: Platform.OS === 'android',
    //         duration: 200,
    //     }).start(function onComplete() {
    //         that._textView.setNativeProps({
    //             style: {
    //                 zIndex: 0
    //             }
    //         });
    //     });

    //     Animated.timing(this._topViewOpacity.volume, {
    //         toValue: 1,
    //         useNativeDriver: Platform.OS === 'android',
    //         duration: 400,
    //     }).start(function onComplete() {
    //         that._volmView.setNativeProps({
    //             style: {
    //                 zIndex: 1
    //             }
    //         });
    //     });
    // }
    // _closeVolumeView = () =>{
    //     let that = this;
    //     Animated.timing(this._topViewOpacity.text, {
    //         toValue: 1,
    //         useNativeDriver: Platform.OS === 'android',
    //         duration: 400,
    //     }).start(function onComplete() {
    //         that._textView.setNativeProps({
    //             style: {
    //                 zIndex: 1
    //             }
    //         });
    //     });

    //     Animated.timing(this._topViewOpacity.volume, {
    //         toValue: 0,
    //         useNativeDriver: Platform.OS === 'android',
    //         duration: 200,
    //     }).start(function onComplete() {
    //         that._volmView.setNativeProps({
    //             style: {
    //                 zIndex: 0
    //             }
    //         });
    //     });
    // }

    // _onVolumeChange = () =>{
    //     //console.warn("_onVolumeChange = "+this.state.volume);
    //     BoxControl.volumeChange(this.state.volume);
    // }

    _connectToBox = (data) =>{
        //console.warn("ConnectToBox : "+GLOBALS.IS_BOX_CONNECTED);
        this.setState({});
    }
    // _renderRightIcon = () =>{
    //     let songNumber = DATA_INFO.PLAY_QUEUE.length;
    //     var status = (GLOBALS.IS_NO_WIFI_CHECKED || !GLOBALS.IS_BOX_CONNECTED)?GLOBALS.ICON_STATUS.OFFLINE:GLOBALS.ICON_STATUS.ONLINE;
    //     if(GLOBALS.IS_NO_WIFI_CHECKED || GLOBALS.IS_BOX_CONNECTED){
    //         return(
    //             <View style={styles.iconTopRight}>
    //                 <IconRippe status={status}  vector={true} size={25} name="list" onPress={this._openSongList} badge ={songNumber} ref={ref => (this._listBtn = ref)} />
    //             </View>)
    //     }
    //     else{
    //         return(
    //             <View style={styles.iconTopRight}>
    //                 <IconRippe  vector={true} size={25} name="wifi" color={GLOBALS.COLORS.ERROR}  />
    //             </View>)
    //     }
    // }

    render() {
        const { bottomValue } = this._state;
        const { maxZindex } = this.props;

        var playIconType = (DATA_INFO.PLAYBACK_INFO.IsPlaying) ? 2 : 1;
        var micIconType = (DATA_INFO.PLAYBACK_INFO.IsMute) ? 2 : 1;

        var status = (GLOBALS.IS_NO_WIFI_CHECKED || !GLOBALS.IS_BOX_CONNECTED)?GLOBALS.ICON_STATUS.OFFLINE:GLOBALS.ICON_STATUS.ONLINE;
        return (
            <Animated.View
                ref={ref => (this._container = ref)}
                style={[styles.footerContainer, {zIndex:maxZindex, transform: [{ translateY: bottomValue }] }]}>
                <View style={styles.container}>
                    <Grid>
                        {/* <Row style={{ height: 40 }}>
                            <Animated.View style={[styles.topContainer,{zIndex:1,opacity:this._topViewOpacity.text}]} ref={ref => (this._textView=ref)}>
                                <View style={{flex:1, flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                    <View style={styles.iconTopLeft}>
                                        <IconRippe status={status} vector={true} size={25} name="volumnOn"
                                            onPress ={this._openVolumeView} />
                                    </View>
                                    <SongTextRun />
                                    {this._renderRightIcon()}
                                </View>
                            </Animated.View>
                            <Animated.View style={[styles.topContainer,
                                {zIndex:0,opacity:this._topViewOpacity.volume}]} 
                                ref={ref => (this._volmView = ref)}>
                                <View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection: "row"}}>
                                    <View style={styles.iconTopLeft}>
                                        <IconRippe status={status} vector={true} size={25} name="volumn"
                                                onPress ={this._closeVolumeView} />
                                    </View>
                                    <View style={{flex: 1,
                                                    height:40,
                                                    alignItems: 'stretch',
                                                    justifyContent: 'center',}}>
                                        <Slider
                                            thumbTintColor ="#fff"
                                            minimumTrackTintColor = "#fff"
                                            maximumTrackTintColor ="#69669C"
                                            value={this.state.volume} 
                                            onValueChange={(value) => this.setState({volume : value})}
                                            onSlidingComplete = {this._onVolumeChange}
                                            /> 
                                    </View>
                                    
                                    <View style={styles.iconTopRight}>
                                        <IconRippe status={status} vector={true} size={25} name="volumnOn" 
                                        onPress ={this._closeVolumeView} />
                                    </View>
                                </View>
                            </Animated.View>
                        </Row> */}
                        <Row>
                            <Grid>
                                <Col size={1} style={[styles.container_center]}>
                                    <IconRippe status={status} vector={true} size={28} 
                                        name="list" onPress={this._onEmojiPress}  />
                                </Col>
                                <Col size={1} style={[styles.container_center]}>
                                    <IconRippe status={status} vector={true} size={28} name="replay"
                                            onPress={()=>{
                                                BoxControl.rePlay();
                                            }}
                                        />
                                </Col>
                                <Col size={1}>
                                    <IconRippe status={status} ref={ref => (this._playBtn = ref)} 
                                            vector={true} size={50} name="play" name1="pause"
                                            iconType={playIconType} onPress={this._onPlayPress} />
                                </Col>
                                <Col size={1} style={[styles.container_center]}>
                                    <IconRippe status={status} vector={true} size={25} name="next"
                                        onPress={()=>{
                                            BoxControl.nextSong();
                                        }}
                                    />
                                </Col>
                                <Col size={1} style={[styles.container_center]}>
                                    <IconRippe status={status} ref={ref => (this._micBtn = ref)} vector={true} size={25} 
                                            name="micOn" name1="micOff" iconType={micIconType} 
                                            onPress={()=>{
                                                BoxControl.mute();
                                            }}
                                            />
                                </Col>
                            </Grid>
                        </Row>
                    </Grid>
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        position: "absolute",
        width: Utils.Width(),
        height: 60,
        zIndex: 2,
        bottom: 0,
        
    },
    container : {
        position: "absolute",
        width: Utils.Width(),
        height:60,
        top:0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5},
        shadowOpacity: 0.2,
        elevation: 5,
        backgroundColor: "#444083",
        paddingTop: 5,
        paddingBottom: 5,
    },
    container2: {
        width: 55, height: 55,marginTop:15
    },
    container3: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        borderRadius: 5,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    topContainer:{
        width:"100%",
        height:40,
        position:"absolute",
        top:0,
        justifyContent:"center",
        alignItems:"center"
    },
    iconTopLeft:{
        width : 40,
        height: 40,
        marginLeft:10,
        marginRight:30,
    },
    iconTopRight:{
        width : 40,
        height: 40,
        marginRight:10,
        marginLeft:30
    }
})
