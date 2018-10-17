import React from "react";
import { StyleSheet, View,Dimensions, TouchableWithoutFeedback,Platform,Animated} from "react-native";

import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals.js';
import {EventRegister} from 'react-native-event-listeners'
import Language from '../../DataManagers/Language';

const screen = {
    width : Dimensions.get("window").width,
    height : Dimensions.get("window").height
}

export default class SingerMenu extends React.Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);
    }

    filterSinger = (sex) =>{
        EventRegister.emit("FilterSinger",{sex:sex});
        this._close();
    }

    _close = () =>{
        setTimeout(()=>{
            if(this.props.onClose != null)
                this.props.onClose()
        },50);
    }
   
    render = () =>{
        var buttons = [
            {
                name : Language.Strings.all,
                type: GLOBALS.SINGER_SEX.ALL,
                icon : "all",
            },
            {
                name : Language.Strings.male,
                type: GLOBALS.SINGER_SEX.MALE,
                icon : "male",
            },
            {
                name : Language.Strings.female,
                type: GLOBALS.SINGER_SEX.FEMALE,
                icon : "famale",
            },
            {
                name : Language.Strings.band,
                type: GLOBALS.SINGER_SEX.band,
                icon : "nhomnhac",
            }
        ] ;
        if(GLOBALS.LANDSCAPE){
            return(
                <View style={[styles.innerContainer,{flexDirection:"row"}]}>
                    {buttons.map((button, index) => {
                        return(
                            <View key={index} style={{ height:"100%", width:170,}}>
                                <IconRippe name={button.icon} size = {90}
                                    text={{content: button.name, layout: 2}} 
                                    textStyle={[styles.textButton,{marginTop:5,marginLeft:0}]}
                                    onPress={this.filterSinger.bind(this,button.type)}
                                    />
                            </View>
                        );
                    })}
                </View>
                )
        }
        else{
            return(
                <View style={styles.innerContainer}>
                    {buttons.map((button, index) => {
                        return (
                            <View key = {index} style={{height:50,width:'100%'}}>
                                <IconRippe vector={true} name={button.icon} size={25} 
                                    text={{content: button.name, layout: 1}} 
                                    textStyle={[styles.textButton,styles.singerText]}
                                    onPress={this.filterSinger.bind(this,button.type)}
                                />
                            </View>
                        );
                    })}
                </View>
                )
        }
    }
}


const styles = StyleSheet.create({
    innerContainer :{
        marginTop:5,
        marginBottom:5,
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    textButton: {
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 16, 
        marginLeft: 15,
        color:"#fff"
    },
    singerText : {
        fontSize: 16,
        marginLeft:25
    }
})
