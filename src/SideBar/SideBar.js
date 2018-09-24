import React from "react";
import {Text,StyleSheet,View,ListView} from "react-native";
import ListItem from '../Components/ListItem';
import CustomIcon from '../Components/CustomIcon';
import { EventRegister } from 'react-native-event-listeners'
import LinearGradient from 'react-native-linear-gradient';
import GLOBALS from "../DataManagers/Globals";

const datas = [
    {
        title:"Chưa tải",
        icon:"singOpt",
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
    {
        title:"Đã hát",
        icon:"mic2",
        event:"OpenSecondScreen",
        color:"#00ECBB",
        screenType: GLOBALS.SECOND_SCREEN.SING
    },
    {
        title:"Bài USB",
        icon:"uutien",
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
    {
        title:"Khởi động lại",
        icon:"restart",
        event:"Restart",
        color:"#0093FF",
        screenType: GLOBALS.SECOND_SCREEN.NONE
    },
    {
        title:"Tắt máy",
        icon:"shutdown",
        event:"Shutdown",
        color:"#FF2626",
        screenType: GLOBALS.SECOND_SCREEN.NONE
    },
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
                    this.props.navigation.closeDrawer(); 
                    setTimeout(()=>{
                        EventRegister.emit(event,{type:screenType});
                    },10); 
                }}
                style={{height:60,width:"100%"}}>
                <View style={{flex:1, marginLeft:25,marginRight:10,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                    <CustomIcon name={icon} size ={30} style={{color:color}} />
                    <View style={{flex:1,justifyContent:"center",alignItems:"flex-start"}}>
                        <Text style={{fontSize:16,fontFamily:"SF-Pro-Text-Medium",color:"#fff",marginLeft:10}}>{title}</Text>
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
            </View>
        );
    }
} 

const styles = StyleSheet.create({
    headerContainer : {
        width:"100%",
        height:60,
        backgroundColor:"#444083"
    },

    listContainer :{
        flex:1,
    }
})
