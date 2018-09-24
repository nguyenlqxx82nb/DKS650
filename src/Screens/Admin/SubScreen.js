import React from "react";
import {StyleSheet,View,List} from "react-native";
import BaseScreen from '../ScreenBase';
import Header from '../Header/header1';
import GLOBALS from "../../DataManagers/Globals";
import { EventRegister } from 'react-native-event-listeners'

export default class SubScreen extends BaseScreen
{
    _title = ""
    _element = <View />
    constructor(props) {
        super(props);
    }
    setContent=(title,element)=>{
        this._title = title;
        this._element = element;

        this.setState({});
    }
    renderContentView = () => {
        return(
            <View style={{flex:1}} >
                <Header 
                    style={styles.header}
                    title={this._title}
                    onBack={()=>{
                        EventRegister.emit("SubAdminBack",{});
                        this.hide();
                }} />

                <View style={{flex:1}}>
                    {this._element}
                </View>

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
