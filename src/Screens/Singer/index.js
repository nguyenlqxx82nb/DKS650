import React from "react";
import { StyleSheet, View, Animated } from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister  } from 'react-native-event-listeners';
import SingerTabsView from '../../Views/SingerTabsView.js';
import SearchInput from '../../Views/SearchInput.js';
import SongListScreen from '../BaiHat/SongListScreen.js';
import MusicOnline from '../../Views/MusicOnlineButton'

export default class SingerScreen extends BaseScreen {
    _sex = GLOBALS.SINGER_SEX.ALL;

    static propTypes = {
        onOptionOverlayOpen: PropTypes.func,
        onBack: PropTypes.func,
    };
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this._listenerSingerSongEvent = EventRegister.addEventListener('FilterSinger', (data) => {
            if(this._isVisible){
                this._singerTabs.searchData(this._searchInput.getValue(),data.sex);
            }
        });
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this._listenerSingerSongEvent);
    }
    _onBack = () => {
        const { onBack } = this.props;
        this._searchInput.blur();
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () =>{
        //console.warn("_showCompleted");
        this._singerTabs.loadData(this._searchInput.getValue(),this._sex);
    }

    focusSearchInput = () =>{
        this._searchInput.focus();
    }
    _onChangeTab = (page) =>{
        if(this._isVisible){
            this._singerTabs.loadData(this._searchInput.getValue(),this._sex);
            this._handleListViewScroll(this._singerTabs.getCurrentScrollOffset());

            if(this._offsetY > this.MAX_SCROLL_HEIGHT){
                this._headerTopY = 0;
                Animated.timing(this.state.scrollY,{toValue:0,duration:250}).start();
            }
        }
    }
    _onSearch =(value)=> {
        this._singerTabs.searchData(value,this._sex);
        this._musicOnline.setTerm(value);
    }
    _onSearchChange = (value)=>{
        this._singerTabs.searchData(value,this._sex);
        this._musicOnline.setTerm(value);
    }
    _showOptOverlay = () =>{
        EventRegister.emit('ShowOptOverlay', {overlayType:GLOBALS.SING_OVERLAY.SINGER,data:{height:250}});
    }
    
    scrollExtendComponent = (top) =>{
        this._singerTabs.setScrollTabTop(top);
        this._musicOnline.setTopValue(top);
    }

    renderContentView = () => {
        return (
            <View style={{ flex: 1 }}>
                <Animated.View style={[styles.headerContainer, { transform: [{ translateY: this._scrollY }]}]}>
                    <View style={{ width: 40, height: 40 }}>
                        <IconRippe vector={true} name="back" size={20} color="#fff"
                            onPress={this._onBack} />
                    </View>
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}} > 
                        <View 
                            style={{width:"80%",height:40,justifyContent:"center",alignItems:"center"}}>
                            <SearchInput 
                                ref={ref=>(this._searchInput = ref)}
                                style = {{marginRight:0}}    
                                onSearch={this._onSearch}
                                onSearchChange = {this._onSearchChange}  />      
                        </View>
                    </View>
                    
                    <View style={{ width: 40, height: 40}}>
                        <IconRippe vector={true} name="tuychon2" size={20} color="#fff"
                            onPress={this._showOptOverlay} />
                    </View>
                </Animated.View>

                {/* <View style={{ flex: 1}}>
                    
                </View> */}
                <SingerTabsView 
                        lanTabs={['vn','en','cn','ja','kr']} 
                        ref={ref => (this._singerTabs = ref)} 
                        onChangeTab = {this._onChangeTab}
                        onScroll = {this._handleListViewScroll} 
                        top={this.MAX_SCROLL_HEIGHT}/>

                <MusicOnline 
                    style = {{top:80}}
                    ref={ref =>(this._musicOnline = ref)}
                    onOpenOnline = {()=>{
                        this._searchInput.blur();
                    }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "center",
       // marginTop: GLOBALS.STATUS_BAR_HEIGHT, 
        height: 40,
        backgroundColor:GLOBALS.COLORS.HEADER,
        position:"absolute",
        top:0,
        zIndex:2,
        width: "100%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    title: {
        fontSize: 28,
        fontWeight: '300',
        textAlign: 'center',
        margin: 20,
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
})
