import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomScrollableTabBar from '../Components/CustomScrollableTabBar.js'
import GLOBALS from '../DataManagers/Globals.js';
import { EventRegister  } from 'react-native-event-listeners';
import SongListView from './SongListView.js';


export default class SongTabsView extends React.Component {
    static propTypes = {
        tabs: PropTypes.array.isRequired,
        tabType : PropTypes.number,
        onChangeTab : PropTypes.func,
        songType : PropTypes.number,
        songListType : PropTypes.number,
        top : PropTypes.number
    };
    static defaultProps = {
        songType : GLOBALS.SONG_TYPE.ALL,
        songListType : GLOBALS.SONG_LIST_TYPE.ALL,
        top : 40,
        tabType: GLOBALS.SONG_TAB.LANGUAGE
    };

    _tabs = [];
    _currPage = 0;
    _searchTerm = "";
    _isVisible = false;
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
            if(this._isVisible)
                this._tabs[this._currPage].updateSong();
        });

        this._listenerDownloadSongEvent = EventRegister.addEventListener('SongDownloadUpdate', () => {
            if(this.props.songListType == GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD){
                if(this._isVisible)
                    this._tabs[this._currPage].updateDownloadSong();
            }
        });
    }
    
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerSongUpdateEvent);
        EventRegister.removeEventListener(this._listenerDownloadSongEvent);
    }

    _onOptionBaiHatClick = (id, overlayType) => {
        const { onOptionOverlayOpen } = this.props;
        if (onOptionOverlayOpen != null) {
            onOptionOverlayOpen(id,overlayType);
        }
    }

    _onChangeTab = (page) => {
        this._currPage = page.i;
        if(this.props.onChangeTab != null){
            this.props.onChangeTab(page.i);
        }
    }

    setVisible = (isVisible) =>{
        this._isVisible = isVisible;
    }

    loadData = (term) =>{
        //console.warn("SongTab loadData term = "+term);
        this._searchTerm = term;
        this._tabs[this._currPage].loadData(term);
    }

    clear = () =>{
        this._tabs[this._currPage].clear();
    }

    searchData = (term) =>{
        this._searchTerm = term;
        this._tabs[this._currPage].searchData(term);
    }

    refreshData = () =>{
        this._tabs[this._currPage].refreshData("");
    }

    renderTabs = () =>{
        var tabContent = {};
        if(GLOBALS.LANDSCAPE){
            tabContent ={
                borderTopWidth: 0
            }
        }

        if(this.props.tabType == GLOBALS.SONG_TAB.LANGUAGE){
            this.props.tabs.map((lan, index) => {
                return (
                    <View key={index} style={[styles.tabContent,tabContent,{marginTop:this.props.top}]} tabLabel={GLOBALS.LANGUAGE_NAME[lan]}>
                        <SongListView 
                            listType = {this.props.songListType}
                            lan={lan} 
                            songType={this.props.songType} 
                            ref={ref => (this._tabs[index] = ref)} />
                    </View>) ;
            })
        }
        else if(this.props.tabType == GLOBALS.SONG_TAB.SONG_TYPE){
            this.props.tabs.map((type, index) => {
                return (
                    <View key={index} 
                          style={[styles.tabContent,tabContent,{marginTop:this.props.top}]} 
                          tabLabel={GLOBALS.SONG_TYPE_NAME[type]}>
                        <SongListView 
                            listType = {this.props.songListType}
                            songType={GLOBALS.SONG_TYPE[type]} 
                            ref={ref => (this._tabs[index] = ref)} />
                    </View>) ;
            })
        }
    }
    
    render() {
        var tabContent = {};
        if(GLOBALS.LANDSCAPE){
            tabContent ={
                borderTopWidth: 0
            }
        }

        return (
            <ScrollableTabView
                        style={{ marginTop: 0, }}
                        
                        initialPage={0}
                        onChangeTab = {this._onChangeTab}
                        renderTabBar={() => 
                        <CustomScrollableTabBar
                            //backgroundColor = {"red"}
                            isTabRound={true}
                            tabContainerStyle={{borderRadius:15, height:30,  borderWidth:1, borderColor:"#fff",marginLeft:5}}
                            tabsContainerStyle={{marginLeft:20}}
                            underlineStyle={{ height: 0 }}
                            activeTextColor={"#0ECAB1"}
                            inactiveTextColor={"#fff"}
                            textStyle={{ fontSize: 12, color: "#fff", fontFamily:GLOBALS.FONT.BOLD,paddingLeft: 15, paddingRight: 15, }}
                            style={{ borderWidth: 0}}
                        />}
                    >
                    {(this.props.tabType == GLOBALS.SONG_TAB.LANGUAGE)&& this.props.tabs.map((lan, index) => {
                        return (
                            <View key={index} style={[styles.tabContent,tabContent,{marginTop:this.props.top}]} tabLabel={GLOBALS.LANGUAGE_NAME[lan]}>
                                <SongListView 
                                    listType = {this.props.songListType}
                                    lan={lan} 
                                    songType={this.props.songType} 
                                    ref={ref => (this._tabs[index] = ref)} />
                            </View>) ;
                    })}

                    {(this.props.tabType == GLOBALS.SONG_TAB.SONG_TYPE)&& 
                     this.props.tabs.map((type, index) => {
                        return (
                            <View key={index} 
                                  style={[styles.tabContent,tabContent,{marginTop:this.props.top}]} 
                                  tabLabel={GLOBALS.SONG_TYPE_NAME[type]}>
                                <SongListView 
                                    listType = {this.props.songListType}
                                    songType={GLOBALS.SONG_TYPE[type]} 
                                    ref={ref => (this._tabs[index] = ref)} />
                            </View>) ;
                    })}
                    </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        borderTopWidth: 0.5,
        borderColor: '#00ECBC',
    },
})
