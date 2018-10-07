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
        top : PropTypes.number,
        onScroll : PropTypes.number,
        tabTop:  PropTypes.number,
        onSearch: PropTypes.func
    };
    static defaultProps = {
        songType : GLOBALS.SONG_TYPE.ALL,
        songListType : GLOBALS.SONG_LIST_TYPE.ALL,
        top : 40,
        tabType: GLOBALS.SONG_TAB.LANGUAGE,
        tabTop : 45
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
            if(this.props.songListType == GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD
                || this.props.songListType == GLOBALS.SONG_LIST_TYPE.DOWNLOADING){
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
            setTimeout(()=>{
                this.props.onChangeTab(page.i);
            },150)
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

    _handleScroll = (offsetY) =>{
        const {onScroll} = this.props;
        if(onScroll != null){
            onScroll(offsetY);
        }
    }

    setScrollTabTop = (value)=>{
        //console.warn("setScrollTabTop 0 = "+value);
        this._scrollTab.setScrollTabTop(value);
    }

    setScrollTop = (value) => {
       // console.warn("setScrollTop = "+value)
        this._tabs[this._currPage].setScrollTop(value);
    }

    getCurrentScrollOffset= () =>{
        return this._tabs[this._currPage].getCurrentScrollOffset();
    }

    render() {
        const {tabTop}= this.props;
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
                            ref = {ref=>{this._scrollTab = ref}}
                            underlineStyle={{ backgroundColor: "#0ECAB1", height:30,bottom:5, borderRadius:15 }}
                            activeTextColor={"#0ECAB1"}
                            inactiveTextColor={"#fff"}
                            textStyle={{ fontSize: 14, color: "#fff", fontFamily:GLOBALS.FONT.BOLD }}
                            style={{ borderWidth: 0, }}
                            isTabRound = {true}
                            tabContainerStyle = {{height:30,borderRadius:15, marginLeft:5}}
                            style ={{height:40,top:tabTop}}
                            tabWidth={100}
                        />}
                    >
                    {(this.props.tabType == GLOBALS.SONG_TAB.LANGUAGE)&& this.props.tabs.map((lan, index) => {
                        return (
                            <View key={index} style={[styles.tabContent,tabContent]} 
                                tabLabel={GLOBALS.LANGUAGE_NAME[lan]}>
                                <SongListView 
                                    listType = {this.props.songListType}
                                    lan={lan} 
                                    songType={this.props.songType} 
                                    ref={ref => (this._tabs[index] = ref)}
                                    onScroll = {(value)=>{
                                        if(this.props.onScroll != null)
                                            this.props.onScroll(value);  
                                    }}
                                    top={this.props.top}
                                    onSearch = {(isSearching)=>{
                                        if(this.props.onSearch != null)
                                            this.props.onSearch(isSearching);
                                    }}
                                    />
                            </View>) ;
                    })}

                    {(this.props.tabType == GLOBALS.SONG_TAB.SONG_TYPE)&& 
                     this.props.tabs.map((type, index) => {
                        return (
                            <View key={index} 
                                  style={[styles.tabContent]} 
                                  tabLabel={GLOBALS.SONG_TYPE_NAME[type]}>
                                <SongListView 
                                    listType = {this.props.songListType}
                                    songType={GLOBALS.SONG_TYPE[type]} 
                                    ref={ref => (this._tabs[index] = ref)}
                                    onScroll = {(value)=>{
                                        if(this.props.onScroll != null)
                                            this.props.onScroll(value);  
                                    }}
                                    top={this.props.top}
                                    />
                            </View>) ;
                    })}
                    </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        // backgroundColor:"red"
        // borderTopWidth: 0.5,
        // borderColor: '#00ECBC',
    },
})
