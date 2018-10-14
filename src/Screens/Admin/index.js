import React from "react";
import {Text,StyleSheet,View,ListView,Alert} from "react-native";
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
import Utils from "../../Utils/Utils";
import Language from '../../DataManagers/Language';
import BoxControl from '../../DataManagers/BoxControl';
import DATA_INFO from '../../DataManagers/DataInfo';

export default class AdminScreen extends BaseScreen
{
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows(this.getDatas()),
        };
    }
    showSubContent = (title,element,isFull = false) =>{
        this._subScreen.setContent(title,element,(GLOBALS.LANDSCAPE)?isFull:true); 
        if(GLOBALS.LANDSCAPE)
            this._subScreen.setVisible(false);
        this._subScreen.show();
    }
    _showCompleted = () =>{
        if(GLOBALS.LANDSCAPE)
            this.showSubContent(Language.Strings.admin.chuchay,<Chuchay />);
    }
    getDatas = () =>{
        const datas = [
            {
                title:Language.Strings.admin.chuchay,
                icon:"chu-chay",
                event:"OpenSecondScreen",
                color:"#00ECBB",
                screenType: GLOBALS.ADMIN_SCREEN.CHU_CHAY
            },
            {
                title:Language.Strings.admin.auto,
                icon:"auto",
                event:"OpenSecondScreen",
                color:"#00ECBB",
                screenType: GLOBALS.ADMIN_SCREEN.AUTO_PLAY
            },
            {
                title:Language.Strings.admin.video,
                icon:"ngo-ra-video",
                event:"OpenSecondScreen",
                color:"#00ECBB",
                screenType: GLOBALS.ADMIN_SCREEN.NGO_VIDEO
            },
            {
                title:Language.Strings.admin.matkhau,
                icon:"password",
                event:"OpenSecondScreen",
                color:"#00ECBB",
                screenType: GLOBALS.ADMIN_SCREEN.MAT_KHAU
            },
            {
                title:Language.Strings.admin.wifi,
                icon:"wifi",
                event:"OpenSecondScreen",
                color:"#00ECBC",
                screenType: GLOBALS.ADMIN_SCREEN.WIFI
            },
            {
                title:Language.Strings.admin.lan,
                icon:"lan",
                event:"OpenSecondScreen",
                color:"#00ECBC",
                screenType: GLOBALS.ADMIN_SCREEN.LAN
            },
            {
                title:Language.Strings.admin.wlan,
                icon:"airplay",
                event:"OpenSecondScreen",
                color:"#00ECBC",
                screenType: GLOBALS.ADMIN_SCREEN.WLAN
            },
            {
                title:Language.Strings.admin.domain,
                icon:"musicOnline",
                event:"OpenSecondScreen",
                color:"#00ECBC",
                screenType: GLOBALS.ADMIN_SCREEN.SERVER
            },
            {
                title:Language.Strings.admin.san,
                icon:"Scan-song-01",
                event:"OpenSecondScreen",
                color:"#00ECBC",
                screenType: GLOBALS.ADMIN_SCREEN.SAN_MUSIC
            },
            {
                title:Language.Strings.admin.data,
                icon:"update",
                event:"OpenSecondScreen",
                color:"#00ECBC",
                screenType: GLOBALS.ADMIN_SCREEN.DATA
            },
            {
                title:Language.Strings.admin.restart,
                icon:"restart",
                event:"Restart",
                color:"#0093FF",
                screenType: GLOBALS.ADMIN_SCREEN.RESTART
            },
            
            {
                title:Language.Strings.admin.tatmay,
                icon:"shutdown",
                event:"Shutdown",
                color:"#FF2626",
                screenType: GLOBALS.ADMIN_SCREEN.SHUTDOWN
            },
        ];

        return datas;
    }
    renderRow =(item)=>{
        const {title,icon,color,event,screenType} =item;
        return(
            <ListItem 
                onPress ={()=>{
                    switch(screenType){
                        case GLOBALS.ADMIN_SCREEN.CHU_CHAY:
                            this.showSubContent(title,<Chuchay />); 
                            break;
                        case GLOBALS.ADMIN_SCREEN.AUTO_PLAY:
                            this.showSubContent(title,<Auto />,true); 
                            break;
                        case GLOBALS.ADMIN_SCREEN.NGO_VIDEO:
                            this.showSubContent(title,<NgoVideo />); 
                            break;
                        case GLOBALS.ADMIN_SCREEN.LAN:
                            this.showSubContent(title,<Lan />); 
                            break;
                        case GLOBALS.ADMIN_SCREEN.WLAN:
                            this.showSubContent(title,<Wlan />); 
                            break;
                        case GLOBALS.ADMIN_SCREEN.WIFI:
                            this.showSubContent(title,<Wifi />); 
                            break;
                        case GLOBALS.ADMIN_SCREEN.MAT_KHAU:
                            this.showSubContent(title,<Matkhau />); 
                            break;
                        case GLOBALS.ADMIN_SCREEN.SERVER:
                            this.showSubContent(title,<ServerAdmin />);
                            break;
                        case GLOBALS.ADMIN_SCREEN.SHUTDOWN:
                            Alert.alert(
                                Language.Strings.admin.confirm,
                                Language.Strings.admin.tmMsg1,
                                [
                                    {text: Language.Strings.admin.ok, onPress: () => {
                                        BoxControl.stbset(GLOBALS.ADMIN_CMD.SHUTDOWN,"",(error)=>{
                                            if(error == 0){
                                                EventRegister.emit("ShowToast",
                                                    {message:Language.Strings.admin.tmMsg2,
                                                     duration:5000});
                                            }
                                        });
                                    }},
                                    {text: Language.Strings.admin.cancel, onPress: () => {}}
                                ],
                                { cancelable: false }
                            )
                            break;
                        case GLOBALS.ADMIN_SCREEN.RESTART:
                            Alert.alert(
                                Language.Strings.admin.confirm,
                                Language.Strings.admin.restartMsg1,
                                [
                                    {text: Language.Strings.admin.ok, onPress: () => {
                                        BoxControl.stbset(GLOBALS.ADMIN_CMD.RESTART,"",(error)=>{
                                            if(error == 0){
                                                EventRegister.emit("ShowToast",
                                                    {message:Language.Strings.admin.restartMsg2,
                                                     duration:5000});
                                            }
                                        });
                                    }},
                                    {text: Language.Strings.admin.cancel, onPress: () => {}}
                                ],
                                { cancelable: false }
                            )
                            break;
                        case GLOBALS.ADMIN_SCREEN.SAN_MUSIC:
                            Alert.alert(
                                Language.Strings.admin.confirm,
                                Language.Strings.admin.scanMsg1,
                                [
                                    {text: Language.Strings.admin.ok, onPress: () => {
                                        BoxControl.stbset(GLOBALS.ADMIN_CMD.SAN_MUSIC,"",(error)=>{
                                            if(error == 0){
                                                EventRegister.emit("ShowToast",
                                                    {message:Language.Strings.admin.scanMsg2,
                                                     duration:15000});
                                            }
                                        });
                                    }},
                                    {text: Language.Strings.admin.cancel, onPress: () => {}}
                                ],
                                { cancelable: false }
                            )
                            break;
                        case GLOBALS.ADMIN_SCREEN.DATA:
                            Alert.alert(
                                Language.Strings.admin.confirm,
                                Language.Strings.admin.dataMsg1,
                                [
                                    {text: Language.Strings.admin.ok, onPress: () => {
                                        BoxControl.stbset(GLOBALS.ADMIN_CMD.DATA,"",(error)=>{
                                            if(error == 0){
                                                EventRegister.emit("ShowToast",
                                                    {message:Language.Strings.admin.dataMsg2,
                                                     duration:5000});
                                            }
                                        });
                                    }},
                                    {text: Language.Strings.admin.cancel, onPress: () => {}}
                                ],
                                { cancelable: false }
                            )
                            break;
                        default:
                            break;
                    }
                    
                }}
                style={{height:55,width:"100%"}}>
                <View style={styles.listItem}>
                    <View style={{width:50,justifyContent:"center",alignItems:"center",height:"100%"}}>
                        <CustomIcon name={icon} size ={25} style={{color:color}} />
                    </View>
                    <View style={{flex:1,justifyContent:"center",alignItems:"flex-start"}}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <CustomIcon name={"goPage"} size ={15} style={{color:"#fff",marginRight:5}} />
                </View>
            </ListItem>
        );
    }
    renderContentView = () => {
        if(GLOBALS.LANDSCAPE){
            return(
                <View style={{flex:1,flexDirection:"row"}} >
                    <View style={styles.leftContainer}>
                        <Header 
                            style={styles.header}
                            title={Language.Strings.caidat} onBack={()=>{
                            this.hide();
                        }} />
        
                        <View style={{flex:1}}>
                            <ListView
                                dataSource = {this.state.dataSource}
                                contentContainerStyle = {{ marginTop: 0 }}
                                renderRow={this.renderRow}
                            /> 
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <SubScreen 
                            ref = {ref => (this._subScreen = ref)} 
                            transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                            sizeX={Utils.Width()*0.65}
                            maxZindex = {1}
                            onBack = {() => {
                                this._subScreen.hide();
                            }}
                        />    
                    </View>
                </View>
            );
        }
        else{
            return(
                <View style={{flex:1}} >
                    <View style={{flex:1}}>
                        {/* <Header 
                            style={{height:50,position:"absolute",top:0,zIndex:0}}
                            title={"CÀI ĐẶT 1"} onBack={()=>{
                            this.hide();
                        }} /> */}
                       
                        <ListView
                            dataSource = {this.state.dataSource}
                            contentContainerStyle = {{ paddingTop: 60}}
                            renderRow={this.renderRow}
                        /> 
                        <View style={{height:50,zIndex:2 ,position:"absolute",width:"100%",top:0,zIndex:0}}>
                            <Header 
                                style={{height:50}}
                                title={Language.Strings.caidat} onBack={()=>{
                                this.hide();
                            }}/>
                        </View>
                    </View>
    
                    <SubScreen 
                        ref = {ref => (this._subScreen = ref)} 
                        transition={GLOBALS.TRANSITION.SLIDE_LEFT} 
                        maxZindex = {5}
                        duration={100}
                        onBack = {() => {
                            this._subScreen.hide();
                        }}
                    />
    
                </View>
            );
        }
    }
} 

const styles = StyleSheet.create({
    header:{
        height:50,
        // borderBottomWidth: 0.5,
        // borderColor: '#00ECBC'
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
    },
    leftContainer : {
        width:"35%",
        backgroundColor:"#3A3A72",
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 0 },
        shadowOpacity: 0.2,
        elevation: 2,
    }
})
