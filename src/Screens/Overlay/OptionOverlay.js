import React from "react";
import { StyleSheet, View,TouchableWithoutFeedback,Platform,Animated} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals.js';
import Emoji from "./Emoji";
import SingerMenu from "./SingerMenu";
import SongMenu from "./SongMenu";
import Utils from "../../Utils/Utils";

export default class OptionOverlay extends React.Component {
    static propTypes = {
        //number: PropTypes.number.isRequired,
        //color: PropTypes.string.isRequired,
        onClose: PropTypes.func,
        //duration : PropTypes.number
    };

    overlayType = GLOBALS.SING_OVERLAY.NONE;
    constructor(props) {
        super(props);
        this._isVisible = false;
        this._data = {};
        this.state = {
            opacityValue : new Animated.Value(0),
            yPos : new Animated.Value(240),
        }
    }
    _onClose =() => {
        if(!this._isVisible)
            return;

        if(this.overlayType == GLOBALS.SING_OVERLAY.KEYBROARD){
            this._data.input.blur();
        }
        this.hide();
    }
    updateView = (type,data) => {
        this._data = data
        this.overlayType = type;
        this.setState({});
    }
    renderView = () =>{
        //console.warn("overlayType =  "+this.state.overlayType);
        if(this.overlayType == GLOBALS.SING_OVERLAY.NONE){
            return(<View></View>);
        }
        else if(this.overlayType == GLOBALS.SING_OVERLAY.KEYBROARD){
            return(<View></View>);
        }
        else if(this.overlayType == GLOBALS.SING_OVERLAY.NORMAL){
            return <SongMenu 
                        songId={this._data.songId} 
                        actor={this._data.actor} 
                        onClose= {this._onClose}
                        menuType = {this._data.menuType}
                        />;
        }
        else if(this.overlayType == GLOBALS.SING_OVERLAY.EMOJI){
            return <Emoji 
                        onClose= {this._onClose}
                    />;
        }
        else if(this.overlayType == GLOBALS.SING_OVERLAY.SINGER){
            return <SingerMenu 
                        onClose= {this._onClose}
                    />;
        }
    }
    show = () => {
        const {maxZindex} = this.props;
        this._isVisible = true;
        this._container.setNativeProps({
            style: {
                zIndex: maxZindex,
                width: Utils.Width()
            }
        });
        if(this.overlayType != GLOBALS.SING_OVERLAY.KEYBROARD){
            Animated.parallel([
                Animated.timing(this.state.opacityValue, {
                    toValue: 0.6,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 500,
                }),
                Animated.timing(this.state.yPos, {
                    toValue: 0,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 250,
                }),
            ]).start(function onComplete() {
                //this.setState({});
            });
        }
        else{
            this.state.opacityValue.setValue(0.5);
        }
    }
    hide = () => {
        const {maxZindex,onClose} = this.props;
        let container = this._container;
        Animated.parallel([
            Animated.timing(this.state.opacityValue, {
                toValue: 0,
                useNativeDriver: Platform.OS === 'android',
                duration: 500,
            }),
            Animated.timing(this.state.yPos, {
                toValue: 240,
                useNativeDriver: Platform.OS === 'android',
                duration: 250,
            }),
        ]).start(function onComplete() {
            container.setNativeProps({
                style: {
                    zIndex: 0,
                    width:0
                }
            });
        });
        
        if(onClose != null){
            onClose();
        }

        this._isVisible = false;
    }
    render = () => {
        var screenHeight = Utils.Height() - GLOBALS.STATUS_BAR_HEIGHT ;
        var top = {};
        if(this.overlayType == GLOBALS.SING_OVERLAY.KEYBROARD){
            top = {top:40} ;
            //this.state.opacityValue.setValue(0.5);
            this._data.height = 0;
        }
        const {opacityValue,yPos} = this.state;

        return (
            <View style={[{position:"absolute",
                            width: 0,
                            top:0,
                            height: screenHeight,
                            opacity:1,zIndex:0 },top]}
                ref={ref => (this._container = ref)}>

                <TouchableWithoutFeedback  style={styles.overlayContainer} 
                    onPress={this._onClose} >
                    <Animated.View 
                        ref={ref => (this._overlay = ref)}
                        style={{opacity:opacityValue,flex:1, backgroundColor: "#000"}} />
                </TouchableWithoutFeedback>
                
                <Animated.View  ref={ref => (this._panel = ref)}
                        style={[styles.container,
                                {height:this._data.height,bottom:GLOBALS.FOOTER_HEIGHT, transform:[{translateY: yPos}]}]}>
                        {this.renderView()}
                        {/* <View style={{height:50,width:'100%', backgroundColor:"#444083"}}>
                            <IconRippe vector={true} name={""}
                                text={{content: "Hủy", layout: 1}} textStyle={styles.text}
                                onPress = {this._onClose}
                            />
                        </View> */}
                </Animated.View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    innerContainer :{
        flex: 1,
        width:"100%"
    },
    overlayContainer: {
        position:"absolute",
        width: Utils.Width(),
        top:0,
        height: Utils.Height() - GLOBALS.STATUS_BAR_HEIGHT, 
        //opacity:0.6
    },
    container: {
        position:"absolute",
        width:Utils.Width(),
        bottom:0,
        height:240,
        backgroundColor:"#323663",
        opacity:0.85
    },
    text: {
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 16, 
        color:"#fff"
    },
    
})
