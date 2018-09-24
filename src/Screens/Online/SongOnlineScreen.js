import React from "react";
import { StyleSheet, View,Dimensions,Animated} from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister  } from 'react-native-event-listeners';
import SongOnlineListView from './SongOnlineListView.js';
import CustomIcon from '../../Components/CustomIcon.js';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Header/index';
import SearchInput from '../../Views/SearchInput'

const screen = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
}
const HEADER_HEIGHT = 50;
export default class SongOnlineScreen extends BaseScreen {
    static propTypes = {
        //onOptionOverlayOpen: PropTypes.func,
        onBack: PropTypes.func,
        type : PropTypes.number,
    };
    _offsetY = 0;
    _headerTopY = 0;
    _term = "";
    constructor(props) {
        super(props);
        this.state = {
            scrollY : new Animated.Value(this._headerTopY),
        }
        //this.songChanged = false;
    }
    // componentWillMount() {
    //     // selected song changed
    //     this._listenerSongUpdateEvent = EventRegister.addEventListener('SongUpdate', (data) => {
    //         if(this._isVisible){
    //             this._songList.refreshData("");
    //         }
    //         else{
    //             this.songChanged = true;
    //         }
    //     });
    // }
    // componentWillUnmount() {
    //     EventRegister.removeEventListener(this._listenerSongUpdateEvent);
    // }
    focus = (term) =>{
        this._term = term;
        this._searchHeader.showSearchInput();
    }
    _onSearchInputShow = () =>{
        this._searchInput.focusSearch(this._term);
    }
    _onBack = () => {
        const { onBack } = this.props;
        this._searchInput.blur();
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () =>{
        if(this._term == ""){
            let term = this._searchInput.getValue();
           // console.warn("_showCompleted = "+term);
            this._songList.loadData(term);
        }
    }
    _onSearch = (value) =>{
        this._term = value;
       // console.warn("_onSearch = "+value);
        this._songList.searchData(value);
    }
    _onSearchChange = (value) =>{
        //this._songList.searchData(value);
    }
    _handleScroll = (offsetY) =>{
        if(this._searchHeader.searchShow()){
            this._headerTopY = 0;
            Animated.timing(this.state.scrollY,{toValue:this._headerTopY,duration:0}).start();
            this._offsetY = offsetY;

            return;
        }

        if(offsetY > HEADER_HEIGHT){
            if(this._offsetY <= offsetY){
                if(this._headerTopY > -HEADER_HEIGHT){
                    var delta = offsetY - this._offsetY;
                    this._headerTopY = Math.max(this._headerTopY - delta,-HEADER_HEIGHT);
                    this._headerTopY = (this._headerTopY > 0)?0:this._headerTopY;
                    Animated.timing(this.state.scrollY,{toValue:this._headerTopY,duration:0}).start();
                }
            }
            else{
                if(this._headerTopY < 0){
                    this._headerTopY = 0;
                    Animated.timing(this.state.scrollY,{toValue:0,duration:150}).start();
                }
            }
        }
        else{
            if(this._offsetY > HEADER_HEIGHT){
                var delta = offsetY - this._offsetY;
                this._headerTopY = Math.max(this._headerTopY - delta,-HEADER_HEIGHT);
                this._headerTopY = (this._headerTopY > 0)?0:this._headerTopY;
            }
            else{
                this._headerTopY =  Math.max(-offsetY,-HEADER_HEIGHT);
            }
            Animated.timing(this.state.scrollY,{toValue:this._headerTopY,duration:0}).start();
        }

        this._offsetY = offsetY;
    }
    _renderOnlineIcon = ()=>{
        const {type} = this.props;
        if(type == GLOBALS.SONG_ONLINE.YOUTUBE){
            return(
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
                    style={{marginLeft:5, height:40,width:90,justifyContent:"center",alignItems:"center"}}
                    colors={['#FF6565', '#FF4242', '#FF2C2C', '#FF0404']} >
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        <CustomIcon name={"youtube3"} size ={60} style={{color:"#fff"}} />
                    </View>
                </LinearGradient>
            );
        }
        else if(type == GLOBALS.SONG_ONLINE.SOUNDCLOUD){
            return(
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
                    style={{marginLeft:5, height:40,width:100,justifyContent:"center",alignItems:"center"}}
                    colors={['#FFB223', '#FF9E1D', '#FF8315', '#FF4903']} >
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        <CustomIcon name={"soundcloud"} size ={90} style={{color:"#fff"}} />
                    </View>
                </LinearGradient>
            );
        }
        else if(type == GLOBALS.SONG_ONLINE.MIXCLOUD){
            return(
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
                    style={{marginLeft:5, height:40,width:100,justifyContent:"center",alignItems:"center"}}
                    colors={['#69A5E5', '#5D9CE1', '#4B90DB', '#3783D4']} >
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        <CustomIcon name={"mixcloud"} size ={90} style={{color:"#fff"}} />
                    </View>
                </LinearGradient>
            );
        }
    }
    
    renderContentView = () => {
        //const { maxZindex } = this.props;
        return (
            <View style={{ flex: 1,width:'100%'}}>
                <Animated.View 
                    style={[styles.headerContainer,{ transform: [{ translateY: this.state.scrollY }]}]}
                    ref = {ref => (this._header = ref)}>
                    <Header 
                        ref = {ref=>(this._searchHeader = ref)}
                        onBack = {this._onBack}
                        onSearchInputShow = {this._onSearchInputShow}
                        onHideInput = {()=>{
                            this._searchInput.blur();
                        }}
                        searchInput = {
                            <SearchInput style={{marginRight:0}} 
                                onSearch={this._onSearch}
                                onSearchChange = {this._onSearchChange}
                                ref={ref=>(this._searchInput = ref)}  />
                        }
                        onSearch = {this._onSearch}
                       // onSearchChange = {this._onSearchChange}
                        center ={this._renderOnlineIcon()}
                    />
                </Animated.View>

                <Animated.View style={styles.bodyContainer}
                    ref={ref => (this._videoListContainer = ref)} >
                    <SongOnlineListView 
                        ref={ref=>(this._songList = ref)} 
                        onScroll = {this._handleScroll}
                        onlineType = {this.props.type}  
                        />
                </Animated.View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "center",
        top: 0, 
        height: HEADER_HEIGHT,
        width:'100%',
        position:"absolute",
        zIndex: 1,
        backgroundColor:"#44498B",
      //  marginTop:GLOBALS.STATUS_BAR_HEIGHT
    },
    title: {
        fontSize: 18,
        fontWeight: '300',
        marginLeft:10,
        color:"#fff",
        flex:1,
        fontFamily:'SF-Pro-Text-Regular'
    },
    bodyContainer : {
        flex:1,
        zIndex:0
        //marginTop:50
    }

})