import React from "react";
import { StyleSheet, Alert,Animated, View,Text } from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister  } from 'react-native-event-listeners';
import SongTabsView from '../../Views/SongTabsView.js';
import SearchInput from '../../Views/SearchInput.js';
import MusicOnline from '../../Views/MusicOnlineButton.js';
import Header2 from '../Header/header2';
import Header4 from '../Header/header4';

const lans = [
    GLOBALS.LANGUAGE_KEY.vn,
    GLOBALS.LANGUAGE_KEY.en,
    GLOBALS.LANGUAGE_KEY.cn,
    GLOBALS.LANGUAGE_KEY.ja,
    GLOBALS.LANGUAGE_KEY.kr,
    GLOBALS.LANGUAGE_KEY.taiwan,
    GLOBALS.LANGUAGE_KEY.hk,
    GLOBALS.LANGUAGE_KEY.ml,
    GLOBALS.LANGUAGE_KEY.tl,
    GLOBALS.LANGUAGE_KEY.ca
];

const song_types = [
    GLOBALS.SONG_TYPE_KEY.DJ,
    GLOBALS.SONG_TYPE_KEY.THIEUNHI,
    GLOBALS.SONG_TYPE_KEY.SONGCA,
    GLOBALS.SONG_TYPE_KEY.SINHNHAT,
    GLOBALS.SONG_TYPE_KEY.LIENKHUC,
    GLOBALS.SONG_TYPE_KEY.NHACTRE,
    GLOBALS.SONG_TYPE_KEY.NHACVANG,
    GLOBALS.SONG_TYPE_KEY.NHACDO,
    GLOBALS.SONG_TYPE_KEY.NHACTRINH,
    GLOBALS.SONG_TYPE_KEY.NHACXUAN,
    GLOBALS.SONG_TYPE_KEY.CAILUONG,
    GLOBALS.SONG_TYPE_KEY.DANCA,
]
export default class SongTabScreen extends BaseScreen {
    static propTypes = {
        onOptionOverlayOpen: PropTypes.func,
        onBack: PropTypes.func,
        listType: PropTypes.number,
        hasOnlineButton : PropTypes.bool,
        tabType: PropTypes.number,
        title : PropTypes.string
    };
    _searchTerm = "";
    constructor(props) {
        super(props);

        this._listType = (this.props.listType != null)? this.props.listType: GLOBALS.SONG_LIST_TYPE.ALL;
        this._hasOnlineButton = (this.props.hasOnlineButton != null)?this.props.hasOnlineButton: true;
        this.tabType = (this.props.tabType != null)?this.props.tabType:GLOBALS.SONG_TAB.LANGUAGE;

        if(GLOBALS.LANDSCAPE)
            this.MAX_SCROLL_HEIGHT = 135;
        else
            this.MAX_SCROLL_HEIGHT = 150;
    }
    _onBack = () => {
        const { onBack } = this.props;
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () =>{
        this._songTabs.setVisible(true);
        this._songTabs.loadData(this._searchTerm);
    }
    _hideCompleted = ()=>{
        this._songTabs.setVisible(false);
    }
    focusSearchInput = () =>{
        this._header.focus();
    }
    _onChangeTab = (page) =>{
        if(this._isVisible){
            //console.warn("_onChangeTab");
            this._songTabs.loadData(this._searchTerm);
            this._handleListViewScroll(this._songTabs.getCurrentScrollOffset());
    
            if(this._offsetY > this.MAX_SCROLL_HEIGHT){
                this._headerTopY = 0;
                Animated.timing(this._scrollY,{toValue:0,duration:250}).start();
            }
        }
    }
    _onSearch =(value)=> {
        this._search(value);
    }
    _onSearchChange = (value)=>{
        this._search(value);
    }
    _search = (value)=>{
        if(this._searchTerm != value){
            this._searchTerm = value;
            this._songTabs.searchData(value);
            if(this._musicOnline != null)
                this._musicOnline.setTerm(value);
        }
    }
    loadData = () =>{
        this._songTabs.refreshData();
    }
    scrollExtendComponent = (top) =>{
        this._songTabs.setScrollTabTop(top);
        this._musicOnline.setTopValue(top);
    }
    renderContent = () =>{
        if(!this.props.preLoad || this._allowLoad){
            if(GLOBALS.LANDSCAPE)
                return (
                    <View style={{flex:1}}>
                        <SongTabsView 
                            tabs={(this.tabType == GLOBALS.SONG_TAB.LANGUAGE)?lans:song_types} 
                            ref={ref => (this._songTabs = ref)} 
                            songListType = {this._listType}
                            onChangeTab = {this._onChangeTab} 
                            tabType = {this.tabType}
                            onScroll = {this._handleListViewScroll} 
                            top={this.MAX_SCROLL_HEIGHT}/>
                        { 
                            this._hasOnlineButton && 
                            <MusicOnline 
                                ref={ref =>(this._musicOnline = ref)}
                                style = {{top:85}}
                                onOpenOnline = {()=>{
                                    //this._searchInput.blur();
                                }}
                            />
                        }
                    </View>
                )
            else{
                return (
                    <View style={{flex:1}}>
                        <SongTabsView 
                            tabs={(this.tabType == GLOBALS.SONG_TAB.LANGUAGE)?lans:song_types} 
                            ref={ref => (this._songTabs = ref)} 
                            songListType = {this._listType}
                            onChangeTab = {this._onChangeTab} 
                            tabType = {this.tabType}
                            tabTop = {50}
                            onScroll = {this._handleListViewScroll} 
                            top={this.MAX_SCROLL_HEIGHT}/>
                        { 
                            this._hasOnlineButton && 
                            <MusicOnline 
                                ref={ref =>(this._musicOnline = ref)}
                                style = {{top:100,height:40}}
                                onOpenOnline = {()=>{
                                    //this._searchInput.blur();
                                }}
                            />
                        }
                    </View>
                )
            }
        }
    }

    renderContentView = () => {
        var top = (this._hasOnlineButton)?(GLOBALS.LANDSCAPE?50:40):0;
        if(GLOBALS.LANDSCAPE)
            return (
                <View style={{ flex: 1 }}>
                    <Animated.View style={[styles.headerContainer, { transform: [{ translateY: this._scrollY }]}]}>
                        <Header2
                            ref={ref=>(this._header = ref)}
                            h = {40}
                            onSearch={this._onSearch}
                            onSearchChange = {this._onSearchChange}
                            onBack = {this._onBack}
                            left={<Text style={[styles.title]}>{this.props.title}</Text>}
                        />
                    </Animated.View>
                    {this.renderContent()}
                </View>
            );
        else{
            return (
                <View style={{ flex: 1 }}>
                    <Animated.View style={[styles.headerContainer, {height:45, transform: [{ translateY: this._scrollY }]}]}>
                        <Header4
                            ref={ref=>(this._header = ref)}
                            onSearch={this._onSearch}
                            onSearchChange = {this._onSearchChange}
                            onBack = {this._onBack}
                            left={<Text style={[styles.title]}>{this.props.title}</Text>}
                        />
                    </Animated.View>
                    {this.renderContent()}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 40,
        position:"absolute",
        top:0,
        zIndex:2,
        width: "100%",
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    title: {
        fontSize: 20,
        fontWeight: '300',
        marginLeft:5,
        color:"#fff",
        fontFamily:GLOBALS.FONT.BOLD
    },
})
