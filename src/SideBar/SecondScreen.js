import React from "react";
import { StyleSheet, View } from "react-native";
import BaseScreen from "../Screens/ScreenBase"
import PropTypes from 'prop-types';
import IconRippe from '../Components/IconRippe.js'
import { Grid, Col , Row} from "react-native-easy-grid";
import GLOBALS from '../DataManagers/Globals.js';
import Ngonngu from '../SideBar/Ngonngu';
import Secure from '../SideBar/Secure';
import SongListScreen from '../Screens/BaiHat/SongListScreen';
import { EventRegister  } from 'react-native-event-listeners';
import Language from '../DataManagers/Language'

export default class SecondScreen extends BaseScreen {
    static propTypes = {
        onBack: PropTypes.func,
    };
    
    constructor(props) {
        super(props);

        this._type = GLOBALS.SECOND_SCREEN.NONE;
    }
    
    _onBack = () => {
        const { onBack } = this.props;
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () =>{
        this.loadData();
    }

    _hideCompleted = () =>{
        this._type = GLOBALS.SECOND_SCREEN.NONE;
        this.setState({});
    }

    open = (type) => {
        this._type = type;
        if(this._isVisible){
            this.setState({});
            this.loadData();
        }
        else{
           // console.warn("open = "+type);
            //this.setState({type:GLOBALS.SECOND_SCREEN.NONE});
            this.setState({});
            this.show();
        }
    }

    loadData = () =>{
        if(this._type == GLOBALS.SECOND_SCREEN.UNDOWNLOAD)
        {
            //this.setState({});
            this._undownloadScreen.loadData();
        }
        else if(this._type == GLOBALS.SECOND_SCREEN.DOWNLOADING){
            this._downloadScreen.loadData();
        }
        else if(this._type == GLOBALS.SECOND_SCREEN.USB){
            this._usbScreen.loadData();
        }
    }

    // renderContentView = () => {
    //     return (<View style={{width:200,height:200,backgroundColor:"red"}}></View>);
    // }
    renderContentView = () => {
        if(this._type == GLOBALS.SECOND_SCREEN.UNDOWNLOAD){
            //console.warn("renderContentView UNDOWNLOAD "+this._type);
            return(
                <SongListScreen 
                    key={GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD}
                    opacity= {1} 
                    maxZindex ={5} 
                    //transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                    duration={250}
                    listType={GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD}
                    title ={Language.Strings.baichuatai.toUpperCase()}
                    onBack={this._onBack}
                    ref = {ref =>(this._undownloadScreen=ref)}
                    preLoad = {false}
                    searchHolder = {Language.Strings.baichuatai}
                    //onBack={this._onBackHome} ref={ref => (this._hotScreen = ref)}
                    bottom={0}
                />);
        }
        else if(this._type == GLOBALS.SECOND_SCREEN.NGONNGU){
            //this._maxIndex = 11;
            return <Ngonngu onBack = {this._onBack} />
        }
        else if(this._type == GLOBALS.SECOND_SCREEN.SECURE){
           // this._maxIndex = 11;
            return <Secure onBack = {this._onBack}  />
        }
        else if(this._type == GLOBALS.SECOND_SCREEN.DOWNLOADING){
            //return <Secure onBack = {this._onBack}  />
            return(
                <SongListScreen 
                    key={GLOBALS.SONG_LIST_TYPE.DOWNLOADING}
                    opacity= {1} 
                    maxZindex ={5} 
                    //transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                    duration={250}
                    listType={GLOBALS.SONG_LIST_TYPE.DOWNLOADING}
                    title ={Language.Strings.baichuatai.toUpperCase()}
                    onBack={this._onBack}
                    ref = {ref =>(this._downloadScreen=ref)}
                    preLoad = {false}
                    searchHolder = {Language.Strings.baichuatai}
                    //onBack={this._onBackHome} ref={ref => (this._hotScreen = ref)}
                    bottom={0}
                />);
        }
        else if(this._type == GLOBALS.SECOND_SCREEN.USB){
            //return <Secure onBack = {this._onBack}  />
            return(
                <SongListScreen 
                    key={GLOBALS.SECOND_SCREEN.USB}
                    opacity= {1} 
                    maxZindex ={5} 
                    //transition = {GLOBALS.TRANSITION.SLIDE_LEFT}
                    duration={250}
                    listType={GLOBALS.SONG_LIST_TYPE.USB}
                    title ={Language.Strings.usb.toUpperCase()}
                    onBack={this._onBack}
                    ref = {ref =>(this._usbScreen=ref)}
                    preLoad = {false}
                    searchHolder = {Language.Strings.usb}
                    //onBack={this._onBackHome} ref={ref => (this._hotScreen = ref)}
                    bottom={0}
                />);
        }
        else{
            //console.warn("renderContentView "+this._type);
            <View></View>
        }
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor:GLOBALS.COLORS.HEADER,
        height: 60
    },
    title: {
        fontSize: 18,
        fontWeight: '300',
        //paddingLeft:20,
        marginLeft:10,
        color:"#fff",
       // flex:1,
        fontFamily:'SF-Pro-Text-Regular'
    },
    textFlag: {
        fontFamily: "SF-Pro-Text-Regular",
        fontSize: 13, 
        //marginLeft: 15,
        color:"#fff",
        marginTop:5
    },

    containerFlag:{
        width:240,
        height:155,
        justifyContent:"center",
        alignItems:"center",
        
    }

})
