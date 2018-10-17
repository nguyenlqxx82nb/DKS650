import React from "react";
import { StyleSheet, Text,View, Animated} from "react-native";
import PropTypes from 'prop-types';
import IconRippe from '../Components/IconRippe.js'
import { Grid, Col ,Row} from "react-native-easy-grid";
import LinearGradient from 'react-native-linear-gradient';
import { EventRegister  } from 'react-native-event-listeners';
import GLOBALS from '../DataManagers/Globals'
import Utils from "../Utils/Utils.js";
import Language from "../DataManagers/Language.js";

export default class MusicOnlineButton extends React.Component {
    static propTypes = {
        style : Text.propTypes.style,
        onOpenOnline : PropTypes.func
    };
    constructor(props) {
        super(props);

        this._term = "";
        this.state={
            scrollY : new Animated.Value(0)
        }
    }
    setTerm = (term)=>{
        this._term = term;
    }  
    _onOpenOnline = (type) =>{
        const {onOpenOnline} =this.props;
        if(onOpenOnline != null)
            onOpenOnline();
        if(GLOBALS.SONG_ONLINE.YOUTUBE == type){
            EventRegister.emit("ShowOnlineScreen",{type:type, term:this._term})
        }
        else{
            EventRegister.emit("ShowToast",{message:Language.Strings.onlMessage,type:GLOBALS.TOAST_TYPE.WARNING})
        }
    } 
    setTopValue=(value)=>{
        this.state.scrollY.setValue(value);
    }
    render = () => {
        var containerStyle = {};
        var buttonStyle = {};
        var onlContainer = {};
        var icon_sizes1 = [80,120,110];
        if(GLOBALS.LANDSCAPE){
            var width = 430;
            var left = 0;
            var height = 45;
            var margin = 5;
            if(GLOBALS.LANDSCAPE_NORMAL){
                height = 50;
                width = 550;
                margin = 7;
                icon_sizes1 = [90, 135,135];
            }
            else if(GLOBALS.LANDSCAPE_LARGE){
                height = 55;
                width = 680;
                margin = 10;
                icon_sizes1 = [100, 170,170];
            }

            left = (Utils.Width() - width)/2;
            onlContainer = {
                width:width,
                left: left,
                height: height
            }

            buttonStyle = {
                borderRadius: (height-5)/2,
                marginRight:margin,
            }

            return (
                    <Animated.View style={[styles.onlineContainer,this.props.style,onlContainer,
                            {transform: [{ translateY: this.state.scrollY}]}]}>
                        <View style={[{flex:1,flexDirection:"row",justifyContent: 'center',alignItems: 'center',}]}>
                                <View style={styles.container1}>
                                    <LinearGradient colors={['#FF2626', '#FF2626', '#FF2626']}
                                        style={[styles.onlineButton,buttonStyle]}>
                                        <IconRippe vector={true} name="youtube3" size={icon_sizes1[0]} 
                                            onPress = {this._onOpenOnline.bind(this,GLOBALS.SONG_ONLINE.YOUTUBE)}
                                        />
                                    </LinearGradient>
                                </View>
                                <View style={styles.container1}>
                                    <LinearGradient colors={['#F78B10', '#F78B10', '#F8570E']}
                                        style={[styles.onlineButton,buttonStyle]}>
                                        <IconRippe vector={true} name="soundcloud" size={icon_sizes1[1]} 
                                            onPress = {this._onOpenOnline.bind(this,GLOBALS.SONG_ONLINE.SOUNDCLOUD)}
                                        />
                                    </LinearGradient>
                                </View>
                                <View style={styles.container1}>
                                    <LinearGradient colors={['#3481D3', '#3481D3', '#3481D3']}
                                        style={[styles.onlineButton,buttonStyle]}>
                                        <IconRippe vector={true} name="mixcloud" size={icon_sizes1[2]} 
                                            onPress = {this._onOpenOnline.bind(this,GLOBALS.SONG_ONLINE.MIXCLOUD)}
                                        />
                                    </LinearGradient>
                                </View>
                        </View>
                    </Animated.View>
            );
        }
        else{
            var icon_sizes = [60,105,105];
            if(GLOBALS.MOBILE_SMALL){
                icon_sizes = [60,90,90];
            }
            return (
                <Animated.View style={[styles.onlineContainer,this.props.style,onlContainer,
                        {transform: [{ translateY: this.state.scrollY}]}]}>
                    <View style={[{flex:1}]}>
                        <Grid>
                            <Row>
                                <Col>
                                    <LinearGradient colors={['#FF2626', '#FF2626', '#FF2626']}
                                        style={[styles.onlineButton]}>
                                        <IconRippe vector={true} name="youtube3" size={icon_sizes[0]} 
                                            onPress = {this._onOpenOnline.bind(this,GLOBALS.SONG_ONLINE.YOUTUBE)}
                                        />
                                    </LinearGradient>
                                </Col>
                                <Col>
                                    <LinearGradient colors={['#F78B10', '#F78B10', '#F8570E']}
                                        style={[styles.onlineButton]}>
                                        <IconRippe vector={true} name="soundcloud" size={icon_sizes[1]} 
                                            onPress = {this._onOpenOnline.bind(this,GLOBALS.SONG_ONLINE.SOUNDCLOUD)}
                                        />
                                    </LinearGradient>
                                </Col>
                                <Col>
                                    <LinearGradient colors={['#3481D3', '#3481D3', '#3481D3']}
                                        style={[styles.onlineButton]}>
                                        <IconRippe vector={true} name="mixcloud" size={icon_sizes[2]} 
                                            onPress = {this._onOpenOnline.bind(this,GLOBALS.SONG_ONLINE.MIXCLOUD)}
                                        />
                                    </LinearGradient>
                                </Col>
                            </Row>
                        </Grid>    
                            
                    </View>
                </Animated.View>
        );
        }
    }
}

const styles = StyleSheet.create({
    container : {
        height:40,
        width:"33.33%",
    },
    
    container1 : {
        height:"100%",
        width:"33.33%",
    },

    onlineButton: {
        flex: 1,
        borderRadius: 5,
        //marginTop:3,
        marginRight: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },

    onlineContainer: {
        width: '100%',
        height: 45,
        position: 'absolute',
        top: 85,
        zIndex: 2,
        paddingLeft: 10,
        paddingRight: 5,
    },

})
