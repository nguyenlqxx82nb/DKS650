import React from "react";
import { StyleSheet, View } from "react-native";
import BaseScreen from "../Screens/ScreenBase"
import PropTypes from 'prop-types';
import IconRippe from '../Components/IconRippe.js'
import { Grid, Col , Row} from "react-native-easy-grid";
import GLOBALS from '../DataManagers/Globals.js';
import Ngonngu from '../SideBar/Ngonngu';
import Secure from '../SideBar/Secure';
import SongTabScreen from '../Screens/BaiHat/SongTabScreen';

import { EventRegister  } from 'react-native-event-listeners';

export default class SecondScreen extends BaseScreen {
    static propTypes = {
        onBack: PropTypes.func,
    };
    
    constructor(props) {
        super(props);

        this.state = {
            type : GLOBALS.SECOND_SCREEN.NONE
        }
    }
    
    _onBack = () => {
        const { onBack } = this.props;
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () =>{
        const {type} = this.state;
       // console.warn("_showCompleted = "+type);
        if(type == GLOBALS.SECOND_SCREEN.UNDOWNLOAD)
        {
            this._undownloadScreen._showCompleted();
        }
        else if(type == GLOBALS.SECOND_SCREEN.DOWNLOADING){
            this._undownloadScreen._showCompleted();
        }
    }

    open = (type) => {
        if(this._isVisible){
            this.hide(()=>{
                this.setState({type:GLOBALS.SECOND_SCREEN.NONE});
                this.setState({type:type});
                this.show();
            });
        }
        else{
            //console.warn("open = "+type);
            this.setState({type:GLOBALS.SECOND_SCREEN.NONE});
            this.setState({type:type});
            this.show();
        }
        
    }
    
    renderContentView = () => {
        const {type} = this.state;
        //console.warn("renderContentView = "+type);
        if(type == GLOBALS.SECOND_SCREEN.NGONNGU){
            this._maxIndex = 11;
            return <Ngonngu onBack = {this._onBack} />
        }
        else if(type == GLOBALS.SECOND_SCREEN.SECURE){
            this._maxIndex = 11;
            return <Secure onBack = {this._onBack}  />
        }
        else if(type == GLOBALS.SECOND_SCREEN.UNDOWNLOAD){
            //console.warn("renderContentView UNDOWNLOAD = "+type);
            this._maxIndex = 6;
            return <SongTabScreen 
                        //hasOnlineButton={false}
                        listType= {GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD}
                        opacity= {1} 
                        maxZindex ={1} 
                        onBack={this._onBack} 
                        ref={ref => (this._undownloadScreen = ref)} />
        }
        else if(type == GLOBALS.SECOND_SCREEN.DOWNLOADING){
            //console.warn("renderContentView DOWNLOADING = "+type);
            this._maxIndex = 6;
            return <SongTabScreen 
                       // hasOnlineButton={false}
                        listType= {GLOBALS.SONG_LIST_TYPE.DOWNLOADING}
                        opacity= {1} 
                        maxZindex ={1} 
                        onBack={this._onBack} 
                        ref={ref => (this._downloadingScreen = ref)} />
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
