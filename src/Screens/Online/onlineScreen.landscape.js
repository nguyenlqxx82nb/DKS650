import React from "react";
import { StyleSheet, View, Dimensions, Animated } from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister } from 'react-native-event-listeners';
import SongOnlineListView from './SongOnlineListView.js';
import CustomIcon from '../../Components/CustomIcon.js';
import LinearGradient from 'react-native-linear-gradient';
import Header2 from '../Header/header2';
import Header4 from '../Header/header4';
import TuKhoaHot from '../../Views/TukhoaHot';
import ChannelList from '../../Views/channels';
import Language from '../../DataManagers/Language';

export default class OnlineScreen extends BaseScreen {
    static propTypes = {
        //onOptionOverlayOpen: PropTypes.func,
        onBack: PropTypes.func,
        type: PropTypes.number,
    };
    
    _term = "";
    constructor(props) {
        super(props);
        
        this.selectChannel = this.selectChannel.bind(this);
        if(GLOBALS.LANDSCAPE)
            this.MAX_SCROLL_HEIGHT = 145;
        else
            this.MAX_SCROLL_HEIGHT = 150;

        this._scroll2 = new Animated.Value(0);
    }
    componentWillMount() {
        // selected song changed
        this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
            if(this._isVisible){
                this._songList.updateSong();
            }
            else{
                this.songChanged = true;
            }
        });
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerSongUpdateEvent);
    }
    focus = (term) => {
        this._term = term;
        //this._searchHeader.showSearchInput();
        this._header.focusSearch(this._term);
    }
    _onSearchInputShow = () => {
        this._header.focusSearch(this._term);
    }
    _onBack = () => {
        const { onBack } = this.props;
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () => {
        if (this._term == "") {
            //let term = this._searchInput.getValue();
            // console.warn("_showCompleted = "+term);
            this._songList.loadData(this._term);
        }
    }
    _onSearch = (value) => {
        this._term = value;
        // console.warn("_onSearch = "+value);
        this._songList.searchData(value);
    }
    _onSearchChange = (value) => {
        //this._songList.searchData(value);
    }
    
    _renderOnlineIcon = () => {
        const { type } = this.props;
        if (type == GLOBALS.SONG_ONLINE.YOUTUBE) {
            return (
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{ marginLeft: 5, height: 40, width: 90, marginRight:10}}
                    colors={['#FF6565', '#FF4242', '#FF2C2C', '#FF0404']} >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <CustomIcon name={"youtube3"} size={60} style={{ color: "#fff" }} />
                    </View>
                </LinearGradient>
            );
        }
        else if (type == GLOBALS.SONG_ONLINE.SOUNDCLOUD) {
            return (
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{ marginLeft: 5, height: 40, width: 100, justifyContent: "center", alignItems: "center" }}
                    colors={['#FFB223', '#FF9E1D', '#FF8315', '#FF4903']} >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <CustomIcon name={"soundcloud"} size={90} style={{ color: "#fff" }} />
                    </View>
                </LinearGradient>
            );
        }
        else if (type == GLOBALS.SONG_ONLINE.MIXCLOUD) {
            return (
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{ marginLeft: 5, height: 40, width: 100, justifyContent: "center", alignItems: "center" }}
                    colors={['#69A5E5', '#5D9CE1', '#4B90DB', '#3783D4']} >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <CustomIcon name={"mixcloud"} size={90} style={{ color: "#fff" }} />
                    </View>
                </LinearGradient>
            );
        }
    }

    selectChannel(channel) {
        //this._term = channel;
        //this._a.setValue(this._term);
        this._header.setSearchValue(channel);
        this._onSearch(channel);
    }

    renderContentView = () => {
        if(GLOBALS.LANDSCAPE){
            return (
                <View style={{ flex: 1}}>
                    <Animated.View style={[styles.headerContainer, { transform: [{ translateY: this._scrollY }] }]}>
                        <Header2
                            ref={ref => (this._header = ref)}
                            h={40}
                            onSearch={this._onSearch}
                            onSearchChange={this._onSearchChange}
                            onBack={this._onBack}
                            left={this._renderOnlineIcon()}
                        />
                    </Animated.View>
                    {this.renderContent()}
                </View>
            );
        }
        else{
            return (
                <View style={{ flex: 1}}>
                    <Animated.View style={[styles.headerContainer, {height:45, transform: [{ translateY: this._scrollY }] }]}>
                        <Header4
                                ref={ref=>(this._header = ref)}
                                onSearch={this._onSearch}
                                onSearchChange = {this._onSearchChange}
                                onBack = {this._onBack}
                                left={this._renderOnlineIcon()}
                                searchHolder = {"Tìm kiếm ... "}
                            />
                    </Animated.View>
                    {this.renderContent()}
                </View>
            );
        }
    }
    renderContent = () => {
        if (!this.props.preLoad || this._allowLoad) {
            if(GLOBALS.LANDSCAPE){
                return (
                    <View style={{ flex: 1 }}>
                        <SongOnlineListView
                            ref={ref => (this._songList = ref)}
                            onScroll={this._handleListViewScroll}
                            onlineType={this.props.type}
                            top={this.MAX_SCROLL_HEIGHT} />
                        <Animated.View 
                            style={{ height: 40, position: "absolute", top: 45, width: "100%",
                                    transform: [{ translateY: this._scroll2}] }}
                            ref={ref=>(this._a = ref)}
                            >
                            <TuKhoaHot
                                onSelectChannel={this.selectChannel}
                            />
                        </Animated.View>
                        <Animated.View 
                            style={{ height: 50, position: "absolute", top: 85, width: "100%",
                            transform: [{ translateY: this._scroll2}] }}
                            ref={ref=>(this._b = ref)}
                            >
                            <ChannelList
                                onSelectChannel={this.selectChannel}
                            />
                        </Animated.View>
                    </View>
                )
            }
            else{
                return (
                    <View style={{ flex: 1 }}>
                        <SongOnlineListView
                            ref={ref => (this._songList = ref)}
                            onScroll={this._handleListViewScroll}
                            onlineType={this.props.type}
                            top={this.MAX_SCROLL_HEIGHT} />
                        <Animated.View 
                            style={{ height: 40, position: "absolute", top: 50, width: "100%",
                                    transform: [{ translateY: this._scroll2}] }}
                            ref={ref=>(this._a = ref)}
                            >
                            <TuKhoaHot
                                onSelectChannel={this.selectChannel}
                            />
                        </Animated.View>
                        <Animated.View 
                            style={{ height: 50, position: "absolute", top: 90, width: "100%",
                            transform: [{ translateY: this._scroll2}] }}
                            ref={ref=>(this._b = ref)}
                            >
                            <ChannelList
                                onSelectChannel={this.selectChannel}
                            />
                        </Animated.View>
                    </View>
                )
            }
            
        }
        // return this.renderContentView();
    }
    scrollExtendComponent = (top) =>{
        this._scroll2.setValue(top);
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        top: 0,
        height: 40,
        width: '100%',
        position: "absolute",
        zIndex: 3,
    },

    container: {
        flex: 1,
        paddingBottom: 5,
        // marginBottom:5,

    },

    bodyContainer: {
        flex: 1,
        zIndex: 0
        //marginTop:50
    }

})