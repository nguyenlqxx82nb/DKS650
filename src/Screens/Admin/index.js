import React from "react";
import {Text,StyleSheet,View,ListView} from "react-native";
import ListItem from '../../Components/ListItem';
import CustomIcon from '../../Components/CustomIcon';
import { EventRegister } from 'react-native-event-listeners'
import BaseScreen from '../ScreenBase';
import Header from '../Header/header1';
import SubScreen from './SubScreen'

import Chuchay from './Chuchay';
import Lan from './Lan';
import Wlan from './Wlan';
import Wifi from './Wifi';
import Matkhau from './MatKhau';
import ServerAdmin from './ServerAdress';
import NgoVideo from './NgoVideo';
import Auto from './Auto';

import GLOBALS from "../../DataManagers/Globals";

const datas = [
    {
        title:"Chữ chạy TV",
        icon:"singOpt",
        event:"OpenSecondScreen",
        color:"#00ECBB",
        screenType: GLOBALS.ADMIN_SCREEN.CHU_CHAY
    },
    {
        title:"Cài đặt autoplay",
        icon:"tuychon",
        event:"OpenSecondScreen",
        color:"#00ECBB",
        screenType: GLOBALS.ADMIN_SCREEN.AUTO_PLAY
    },
    {
        title:"Ngõ ra video",
        icon:"mic2",
        event:"OpenSecondScreen",
        color:"#00ECBB",
        screenType: GLOBALS.ADMIN_SCREEN.NGO_VIDEO
    },
    {
        title:"Đặt mật khẩu Admin",
        icon:"uutien",
        event:"OpenSecondScreen",
        color:"#00ECBB",
        screenType: GLOBALS.ADMIN_SCREEN.MAT_KHAU
    },
    {
        title:"Cài đặt Wifi",
        icon:"setting",
        event:"OpenSecondScreen",
        color:"#00ECBC",
        screenType: GLOBALS.ADMIN_SCREEN.WIFI
    },
    {
        title:"Thiết lập mạng Lan",
        icon:"setting",
        event:"OpenSecondScreen",
        color:"#00ECBC",
        screenType: GLOBALS.ADMIN_SCREEN.LAN
    },
    {
        title:"Thiết lập mạng Wlan",
        icon:"setting",
        event:"OpenSecondScreen",
        color:"#00ECBC",
        screenType: GLOBALS.ADMIN_SCREEN.WLAN
    },
    {
        title:"Địa chỉ máy chủ",
        icon:"setting",
        event:"OpenSecondScreen",
        color:"#00ECBC",
        screenType: GLOBALS.ADMIN_SCREEN.SERVER
    },
    {
        title:"Quét nhạc",
        icon:"setting",
        event:"OpenSecondScreen",
        color:"#00ECBC",
        screenType: GLOBALS.ADMIN_SCREEN.SAN_MUSIC
    },
    {
        title:"Cập nhật dữ liệu",
        icon:"setting",
        event:"OpenSecondScreen",
        color:"#00ECBC",
        screenType: GLOBALS.ADMIN_SCREEN.DATA
    },
    {
        title:"Khởi động lại",
        icon:"restart",
        event:"Restart",
        color:"#0093FF",
        screenType: GLOBALS.ADMIN_SCREEN.RESTART
    },
    
    {
        title:"Tắt máy",
        icon:"shutdown",
        event:"Shutdown",
        color:"#FF2626",
        screenType: GLOBALS.ADMIN_SCREEN.SHUTDOWN
    },
];
export default class AdminScreen extends BaseScreen
{
    constructor(props) {
        super(props);
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
                    switch(screenType){
                        case GLOBALS.ADMIN_SCREEN.CHU_CHAY:
                            this._subScreen.setContent(title,<Chuchay />); 
                            this._subScreen.show();
                            break;
                        case GLOBALS.ADMIN_SCREEN.AUTO_PLAY:
                            this._subScreen.setContent(title,<Auto />); 
                            this._subScreen.show();
                            break;
                        case GLOBALS.ADMIN_SCREEN.NGO_VIDEO:
                            this._subScreen.setContent(title,<NgoVideo />); 
                            this._subScreen.show();
                            break;
                        case GLOBALS.ADMIN_SCREEN.LAN:
                            this._subScreen.setContent(title,<Lan />); 
                            this._subScreen.show();
                            break;
                        case GLOBALS.ADMIN_SCREEN.WLAN:
                            this._subScreen.setContent(title,<Wlan />); 
                            this._subScreen.show();
                            break;
                        case GLOBALS.ADMIN_SCREEN.WIFI:
                            this._subScreen.setContent(title,<Wifi />); 
                            this._subScreen.show();
                            break;
                        case GLOBALS.ADMIN_SCREEN.MAT_KHAU:
                            this._subScreen.setContent(title,<Matkhau />); 
                            this._subScreen.show();
                            break;
                        case GLOBALS.ADMIN_SCREEN.SERVER:
                            this._subScreen.setContent(title,<ServerAdmin />); 
                            this._subScreen.show();
                            break;
                        default:
                            break;
                    }
                    
                }}
                style={{height:55,width:"100%"}}>
                <View style={styles.listItem}>
                    <CustomIcon name={icon} size ={25} style={{color:color}} />
                    <View style={{flex:1,justifyContent:"center",alignItems:"flex-start"}}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <CustomIcon name={"goPage"} size ={15} style={{color:"#fff",marginRight:5}} />
                </View>
            </ListItem>
        );
    }
    renderContentView = () => {
        return(
            <View style={{flex:1}} >
                <Header 
                    style={styles.header}
                    title={"Cài đặt"} onBack={()=>{
                    this.hide();
                }} />

                <View style={{flex:1}}>
                    <ListView
                        dataSource = {this.state.dataSource}
                        contentContainerStyle = {{ marginTop: 0 }}
                        renderRow={this.renderRow}
                    /> 
                </View>

                <SubScreen 
                    ref = {ref => (this._subScreen = ref)} 
                    transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                    maxZindex = {1}
                    bottom = {10}
                    onBack = {() => {
                        this._subScreen.hide();
                    }}
                />

            </View>
        );
    }
} 

const styles = StyleSheet.create({
    header:{
        height:50,
        borderBottomWidth: 0.5,
        borderColor: '#00ECBC'
    },
    listItem :{
        flex:1, 
        marginLeft:25,
        marginRight:10,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        // backgroundColor:"red",
        // marginBottom:5
    },
    listContainer :{
        flex:1,
    },
    title:{
        fontSize:16,
        fontFamily:GLOBALS.FONT.MEDIUM,
        color:"#fff",
        marginLeft:10
    }
})
