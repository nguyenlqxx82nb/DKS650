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
import SearchInput from '../../Views/SearchInput';
import {Grid,Col,Row} from 'react-native-easy-grid';
import TuKhoaHot from '../../Views/TukhoaHot';
import ChannelList from '../../Views/channels';

const HEADER_HEIGHT = 140;
export default class OnlineScreen extends BaseScreen {
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
        
        this.selectChannel = this.selectChannel.bind(this);
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
        //this._searchHeader.showSearchInput();
        this._searchInput.focusSearch(this._term);
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
        // if(this._searchHeader.searchShow()){
        //     this._headerTopY = 0;
        //     Animated.timing(this.state.scrollY,{toValue:this._headerTopY,duration:0}).start();
        //     this._offsetY = offsetY;

        //     return;
        // }

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
                    Animated.timing(this.state.scrollY,{toValue:0,duration:350}).start();
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

    selectChannel(channel){
        this._term = channel;
        this._searchInput.setValue(this._term);
        this._songList.searchData(this._term);
    }
    
    renderContentView = () => {
        //const { maxZindex } = this.props;
        return (
            <View style={{ flex: 1,width:'100%'}}>
                <Animated.View 
                    style={[styles.headerContainer,{ transform: [{ translateY: this.state.scrollY }]}]}
                    ref = {ref => (this._header = ref)}>
                    <View style={styles.container}>
                        <View style={{height:40,flexDirection:"row"}}>
                            <View style={{width:"20%"}}>
                                <View style={{flex:1, flexDirection:"row", justifyContent:"flex-start",alignItems:"center"}}>
                                    <View style={{width:40,height:40}}>
                                        <IconRippe vector={true} name="back" size={20} color="#fff"
                                            onPress={()=>{
                                                if(this.props.onBack != null){
                                                    //this._searchInput.blur();
                                                    this.props.onBack();
                                                }
                                            }}
                                        />
                                    </View>
                                    {this._renderOnlineIcon()}
                                </View>
                            </View>
                            <View style={{height:40,justifyContent:"center",width:"65%"}}>
                                <SearchInput style={{marginRight:0}} 
                                    onSearch={this._onSearch}
                                    onSearchChange = {this._onSearchChange}
                                    ref={ref=>(this._searchInput = ref)}  />
                            </View>
                        </View>
                        <View style={{height:40,justifyContent:"center"}}>
                            <TuKhoaHot 
                                onSelectChannel = {this.selectChannel}
                            />                       
                        </View>
                        <View style={{height:50,justifyContent:"center"}}>
                            <ChannelList 
                                onSelectChannel= {this.selectChannel}
                            />                        
                        </View>   
                    </View>
                </Animated.View>

                <Animated.View style={styles.bodyContainer}
                    ref={ref => (this._videoListContainer = ref)} >
                    <SongOnlineListView 
                        ref={ref=>(this._songList = ref)} 
                        onScroll = {this._handleScroll}
                        onlineType = {this.props.type} 
                        top = {HEADER_HEIGHT + 15} />
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
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height:5 },
        shadowOpacity: 0.2,
        elevation: 15,
        backgroundColor:"#44498B",
    },

    container:{
        flex:1, 
        paddingBottom:5,
       // marginBottom:5,
        
    },
    
    bodyContainer : {
        flex:1,
        zIndex:0
        //marginTop:50
    }

})