import React from "react";
import { StyleSheet, View, Animated,Text } from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister  } from 'react-native-event-listeners';
import SingerTabsView from '../../Views/SingerTabsView.js';
import SearchInput from '../../Views/SearchInput.js';
import SongListScreen from '../BaiHat/SongListScreen.js';
import MusicOnline from '../../Views/MusicOnlineButton';
import Header2 from '../Header/header2';
import Header4 from '../Header/header4';
import Language from "../../DataManagers/Language.js";

export default class SingerScreen extends BaseScreen {
    _sex = GLOBALS.SINGER_SEX.ALL;
    _searchValue = "";
    static propTypes = {
        onOptionOverlayOpen: PropTypes.func,
        onBack: PropTypes.func,
    };
    constructor(props) {
        super(props);

        if(!GLOBALS.LANDSCAPE)
            this.MAX_SCROLL_HEIGHT = 145;
    }
    componentWillMount() {
        this._listenerSingerSongEvent = EventRegister.addEventListener('FilterSinger', (data) => {
            if(this._isVisible){
                this._singerTabs.searchData(this._searchValue,data.sex);
            }
        });
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerSingerSongEvent);
    }
    _onBack = () => {
        const { onBack } = this.props;
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () =>{
        //console.warn("_showCompleted");
        this._singerTabs.loadData(this._searchValue,this._sex);
    }

    focusSearchInput = () =>{
    }
    _onChangeTab = (page) =>{
        if(this._isVisible){
            this._singerTabs.loadData(this._searchValue,this._sex);
            this._handleListViewScroll(this._singerTabs.getCurrentScrollOffset());

            if(this._offsetY > this.MAX_SCROLL_HEIGHT){
                this._headerTopY = 0;
                Animated.timing(this._scrollY,{toValue:0,duration:250}).start();
            }
        }
    }
    _onSearch =(value)=> {
        if(this._searchValue != value){
            this._searchValue = value;
            this._singerTabs.searchData(value,this._sex);
            this._musicOnline.setTerm(value);
        }
    }
    _onSearchChange = (value)=>{
        if(this._searchValue != value){
            this._searchValue = value;
            this._singerTabs.searchData(value,this._sex);
            this._musicOnline.setTerm(value);
        }
    }
    _showOptOverlay = () =>{
        EventRegister.emit('ShowOptOverlay', {overlayType:GLOBALS.SING_OVERLAY.SINGER,data:{height:200}});
    }
    
    scrollExtendComponent = (top) =>{
        this._singerTabs.setScrollTabTop(top);
        this._musicOnline.setTopValue(top);
    }
    renderContent = () =>{
        if(!this.props.preLoad || this._allowLoad){
            if(GLOBALS.LANDSCAPE){
                return (
                    <View style={{flex:1}}>
                        <SingerTabsView 
                            lanTabs={['hot','vn','en','cn','ja','kr']} 
                            ref={ref => (this._singerTabs = ref)} 
                            onChangeTab = {this._onChangeTab}
                            onScroll = {this._handleListViewScroll} 
                            top={this.MAX_SCROLL_HEIGHT}/>
    
                        <MusicOnline 
                            style = {{top:85}}
                            ref={ref =>(this._musicOnline = ref)} />
                    </View>
                )
            }
            else{
                return (
                    <View style={{flex:1}}>
                        <SingerTabsView 
                            lanTabs={['hot','vn','en','cn','ja','kr']} 
                            ref={ref => (this._singerTabs = ref)} 
                            onChangeTab = {this._onChangeTab}
                            onScroll = {this._handleListViewScroll} 
                            tabTop = {50}
                            top={this.MAX_SCROLL_HEIGHT}/>
    
                        <MusicOnline 
                            style = {{top:93,height:40}}
                            ref={ref =>(this._musicOnline = ref)} />
                    </View>
                )
            }
        }
           // return this.renderContentView();
    }
    renderContentView = () => {
        const {searchHolder} = this.props;
        if(GLOBALS.LANDSCAPE){
            return (
                <View style={{ flex: 1 }}>
                    <Animated.View style={[styles.headerContainer, { transform: [{ translateY: this._scrollY }]}]}>
                        <Header2
                            ref={ref=>(this._header = ref)}
                            right={<View style={{flex:1,flexDirection:"row", justifyContent:"flex-end",alignItems:"center"}}>
                                        <View style={{ width: 40, height: 40}}>
                                            <IconRippe vector={true} name="all" size={20} color="#fff"
                                                onPress={this._showOptOverlay} />
                                        </View>
                                        <View style={{ width: 40, height: 40}}>
                                            <IconRippe vector={true} name="male" size={20} color="#fff"
                                                onPress={this._showOptOverlay} />
                                        </View>
                                        <View style={{ width: 40, height: 40}}>
                                            <IconRippe vector={true} name="famale" size={20} color="#fff"
                                                onPress={this._showOptOverlay} />
                                        </View>
                                        <View style={{ width: 40, height: 40}}>
                                            <IconRippe vector={true} name="nhomnhac" size={20} color="#fff"
                                                onPress={this._showOptOverlay} />
                                        </View>
                                    </View>
                                    }
                            h = {40}
                            onSearch={this._onSearch}
                            onSearchChange = {this._onSearchChange}
                            onBack = {this._onBack}
                            left={<Text style={[styles.title]}>{Language.Strings.caidat}</Text>}
                        />
                    </Animated.View>
    
                    {this.renderContent()}
                    
                </View>
            );
        }
        else{
            return (
                <View style={{ flex: 1 }}>
                    <Animated.View style={[styles.headerContainer, {height:GLOBALS.HEADER_HEIGHT, transform: [{ translateY: this._scrollY }]}]}>
                        <Header4
                            ref={ref=>(this._header = ref)}
                            searchHolder = {searchHolder}
                            onSearch={this._onSearch}
                            onSearchChange = {this._onSearchChange}
                            onBack = {this._onBack}
                            // left={<Text style={[styles.title]}>CA SỸ</Text>}
                            right = {<View style={{ width: 40, height: 40}}>
                                        <IconRippe vector={true} name="tuychon2" size={20} color="#fff"
                                            onPress={this._showOptOverlay} />
                                    </View>}
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
    title: {
        fontSize: 20,
        fontWeight: '300',
        marginLeft:5,
        color:"#fff",
        fontFamily:GLOBALS.FONT.BOLD
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
})
