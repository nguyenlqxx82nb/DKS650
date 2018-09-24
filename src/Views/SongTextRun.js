import React from "react";
import { Image, View,StyleSheet, Dimensions, Animated, Platform ,Text} from "react-native";

import TextTicker from 'react-native-text-ticker'
import PropTypes from 'prop-types';
import GLOBALS from "../DataManagers/Globals.js";
import DATA_INFO from '../DataManagers/DataInfo.js';
import DatabaseManager from '../DataManagers/DatabaseManager.js';
import { EventRegister } from 'react-native-event-listeners';

const arrowLeftSrc = require("../../assets/arrowLeft.png");
const arrowRightSrc = require("../../assets/arrowRight.png");

export default class SongTextRun extends React.Component {
    static propTypes = {
        
    };

    constructor(props) {
        super(props);
        //this.onPlayPress = this.onPlayPress.bind(this);
        this.state = {
            volume : DATA_INFO.PLAYBACK_INFO.Volume,
            text : "- Chọn bài -",
        }
        setTimeout(()=>{
            this._runText.stopAnimation();
        },20);
        this._songId = -1;
        //this._updateSongText();
    }

    componentWillMount() {
        // Update playback info
        this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
            this._updateSongText();
        });
        
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerSongUpdateEvent);
    }

    _updateSongText = () =>{
        if(DATA_INFO.PLAY_QUEUE.length == 0){
            // if(this._songId == -1)
            //     return;
            this._songId == -1;
            this.setState({text:"- Chọn bài -"});
            setTimeout(()=>{
                this._runText.stopAnimation();
            },20);
        }
        else{
            let songId = DATA_INFO.PLAY_QUEUE[0];
            if(this._songId == songId)
                return;
            
            DatabaseManager.getSong(songId,(song)=>{
                this._songId == songId;
                if(song != null){
                    this.setState({text:" - "+song.Song_Name+" -**- Ca sỹ : "+song.Actor+" - "});
                    setTimeout(()=>{
                        this._runText.startAnimation();
                    },100)
                }},
                (error)=>{
                }
            )
        }
    }

    render() {
        const { text } = this.state;
        return (
            <View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                <Image source={arrowLeftSrc} style={{width: 13, height: 13, marginRight:10}} />
                <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                    <TextTicker
                        ref={ref => (this._runText = ref)}
                        style={styles.text}
                        duration={10000}
                        loop
                        scroll
                        marqueeOnMount ={false}
                        repeatSpacer={20}
                        marqueeDelay={0}>
                        {text}
                    </TextTicker>
                </View>
                <Image source={arrowRightSrc} style={{ width: 13, height: 13, marginLeft:10}} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text : {
        fontSize: 13, 
        color: 'white',
        overflow: 'hidden',
        fontFamily:GLOBALS.FONT.MEDIUM
    }
})
