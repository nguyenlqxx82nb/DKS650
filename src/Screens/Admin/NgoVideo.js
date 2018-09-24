import React from "react";
import {Text,StyleSheet,TextInput, View} from "react-native";
import InputAdmin from "./InputAdmin";
import ButtonAdmin from "./ButtonAdmin"; 
import GLOBALS from "../../DataManagers/Globals"
import { EventRegister } from 'react-native-event-listeners'
import IconRippe from '../../Components/IconRippe'
import CustomIcon from '../../Components/CustomIcon'

export default class NgoVideoScreen extends React.Component
{
    constructor(props) {
        super(props);
    }
    componentWillMount(){
        
    }
    componentWillUnmount(){
    }
    componentDidMount(){
        //this._text1.setText("taisao");
    }
    onPressButton = ()=>{
        
    }
    render() {
        return(
            <View style={{flex:1,margin:15,justifyContent:"flex-start",alignItems:"center"}} >
                <View style={{height:60,width:'100%',marginTop:5}}>
                    <IconRippe vector={true} name={""} 
                              text={{content:"1080i", layout: 1}} 
                              textStyle={styles.textButton}
                              onPress = {()=>{}}
                              />
                </View>
                <View style={{height:60,width:'100%',marginTop:5}}>
                    <IconRippe vector={true} name={""} 
                              text={{content:"AV", layout: 1}} 
                              textStyle={styles.textButton}
                              onPress = {()=>{}}
                              />
                    <CustomIcon name="mkDung" size={30} color="#00ECBC" style={{position:"absolute",left:80,top:15}} />
                </View>
                <View style={{height:60,width:'100%',marginTop:5}}>
                    <IconRippe vector={true} name={""} 
                              text={{content:"480p", layout: 1}} 
                              textStyle={styles.textButton}
                              onPress = {()=>{}}
                              />
                </View>
                <View style={{height:60,width:'100%',marginTop:5}}>
                    <IconRippe vector={true} name={""} 
                              text={{content:"1080p", layout: 1}} 
                              textStyle={styles.textButton}
                              onPress = {()=>{}}
                              />
                </View>
                <ButtonAdmin onPress={this.onPressButton} />

            </View>
        );
    }
} 

const styles = StyleSheet.create({
    textButton: {
        fontFamily: GLOBALS.FONT.BOLD,
        fontSize: 22, 
        color:"#fff"
    },
})
