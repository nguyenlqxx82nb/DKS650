import React from "react";
import { StyleSheet, Text,View, Animated} from "react-native";
import PropTypes from 'prop-types';
import IconRippe from '../Components/IconRippe.js'
import { Grid, Col } from "react-native-easy-grid";
import LinearGradient from 'react-native-linear-gradient';
import { EventRegister  } from 'react-native-event-listeners';
import GLOBALS from '../DataManagers/Globals'

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
        (this.props.onOpenOnline != null)
            this.props.onOpenOnline();
        EventRegister.emit("ShowOnlineScreen",{type:type, term:this._term})
    } 
    setTopValue=(value)=>{
        this.state.scrollY.setValue(value);
    }
    render = () => {
        var containerStyle = {};
        var buttonStyle = {};
        var onlContainer = {};
        if(GLOBALS.LANDSCAPE){
            containerStyle = {
                width:430,
            }

            buttonStyle = {
                borderRadius: 20,
                // marginRight: 5,
                // marginLeft:5
            }

            onlContainer = {
               // top:85
            }

        }
        return (
                <Animated.View style={[styles.onlineContainer,this.props.style,onlContainer,
                        {transform: [{ translateY: this.state.scrollY}]}]}>
                    <View style={[{flex:1,flexDirection:"row",justifyContent: 'center',alignItems: 'center',},containerStyle]}>
                            <View style={styles.container}>
                                <LinearGradient colors={['#FF2626', '#FF2626', '#FF2626']}
                                    style={[styles.onlineButton,buttonStyle]}>
                                    <IconRippe vector={true} name="youtube3" size={80} 
                                        onPress = {this._onOpenOnline.bind(this,GLOBALS.SONG_ONLINE.YOUTUBE)}
                                    />
                                </LinearGradient>
                            </View>
                            <View style={styles.container}>
                                <LinearGradient colors={['#F78B10', '#F78B10', '#F8570E']}
                                    style={[styles.onlineButton,buttonStyle]}>
                                    <IconRippe vector={true} name="soundcloud" size={120} 
                                        onPress = {this._onOpenOnline.bind(this,GLOBALS.SONG_ONLINE.SOUNDCLOUD)}
                                    />
                                </LinearGradient>
                            </View>
                            <View style={styles.container}>
                                <LinearGradient colors={['#3481D3', '#3481D3', '#3481D3']}
                                    style={[styles.onlineButton,buttonStyle]}>
                                    <IconRippe vector={true} name="mixcloud" size={110} 
                                        onPress = {this._onOpenOnline.bind(this,GLOBALS.SONG_ONLINE.MIXCLOUD)}
                                    />
                                </LinearGradient>
                            </View>
                    </View>
                </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        height:40,
        width:"33.33%",
    },
    
    onlineButton: {
        flex: 1,
        borderRadius: 5,
        //marginTop:3,
        marginRight: 3,
        marginLeft:3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },

    onlineContainer: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 85,
        zIndex: 2,
        marginLeft: 5,
        marginRight: 5,
    },

})
