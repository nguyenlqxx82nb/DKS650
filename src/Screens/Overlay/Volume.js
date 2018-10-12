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
            this.setState({volume:DATA_INFO.PLAYBACK_INFO.Volume});
        });

        // this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
        //     // if(GLOBALS.IS_BOX_CONNECTED)
        //     //     this._listBtn.updateBagde(DATA_INFO.PLAY_QUEUE.length);
        // });

        // this._listenerConnectToBoxEvent = EventRegister.addEventListener('ConnectToBox', (data) => {
        //     this._connectToBox(data);
        // });
        
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerPlaybackInfoEvent);
        // EventRegister.removeEventListener(this._listenerSongUpdateEvent);
        // EventRegister.removeEventListener(this._listenerConnectToBoxEvent);
    }
    _onVolumeChange = () =>{
        //console.warn("_onVolumeChange = "+this.state.volume);
        BoxControl.volumeChange(this.state.volume);
    }
    _connectToBox = (data) =>{
        //console.warn("ConnectToBox : "+GLOBALS.IS_BOX_CONNECTED);
        this.setState({});
    }
    render() {
        const { maxZindex } = this.props;

        var status = (GLOBALS.IS_NO_WIFI_CHECKED || !GLOBALS.IS_BOX_CONNECTED)?GLOBALS.ICON_STATUS.OFFLINE:GLOBALS.ICON_STATUS.ONLINE;
        return (
            <View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection: "row"}}>
                <View style={styles.iconTopLeft}>
                    <IconRippe status={status} vector={true} size={25} name="volumn"
                            />
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
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    iconTopLeft:{
        width : 40,
        height: 40,
        marginLeft:10,
        marginRight:10,
    },
    iconTopRight:{
        width : 40,
        height: 40,
        marginRight:10,
        marginLeft:10
    }
})
