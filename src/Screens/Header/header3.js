import React from "react";
import { View,StyleSheet, Text, Animated} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals';
import {EventRegister} from 'react-native-event-listeners';

export default class Header extends React.Component {
    static propTypes = {
        onBack: PropTypes.func,
        style : Text.propTypes.style,
        back : PropTypes.bool
    };
    static defaultProps = {
        style : {},
        back : true
    };
    constructor(props) {
        super(props);
    }
    _onEmojiPress = () => {
        EventRegister.emit('ShowOptOverlay', 
            {   overlayType:GLOBALS.SING_OVERLAY.EMOJI,
                data:{height:180}
            });
    }
    _onVolume = () => {
        EventRegister.emit('ShowOptOverlay', 
            {   overlayType:GLOBALS.SING_OVERLAY.VOLUME,
                data:{height:60}
            });
    }
    render() {
        const {title,back} = this.props;
        var titleSytle = {};
        if(GLOBALS.MOBILE_SMALL)
            titleSytle = {
                fontSize: 18,
            };
        return (
            <View style={[styles.container,this.props.style]}>
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    {this.props.center != null && this.props.center}
                </View>
                {back && <View style={{ width: 40, height: 40, marginLeft: 0 }}>
                        <IconRippe vector={true} name="back" size={20} color="#fff"
                            onPress={()=>{
                                if(this.props.onBack != null){
                                    //this._searchInput.blur();
                                    this.props.onBack();
                                }
                            }}
                        />
                    </View>}
                    {this.props.left != null && this.props.left}
                <View
                    ref = {ref =>(this._centerView = ref)}
                    style={{flex:1}}>
                        
                </View>
                
                {!GLOBALS.LANDSCAPE && 
                    <View style={{ width: 40, height: 40}}>
                        <IconRippe vector={true} name="emoji" size={20} color="#fff"
                            onPress={()=>{
                                this._onEmojiPress();
                            }}
                        />
                    </View> }
                
                {!GLOBALS.LANDSCAPE &&
                    <View style={{ width: 40, height: 40}}>
                        <IconRippe vector={true} name="volumnOn" size={20} color="#fff"
                            onPress={()=>{
                                this._onVolume();
                            }}
                        />
                    </View>
                }
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems:"center",
        flex:1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        elevation: 5,
        backgroundColor :GLOBALS.COLORS.HEADER,
    },
    title: {
        fontSize: 20,
        fontWeight: '300',
        //paddingLeft:20,
        marginLeft:10,
        color:"#fff",
       // flex:1,
        fontFamily:GLOBALS.FONT.BOLD
    },
   
})
