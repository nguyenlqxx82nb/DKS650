import React from "react";
import { StyleSheet, Alert, TextInput,View } from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister  } from 'react-native-event-listeners';
import SongTabsView from '../../Views/SongTabsView.js';
import SearchInput from '../../Views/SearchInput.js';
import MusicOnline from '../../Views/MusicOnlineButton.js';

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
        tabType: PropTypes.number
    };
    constructor(props) {
        super(props);

        this._listType = (this.props.listType != null)? this.props.listType: GLOBALS.SONG_LIST_TYPE.ALL;
        this._hasOnlineButton = (this.props.hasOnlineButton != null)?this.props.hasOnlineButton: true;
        this.tabType = (this.props.tabType != null)?this.props.tabType:GLOBALS.SONG_TAB.LANGUAGE;

        //console.warn("listType = "+this._listType+" , "+this.props.listType);
    }
    _onBack = () => {
        const { onBack } = this.props;
        this._searchInput.blur();
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () =>{
        this._songTabs.setVisible(true);
        this._songTabs.loadData(this._searchInput.getValue());
    }
    _hideCompleted = ()=>{
        this._songTabs.setVisible(false);
    }
    focusSearchInput = () =>{
        this._searchInput.focus();
    }
    _onChangeTab = (page) =>{
        if(this._isVisible){
            //console.warn("_onChangeTab");
            this._songTabs.loadData(this._searchInput.getValue());
        }
    }
    _onSearch =(value)=> {
        this._songTabs.searchData(value);
        if(this._musicOnline != null)
            this._musicOnline.setTerm(value);
    }
    loadData = () =>{
        this._songTabs.refreshData();
    }
    renderContentView = () => {
        var top = (this._hasOnlineButton)?(GLOBALS.LANDSCAPE?50:40):0;
        
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <View style={{ width: 40, height: 40, marginLeft: 0 }}>
                        <IconRippe vector={true} name="back" size={20} color="#fff"
                            onPress={this._onBack}
                        />
                    </View>
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}} > 
                        <View style={{width:"80%",height:40,justifyContent:"center",alignItems:"center"}}>
                            <SearchInput 
                                ref={ref=>(this._searchInput = ref)} 
                                onSearchChange={this._onSearch}
                                onSearch={this._onSearch} /> 
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1}}>
                    <SongTabsView 
                        tabs={(this.tabType == GLOBALS.SONG_TAB.LANGUAGE)?lans:song_types} 
                        ref={ref => (this._songTabs = ref)} 
                        songListType = {this._listType}
                        onChangeTab = {this._onChangeTab} 
                        tabType = {this.tabType}
                        top={top}/>
                </View>
                { 
                    this._hasOnlineButton && 
                    <MusicOnline 
                        ref={ref =>(this._musicOnline = ref)}
                        onOpenOnline = {()=>{
                            this._searchInput.blur();
                        }}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        //marginTop: GLOBALS.STATUS_BAR_HEIGHT,
        height: 40,
        overflow: "hidden",
        backgroundColor:GLOBALS.COLORS.HEADER
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
})
