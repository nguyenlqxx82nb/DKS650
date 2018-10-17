import React from "react";
import { StyleSheet, View, Text} from "react-native";
import BaseScreen from "../Screens/ScreenBase"
import PropTypes from 'prop-types';
import IconRippe from '../Components/IconRippe.js'
import GLOBALS from '../DataManagers/Globals.js';
import Header from '../Screens/Header/header3';
import {EventRegister} from 'react-native-event-listeners';
import Language from '../DataManagers/Language'

export default class Ngonngu extends React.Component {
    static propTypes = {
        onBack: PropTypes.func,
    };
    constructor(props) {
        super(props);
    }
    changeLanguage = (lan) =>{
        setTimeout(()=>{
            EventRegister.emit("ChangeLanguage",{lan:lan});
        },150)
        
    }
    render = () => {
        var iconSizes = [240,115,115,115,115];
        var container = {},textFlag={};
        if(GLOBALS.MOBILE_SMALL){
            for(var i=0; i< iconSizes.length; i++){
                iconSizes[i] = iconSizes[i]*0.75
            }

            container = {
                width:240*0.75,
                height:155*0.75,
            }

            textFlag = {
                fontSize:11
            }
        }
        if(!GLOBALS.LANDSCAPE){
            return (
                <View style={{flex:1}} >
                    <View style={{height:GLOBALS.HEADER_HEIGHT, width:"100%",justifyContent:"center",alignItems:"center"}}>
                        <Header 
                            onBack={()=>{this.props.onBack()}} 
                            style = {{height:GLOBALS.HEADER_HEIGHT}}
                            left = {<Text style={[GLOBALS.TITLE]}>
                                        {Language.Strings.ngon.toUpperCase()}
                                    </Text>}  />
                    </View>

                    <View style={{ flex: 1,backgroundColor:"transparent",justifyContent:"center",alignItems:"center"}}>
                        <View style={[styles.containerFlag,container]}>
                            <IconRippe vector={false} iconSource = {GLOBALS.FLAG.VN} 
                                    size = {iconSizes[0]}
                                    text={{content: Language.Strings.lan.vn.toLocaleUpperCase(), layout: 2}} 
                                    textStyle={[styles.textFlag,textFlag]} 
                                    onPress = {this.changeLanguage.bind(this,'vn')}/>
                        </View>
                        <View style={[styles.containerFlag,{flexDirection:"row",alignItems:"flex-start"},container]}>
                            <View style={[styles.containerFlag,{marginRight:5,width:iconSizes[1]}]}>
                                <IconRippe vector={false} 
                                        iconSource = {GLOBALS.FLAG.EN} size = {iconSizes[1]}
                                        text={{content: Language.Strings.lan.en.toUpperCase(), layout: 2}} 
                                        textStyle={[styles.textFlag,textFlag]}
                                        onPress = {this.changeLanguage.bind(this,'en')} />
                            </View>
                            <View style={[styles.containerFlag,{marginLeft:5,width:iconSizes[2]},container]}>
                                <IconRippe vector={false} iconSource = {GLOBALS.FLAG.CN} size = {iconSizes[2]}
                                        text={{content: Language.Strings.lan.cn.toUpperCase(), layout: 2}} 
                                        textStyle={[styles.textFlag,textFlag]}
                                        onPress = {this.changeLanguage.bind(this,'cn')} />
                            </View>
                        </View>
                        <View style={[styles.containerFlag,{flexDirection:"row",alignItems:"flex-start"},container]}>
                            <View style={[styles.containerFlag,{marginRight:5,width:iconSizes[3]}]}>
                                <IconRippe vector={false} iconSource = {GLOBALS.FLAG.JP} 
                                    size = {iconSizes[3]}
                                    text={{content: Language.Strings.lan.jp.toUpperCase(), layout: 2}} 
                                    textStyle={[styles.textFlag,textFlag]} 
                                    onPress = {this.changeLanguage.bind(this,'jp')} />
                            </View>
                            <View style={[styles.containerFlag,{marginLeft:5,width:iconSizes[4]},container]}>
                                <IconRippe vector={false} iconSource = {GLOBALS.FLAG.KR}
                                             size = {iconSizes[4]}
                                            text={{content: Language.Strings.lan.kr.toUpperCase(), layout: 2}} 
                                            textStyle={[styles.textFlag,textFlag]} 
                                            onPress = {this.changeLanguage.bind(this,'kr')} />
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
        else
        {
            iconSizes = [240,115,115,115,115];
            if(GLOBALS.LANDSCAPE_NORMAL){
                for(var i=0; i< iconSizes.length; i++){
                    iconSizes[i] = iconSizes[i]*1.3
                }
                container = {
                    width:240*1.3,
                    height:155*1.3,
                }
                textFlag = {
                    fontSize:14
                }
            }
            else if(GLOBALS.LANDSCAPE_LARGE){
                for(var i=0; i< iconSizes.length; i++){
                    iconSizes[i] = iconSizes[i]*1.5
                }
    
                container = {
                    width:240*1.5,
                    height:155*1.5,
                }
    
                textFlag = {
                    fontSize:15
                }
            }

            return (
                <View style={{flex:1,backgroundColor:"transparent"}} >
                    <View style={{height:GLOBALS.HEADER_HEIGHT, width:"100%",justifyContent:"center",alignItems:"center"}}>
                        <Header 
                                onBack={()=>{this.props.onBack()}} 
                                style = {{height:GLOBALS.HEADER_HEIGHT}}
                                left = {<Text style={[GLOBALS.TITLE]}>
                                            {Language.Strings.ngon.toUpperCase()}
                                        </Text>}  />
                    </View>
    
                    <View style={{ flex: 1,justifyContent:"center",alignItems:"center"}}>
                        <View style={[styles.containerFlag,container,{flexDirection:"row",alignItems:"flex-start"}]}>
                            <View style={[styles.containerFlag,container,{marginRight:5}]}>
                                <IconRippe vector={false} iconSource = {GLOBALS.FLAG.VN} 
                                        size = {iconSizes[0]}
                                        text={{content: Language.Strings.lan.vn.toLocaleUpperCase(), layout: 2}} 
                                        textStyle={[styles.textFlag,textFlag]}
                                        onPress = {this.changeLanguage.bind(this,'vn')} />
                            </View>
                            <View style={[styles.containerFlag,container,{marginLeft:5,width:iconSizes[1]}]}>
                                <IconRippe vector={false} 
                                        iconSource = {GLOBALS.FLAG.EN} 
                                        size = {iconSizes[1]}
                                        text={{content: Language.Strings.lan.en.toLocaleUpperCase(), layout: 2}}
                                         textStyle={[styles.textFlag,textFlag]} 
                                         onPress = {this.changeLanguage.bind(this,'en')}/>
                            </View>
                        </View>
                        <View style={[styles.containerFlag,container,{flexDirection:"row",alignItems:"flex-start"}]}>
                            <View style={[styles.containerFlag,container,{marginRight:5,width:iconSizes[2]}]}>
                                <IconRippe vector={false}
                                        iconSource = {GLOBALS.FLAG.CN} 
                                        size = {iconSizes[2]}
                                        text={{content: Language.Strings.lan.cn.toLocaleUpperCase(), layout: 2}} 
                                        textStyle={[styles.textFlag,textFlag]} 
                                        onPress = {this.changeLanguage.bind(this,'cn')}/>
                            </View>
                            <View style={[styles.containerFlag,container,{marginLeft:5,marginRight:5,width:iconSizes[3]}]}>
                                <IconRippe vector={false} iconSource = {GLOBALS.FLAG.JP} s
                                            size = {iconSizes[3]}
                                                text={{content: Language.Strings.lan.jp.toLocaleUpperCase(), layout: 2}} 
                                                textStyle={[styles.textFlag,textFlag]}
                                                onPress = {this.changeLanguage.bind(this,'jp')} />
                            </View>
                            <View style={[styles.containerFlag,container,{marginLeft:5,width:iconSizes[4]}]}>
                                <IconRippe vector={false} iconSource = {GLOBALS.FLAG.KR} 
                                            size = {iconSizes[4]}
                                                text={{content: Language.Strings.lan.kr.toLocaleUpperCase(), layout: 2}} 
                                                textStyle={[styles.textFlag,textFlag]}
                                                onPress = {this.changeLanguage.bind(this,'kr')} />
                            </View>
                            
                        </View>
                    </View>
                </View>
            );
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
        fontFamily:GLOBALS.FONT.REGULAR
    },
    textFlag: {
        fontFamily: GLOBALS.FONT.MEDIUM,
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
