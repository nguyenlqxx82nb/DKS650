import React from "react";
import { Image, View,StyleSheet, Dimensions, Animated, Platform ,Text} from "react-native";

import TextTicker from 'react-native-text-ticker'
import PropTypes from 'prop-types';
import GLOBALS from "../DataManagers/Globals.js";
import DATA_INFO from '../DataManagers/DataInfo.js';
import DatabaseManager from '../DataManagers/DatabaseManager.js';
import { EventRegister } from 'react-native-event-listeners';
import Language from "../DataManagers/Language.js";

const arrowLeftSrc = require("../../assets/arrowLeft.png");
const arrowRightSrc = require("../../assets/arrowRight.png");

export default class SongTextRun extends React.Component {
    static propTypes = {
        
    };

    constructor(props) {
        super(props);
        //this.onPlayPress = this.onPlayPress.bind(this);
        this._text = "- Chọn bài -";
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

    componentDidMount(){
        this._updateSongText();
    }

    _updateSongText = () =>{
        if(DATA_INFO.PLAY_QUEUE.length == 0){
            this._songId == -1;
            this._text="- "+Language.Strings.chonbai+" -";
            this.setState({});
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
                //console.warn("songId = "+songId);
                if(song != null){
                    this._text = "  "+song.Song_Name+" - "+song.Actor+"  ";
                    //console.warn("text = "+this._text);
                    this.setState({});
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
        return (
            <View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                <Image source={arrowLeftSrc} style={{width: 12, height: 12, marginRight:10}} />
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
                        {this._text}
                    </TextTicker>
                </View>
                <Image source={arrowRightSrc} style={{ width: 12, height: 12, marginLeft:10}} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text : {
        fontSize: 16, 
        color: 'white',
        overflow: 'hidden',
        fontFamily:GLOBALS.FONT.MEDIUM
    }
})
