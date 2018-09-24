import React from "react";
import { StyleSheet, View,Dimensions, TouchableWithoutFeedback,Platform,Animated} from "react-native";

import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals.js';
import {EventRegister} from 'react-native-event-listeners'

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
        return(
            <View style={styles.innerContainer}>
                <View style={{height:50,width:'100%'}}>
                    <IconRippe vector={true} name="all" size={25} 
                        text={{content: "Tất cả", layout: 1}} textStyle={[styles.textButton,styles.singerText]}
                        onPress={this.filterSinger.bind(this,GLOBALS.SINGER_SEX.ALL)}
                    />
                </View>
                <View style={{height:50,width:'100%'}}>
                    <IconRippe vector={true} name="male" size={25} 
                        text={{content: "Nam ca sỹ", layout: 1}} textStyle={[styles.textButton,styles.singerText]}
                        onPress={this.filterSinger.bind(this,GLOBALS.SINGER_SEX.MALE)}
                    />
                </View>
                <View style={{height:50,width:'100%'}}>
                    <IconRippe vector={true} name="famale" size={25} 
                        text={{content: "Nữ ca sỹ", layout: 1}} textStyle={[styles.textButton,styles.singerText]}
                        onPress={this.filterSinger.bind(this,GLOBALS.SINGER_SEX.FEMALE)}
                    />
                </View>
                <View style={{height:50,width:'100%'}}>
                    <IconRippe vector={true} name="nhomnhac" size={25} 
                        text={{content: "Nhóm nhạc", layout: 1}} textStyle={[styles.textButton,styles.singerText]}
                        onPress={this.filterSinger.bind(this,GLOBALS.SINGER_SEX.GROUP)}
                    />
                </View>
                {/* <View style={{height:50,width:'100%', backgroundColor:"#444083"}}>
                    <IconRippe vector={true} name={""}
                        text={{content: "Hủy", layout: 1}} textStyle={styles.textButton}
                    />
                </View> */}
        </View>);
    }
}


const styles = StyleSheet.create({
    
    textButton: {
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 16, 
        marginLeft: 15,
        color:"#fff"
    },
    singerText : {
        fontSize: 14,
        marginLeft:25
    },
    textEmoji:{
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 12, 
        marginTop: 2,
        color:"#fff"
    }
})
