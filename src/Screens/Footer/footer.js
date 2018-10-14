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
            this._micBtn.setIconType((DATA_INFO.PLAYBACK_INFO.IsOriginal == 0) ? 2 : 1);
            //console.warn("volume = "+DATA_INFO.PLAYBACK_INFO.Volume);
            //this.setState({volume:DATA_INFO.PLAYBACK_INFO.Volume});
        });

        this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
            if(GLOBALS.IS_BOX_CONNECTED){

                this._listBtn.updateBagde(this._getSelectNumber());
            }
                
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
    _getSelectNumber = ()=>{
        // var number = 0;
        // for(var i=0; i< DATA_INFO.PLAY_QUEUE.length - 1; i++){
        //     if(isNaN(DATA_INFO.PLAY_QUEUE[i])){
        //         if(DATA_INFO.PLAY_QUEUE[i].length >3){
        //             number += 1;
        //         }
        //     }
        //     else{
        //         number += 1;
        //     }
        // }
        // return number;
        return DATA_INFO.PLAY_QUEUE.length;
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

    _connectToBox = (data) =>{
        //console.warn("ConnectToBox : "+GLOBALS.IS_BOX_CONNECTED);
        this.setState({});
    }

    render() {
        const { bottomValue } = this._state;
        const { maxZindex } = this.props;

        var playIconType = (DATA_INFO.PLAYBACK_INFO.IsPlaying) ? 2 : 1;
        var micIconType = (DATA_INFO.PLAYBACK_INFO.IsOriginal == 0) ? 2 : 1;
        let songNumber = this._getSelectNumber();
        var status = (GLOBALS.IS_NO_WIFI_CHECKED || !GLOBALS.IS_BOX_CONNECTED)?GLOBALS.ICON_STATUS.OFFLINE:GLOBALS.ICON_STATUS.ONLINE;
        return (
            <Animated.View
                ref={ref => (this._container = ref)}
                style={[styles.footerContainer, {zIndex:maxZindex,height:GLOBALS.FOOTER_HEIGHT, transform: [{ translateY: bottomValue }] }]}>
                <View style={styles.container}>
                    <Grid>
                        <Row>
                            <Grid>
                                <Col size={1} style={[styles.container_center]}>
                                    <IconRippe 
                                        ref = {ref =>(this._listBtn = ref)}
                                        status={status} vector={true} size={26} 
                                        name="list" onPress={this._openSongList}  
                                        badge ={songNumber} />
                                </Col>
                                <Col size={1} style={[styles.container_center]}>
                                    <IconRippe status={status} vector={true} size={26} name="replay"
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
                                    <IconRippe status={status} vector={true} size={23} name="next"
                                        onPress={()=>{
                                            BoxControl.nextSong();
                                        }}
                                    />
                                </Col>
                                <Col size={1} style={[styles.container_center]}>
                                    <IconRippe status={status} ref={ref => (this._micBtn = ref)} vector={true} size={23} 
                                            name="micOn" name1="micOff" iconType={micIconType} 
                                            onPress={this._onMicPress}
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
        height: 50,
        zIndex: 2,
        bottom: 0,
    },
    container : {
        flex:1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5},
        shadowOpacity: 0.2,
        elevation: 5,
        backgroundColor: "#444083",
    },
})
