import React from "react";
import {Text,StyleSheet,View,ListView} from "react-native";
import ListItem from '../Components/ListItem';
import CustomIcon from '../Components/CustomIcon';
import { EventRegister } from 'react-native-event-listeners'
import LinearGradient from 'react-native-linear-gradient';
import GLOBALS from "../DataManagers/Globals";
import AutoHeightImage from "react-native-auto-height-image";
import Utils from "../Utils/Utils";
import Language from '../DataManagers/Language';

const logo = require("../../assets/logo.png");
export default class SideBar extends React.Component
{
    constructor() {
        super();
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: this.ds.cloneWithRows(this.getDatas()),
        };
    }
    componentWillMount() {
        // Hide Footer
        this._listenerChangeLanguageEvent = EventRegister.addEventListener('ChangeLanguage', (data) => {
            this.setState({dataSource: this.ds.cloneWithRows(this.getDatas())});
        });
    }
    componentWillUnmount(){
        EventRegister.removeEventListener(this._listenerChangeLanguageEvent);
    }
    getDatas = () =>{
        const datas = [
            {
                title:Language.Strings.chuatai,
                icon:"chua-tai",
                event:"OpenSecondScreen",
                color:"#00ECBB",
                screenType: GLOBALS.SECOND_SCREEN.UNDOWNLOAD
            },
            {
                title:Language.Strings.dangtai,
                icon:"tuychon",
                event:"OpenSecondScreen",
                color:"#00ECBB",
                screenType: GLOBALS.SECOND_SCREEN.DOWNLOADING
            },
            // {
            //     title:"Đã hát",
            //     icon:"mic2",
            //     event:"OpenSecondScreen",
            //     color:"#00ECBB",
            //     screenType: GLOBALS.SECOND_SCREEN.SING
            // },
            {
                title:Language.Strings.usb,
                icon:"usb",
                event:"OpenSecondScreen",
                color:"#00ECBB",
                screenType: GLOBALS.SECOND_SCREEN.USB
            },
            {
                title:Language.Strings.ngon,
                icon:"ngonngu",
                event:"OpenSecondScreen",
                color:"#00ECBB",
                screenType: GLOBALS.SECOND_SCREEN.NGONNGU
            },
            {
                title:Language.Strings.caidat,
                icon:"setting",
                event:"OpenSecondScreen",
                color:"#00ECBC",
                screenType: GLOBALS.SECOND_SCREEN.SECURE
            },
        ];

        return datas;
    }
    renderRow =(item)=>{
        const {size} = this.props;
        const {title,icon,color,event,screenType} =item;
        var height = 60;
        var fontSize = 17;
        if(size == 2){
            height = 70;
            fontSize = 18;
        }
        else if(size == 3){
            height = 80;
            fontSize = 20;
        }
        return(
            <ListItem 
                onPress ={()=>{
                    setTimeout(()=>{
                        EventRegister.emit("CloseDrawer",{}); 
                    },10); 
                    
                    setTimeout(()=>{
                        EventRegister.emit(event,{type:screenType});
                    },20); 
                }}
                style={{height:height,width:"100%"}}>
                <View style={{flex:1, marginLeft:15,marginRight:20,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                    <View style={{width:height,justifyContent:"center",alignItems:"center"}}>
                        <CustomIcon name={icon} size ={height/2} style={{color:color}} />
                    </View>
                    <View style={{flex:1,justifyContent:"center",alignItems:"flex-start"}}>
                        <Text style={{fontSize:fontSize,fontFamily:"SF-Pro-Text-Medium",color:"#fff",marginLeft:7}}>{title}</Text>
                    </View>
                    <CustomIcon name={"goPage"} size ={25} style={{color:"#fff"}} />
                </View>
            </ListItem>
        );
    }

    render(){
        const {size} = this.props;
        var h = 90;
        var width = 70;
        if(size == 2){
            h = 100;
            width = 90;
        }
        else if(size == 3){
            h = 105;
            width = 110;
        }
        return(
            <View style={{flex:1}}>
                <View style={[styles.headerContainer,{height:h}]}>
                    <AutoHeightImage source={logo} width={width} ></AutoHeightImage>
                </View>
                <LinearGradient 
                    start={{x: 0.1, y: 0.1}} end={{x: 1, y: 1}} 
                    colors={['#434B8F', '#435A9D', '#436BA8', '#4780B1', '#55BFC8']} 
                    style={[styles.listContainer]}>
                    <ListView
                        dataSource = {this.state.dataSource }
                        contentContainerStyle = {{ marginTop: 0}}
                        renderRow={this.renderRow}
                    /> 
                </LinearGradient>   
                <View style={{height:40,width:"100%",
                        position:"absolute",bottom:0,backgroundColor:"transparent",justifyContent:"center",alignItems:"center"}}>
                    <Text style={{fontSize:15,color:"#fff",fontFamily:GLOBALS.FONT.BOLD}}>{"BTE copyright © 2018"} 
                    </Text>
                </View>
            </View>
        );
    }
} 

const styles = StyleSheet.create({
    headerContainer : {
        width:"100%",
        height:90,
        backgroundColor:"#444083",
        justifyContent:"center",
        alignItems:"center"
    },

    listContainer :{
        flex:1,
    }
})
