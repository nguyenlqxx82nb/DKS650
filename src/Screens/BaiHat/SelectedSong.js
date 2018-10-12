import React from "react";
import { StyleSheet,View,Text,Animated} from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister  } from 'react-native-event-listeners';
import SongListView from '../../Views/SongListView.js';
import Utils from '../../Utils/Utils';
import Header from '../Header/header3';
import MusicOnline from '../../Views/MusicOnlineButton.js';
import Language from '../../DataManagers/Language';

export default class SelectedSong extends BaseScreen {
    static propTypes = {
        onOptionOverlayOpen: PropTypes.func,
        onBack: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.songChanged = false;
        this.MAX_SCROLL_HEIGHT = 105;
    }
    componentWillMount() {
        // selected song changed
        this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
            if(this._isVisible){
                this._songList.refreshData("");
            }
            else{
                this.songChanged = true;
            }
        });
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerSongUpdateEvent);
    }
    _onBack = () => {
        const { onBack } = this.props;
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () =>{
        if(this.songChanged){
            this._songList.refreshData("");
            this.songChanged = false;
        }
    }
    renderContentView = () => {
        //const { maxZindex } = this.props;
        return (
            <View style={{ flex: 1,width:'100%' }}>
                {this.renderContent()}
            </View>
        );
    }
    scrollExtendComponent = (top) =>{
        this._musicOnline.setTopValue(top);
    }
    renderContent = () =>{
        if(!this.props.preLoad || this._allowLoad){
            return (
                <View style={{flex:1}}>
                    <Animated.View style={[styles.headerContainer,{ transform: [{ translateY: this._scrollY }]}]}>
                        <Header 
                            back={false}
                            left={<View style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-start"}}>
                                    <View style={{ width: 40, height: 40 }}>
                                        <IconRippe vector={true} name="listClose" size={20} color="#fff"
                                            onPress={this._onBack}
                                        />
                                    </View>
                                    <Text style={[GLOBALS.TITLE]}>
                                        {Language.Strings.dachon.toUpperCase()}
                                    </Text>
                                </View>}
                        />  
                    </Animated.View>
                    <MusicOnline 
                            style={{top:55,height:40}} 
                            ref={ref =>(this._musicOnline = ref)}
                            onOpenOnline = {()=>{
                                //this._searchInput.blur();
                            }} />

                    <View style={{ flex: 1}}>
                        <SongListView 
                            ref={ref=>(this._songList = ref)} 
                            listType = {GLOBALS.SONG_LIST_TYPE.SELECTED}
                            onScroll = {this._handleListViewScroll} 
                            top={this.MAX_SCROLL_HEIGHT}
                        />
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        height: 45,
        width:"100%",
        top:0,
        position:"absolute",
        zIndex:3,
    },

})