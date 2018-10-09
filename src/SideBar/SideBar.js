import React from "react";
import {Text,StyleSheet,View,ListView} from "react-native";
import ListItem from '../Components/ListItem';
import CustomIcon from '../Components/CustomIcon';
import { EventRegister } from 'react-native-event-listeners'
import LinearGradient from 'react-native-linear-gradient';
import GLOBALS from "../DataManagers/Globals";
import AutoHeightImage from "react-native-auto-height-image";

const logo = require("../../assets/logo.png");
const datas = [
    {
        title:"Chưa tải",
        icon:"chua-tai",
        event:"OpenSecondScreen",
        color:"#00ECBB",
        screenType: GLOBALS.SECOND_SCREEN.UNDOWNLOAD
    },
    {
        title:"Đang tải",
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
        title:"Bài USB",
        icon:"usb",
        event:"OpenSecondScreen",
        color:"#00ECBB",
        screenType: GLOBALS.SECOND_SCREEN.USB
    },
    {
        title:"Ngôn ngữ",
        icon:"ngonngu",
        event:"OpenSecondScreen",
        color:"#00ECBB",
        screenType: GLOBALS.SECOND_SCREEN.NGONNGU
    },
    {
        title:"Cài đặt",
        icon:"setting",
        event:"OpenSecondScreen",
        color:"#00ECBC",
        screenType: GLOBALS.SECOND_SCREEN.SECURE
    },
    // {
    //     title:"Khởi động lại",
    //     icon:"restart",
    //     event:"Restart",
    //     color:"#0093FF",
    //     screenType: GLOBALS.SECOND_SCREEN.NONE
    // },
    // {
    //     title:"Tắt máy",
    //     icon:"shutdown",
    //     event:"Shutdown",
    //     color:"#FF2626",
    //     screenType: GLOBALS.SECOND_SCREEN.NONE
    // },
];
export default class SideBar extends React.Component
{
    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows(datas),
        };
      }
    renderRow =(item)=>{
        const {title,icon,color,event,screenType} =item;
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
                style={{height:60,width:"100%"}}>
                <View style={{flex:1, marginLeft:10,marginRight:15,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                    <View style={{width:60,justifyContent:"center",alignItems:"center"}}>
                        <CustomIcon name={icon} size ={30} style={{color:color}} />
                    </View>
                    <View style={{flex:1,justifyContent:"center",alignItems:"flex-start"}}>
                        <Text style={{fontSize:17,fontFamily:"SF-Pro-Text-Medium",color:"#fff",marginLeft:5}}>{title}</Text>
                    </View>
                    <CustomIcon name={"goPage"} size ={20} style={{color:"#fff"}} />
                </View>
            </ListItem>
        );
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={styles.headerContainer}>
                    <AutoHeightImage source={logo} width={70} ></AutoHeightImage>
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
                    <Text style={{fontSize:15,color:"#fff",fontFamily:GLOBALS.FONT.BOLD}}>BTE copyright © 2018</Text>
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
