import React from "react";
import { StyleSheet, Text ,View, Platform} from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import LinearGradient from 'react-native-linear-gradient';
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister  } from 'react-native-event-listeners';
import Header from '../Header/header1';

export default class OnlineScreen extends BaseScreen {
    static propTypes = {
        onBack: PropTypes.func,
    };
    constructor(props) {
        super(props);
    }
    
    _onBack = () => {
        const { onBack } = this.props;
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () =>{
        //this._songTabs.loadData(this._searchInput.getValue(),this._sex);
    }
    _onSearch =(value)=> {
        //this._songTabs.searchData(value,this._sex);
    }
    _showOptOverlay = () =>{
       // EventRegister.emit('ShowOptOverlay', {id:-1,overlayType:GLOBALS.SING_OVERLAY.SINGER});
    }
    _openTheloaiSong = (type,name) =>{
        this.theloaiSong.updateType(type,name);
        this.theloaiSong.show();
    }
    renderContentView = () => {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title = {"NHẠC ONLINE"}
                    onBack = {this._onBack}
                />
                {this.renderContent()}
            </View> 
        );
    }

    renderContent = () => {
        if(!GLOBALS.LANDSCAPE)
            return (
                <View style={{ flex: 1,margin:5,backgroundColor:"transparent", justifyContent:"center",alignItems:"center"}}>
                    <View style={styles.onlineContainer}>
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FF6565', '#FF4242', '#FF2C2C', '#FF0404']} style={[styles.button]}>
                            <IconRippe vector={true} name="youtube3" size={180}
                                onPress = {()=>{
                                    EventRegister.emit("ShowOnlineScreen",{type:GLOBALS.SONG_ONLINE.YOUTUBE});
                                }}
                            />
                        </LinearGradient>
                    </View>
                    <View style={styles.onlineContainer}>
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFB223', '#FF9E1D', '#FF8315', '#FF4903']} style={[styles.button]}>
                            <IconRippe vector={true} name="soundcloud" size={190} 
                                onPress = {()=>{
                                    EventRegister.emit("ShowOnlineScreen",{type:GLOBALS.SONG_ONLINE.SOUNDCLOUD});
                                }}
                            />
                        </LinearGradient>
                    </View>
                    <View style={styles.onlineContainer}>
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#69A5E5', '#5D9CE1', '#4B90DB', '#3783D4']} style={[styles.button]}>
                            <IconRippe vector={true} name="mixcloud" size={190} 
                                onPress = {()=>{
                                    EventRegister.emit("ShowOnlineScreen",{type:GLOBALS.SONG_ONLINE.MIXCLOUD});
                                }}
                            />
                        </LinearGradient>
                    </View>
                </View>
            );
    else
        return (
            <View style={{ flex: 1,margin:5,backgroundColor:"transparent", justifyContent:"center",alignItems:"center", flexDirection:"row"}}>
                <View style={styles.onlineContainer1}>
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FF6565', '#FF4242', '#FF2C2C', '#FF0404']} style={[styles.button]}>
                        <IconRippe vector={true} name="youtube3" size={190}
                            onPress = {()=>{
                                EventRegister.emit("ShowOnlineScreen",{type:GLOBALS.SONG_ONLINE.YOUTUBE});
                            }}
                        />
                    </LinearGradient>
                </View>
                <View style={styles.onlineContainer1}>
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFB223', '#FF9E1D', '#FF8315', '#FF4903']} style={[styles.button]}>
                        <IconRippe vector={true} name="soundcloud" size={200} 
                            onPress = {()=>{
                                EventRegister.emit("ShowOnlineScreen",{type:GLOBALS.SONG_ONLINE.SOUNDCLOUD});
                            }}
                        />
                    </LinearGradient>
                </View>
                <View style={styles.onlineContainer1}>
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#69A5E5', '#5D9CE1', '#4B90DB', '#3783D4']} style={[styles.button]}>
                        <IconRippe vector={true} name="mixcloud" size={200} 
                            onPress = {()=>{
                                EventRegister.emit("ShowOnlineScreen",{type:GLOBALS.SONG_ONLINE.MIXCLOUD});
                            }}
                        />
                    </LinearGradient>
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
        height: 50
    },
    button :{
        margin:0,
        flex: 1,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },

    title: {
        fontSize: 20,
        fontWeight: '300',
        paddingLeft:10,
      //  marginLeft:5,
        color:"#fff",
       // flex:1,
        fontFamily:GLOBALS.FONT.BOLD
    },
    onlineContainer :{
        width:240,
        height:90,
         marginBottom:40
    },

    onlineContainer1 :{
        width:210,
        height:150,
        marginLeft:20
    }

})
