import React from "react";
import {StyleSheet,View,List,Text} from "react-native";
import BaseScreen from '../ScreenBase';
import Header from '../Header/header1';
import GLOBALS from "../../DataManagers/Globals";
import { EventRegister } from 'react-native-event-listeners'

export default class SubScreen extends BaseScreen
{
    _title = ""
    _element = <View />
    _isFull = false;
    
    constructor(props) {
        super(props);
    }
    setContent=(title,element,isFull = false)=>{
        this._title = title;
        this._element = element;
        this._isFull = isFull;
        //console.warn("_title = "+this._title);
        this.setState({});
    }
    renderContentView = () => {
        if(GLOBALS.LANDSCAPE){
            return(
                <View style={{flex:1}} >
                    <Header 
                        style={styles.header}
                        title={this._title}
                        back = {false}
                    />
                    {this.renderContent()}
                </View>
            );
        }
        else{
            return(
                <View style={{flex:1}} >
                    <Header 
                        style={[styles.header,{height:50} ]}
                        title={this._title}
                        onBack={()=>{
                            if(this.props.onBack != null)
                                this.props.onBack();
                        }}
                    />
                    {this.renderContent()}
                </View>
            );
        }
        
    }
    renderContent = () =>{
        var style = {};
        if(GLOBALS.LANDSCAPE){
            style.width = 400;
            style.height = "100%";
            // style.justifyContent = "center";
            // style.alignContent="center";
        }

        if(this._isFull)
            return(
                <View style={{flex:1}}>
                    {this._element}
                </View>
            );
        else{
            return(
                <View style={{flex:1, alignItems:"center",justifyContent:"center"}}>
                    <View style = {style}>
                        {this._element}
                    </View>
                </View>
            );
        }

    }
} 

const styles = StyleSheet.create({
    header:{
        height:50,
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
