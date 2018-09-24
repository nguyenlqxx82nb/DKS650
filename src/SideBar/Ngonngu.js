import React from "react";
import { StyleSheet, View } from "react-native";
import BaseScreen from "../Screens/ScreenBase"
import PropTypes from 'prop-types';
import IconRippe from '../Components/IconRippe.js'
import GLOBALS from '../DataManagers/Globals.js';
import Header from '../Screens/Header/header1';

export default class Ngonngu extends React.Component {
    static propTypes = {
        onBack: PropTypes.func,
    };
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <View style={{flex:1}} >
                <Header title={"Ngôn ngữ"} onBack={()=>{this.props.onBack()}} />

                <View style={{ flex: 1,backgroundColor:"transparent",justifyContent:"center",alignItems:"center"}}>
                    <View style={[styles.containerFlag]}>
                        <IconRippe vector={false} iconSource = {GLOBALS.FLAG.VN} 
                                size = {240}
                                text={{content: "TIẾNG VIỆT", layout: 2}} textStyle={styles.textFlag} />
                    </View>
                    <View style={[styles.containerFlag,{flexDirection:"row",alignItems:"flex-start"}]}>
                        <View style={[styles.containerFlag,{marginRight:5,width:115}]}>
                            <IconRippe vector={false} iconSource = {GLOBALS.FLAG.EN} size = {115}
                                    text={{content: "TIẾNG ANH", layout: 2}} textStyle={styles.textFlag} />
                        </View>
                        <View style={[styles.containerFlag,{marginLeft:5,width:115}]}>
                            <IconRippe vector={false} iconSource = {GLOBALS.FLAG.CN} size = {115}
                                    text={{content: "TIẾNG TRUNG", layout: 2}} textStyle={styles.textFlag} />
                        </View>
                    </View>
                    <View style={[styles.containerFlag,{flexDirection:"row",alignItems:"flex-start"}]}>
                        <View style={[styles.containerFlag,{marginRight:5,width:115}]}>
                            <IconRippe vector={false} iconSource = {GLOBALS.FLAG.JP} size = {115}
                                            text={{content: "TIẾNG NHẬT", layout: 2}} textStyle={styles.textFlag} />
                        </View>
                        <View style={[styles.containerFlag,{marginLeft:5,width:115}]}>
                            <IconRippe vector={false} iconSource = {GLOBALS.FLAG.KR} size = {115}
                                            text={{content: "TIẾNG HÀN", layout: 2}} textStyle={styles.textFlag} />
                        </View>
                    </View>
                </View>
            </View>
        );
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
        fontFamily:'SF-Pro-Text-Regular'
    },
    textFlag: {
        fontFamily: "SF-Pro-Text-Regular",
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
