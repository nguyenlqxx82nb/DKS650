import React from "react";
import { StyleSheet, View,TouchableWithoutFeedback,Platform,Animated} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals.js';
import Emoji from "./Emoji";
import SingerMenu from "./SingerMenu";
import SongMenu from "./SongMenu";
import Volume from './Volume';
import Utils from "../../Utils/Utils";
import {EventRegister} from 'react-native-event-listeners';

export default class OptionOverlay extends React.Component {
    static propTypes = {
        //number: PropTypes.number.isRequired,
        //color: PropTypes.string.isRequired,
        onClose: PropTypes.func,
        //duration : PropTypes.number
    };
    overlayType = GLOBALS.SING_OVERLAY.NONE;
    _index  = 0;
    constructor(props) {
        super(props);
        this._isVisible = false;
        this._data = {};
        this.state = {
            opacityValue : new Animated.Value(0),
            yPos : new Animated.Value(240),
            scaleX : new Animated.Value(0),
            scaleY : new Animated.Value(0),
            opacity2 : new Animated.Value(0.75),
        }
    }
    getIndex = ()=>{
        return this._index;
    }
    setIndex = (index) =>{
        this._index = index;
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
                        buttons = {this._data.buttons}
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
                    />; }
        else if(this.overlayType == GLOBALS.SING_OVERLAY.VOLUME){
            return <Volume />;
        }
    }
    show = () => {
        const {maxZindex} = this.props;
        this._isVisible = true;
        var that = this;
        this._container.setNativeProps({
            style: {
                zIndex: maxZindex,
                width: Utils.Width()
            }
        });
        if(this.overlayType == GLOBALS.SING_OVERLAY.VOLUME){
            this.state.scaleX.setValue(0.75);
            this.state.scaleY.setValue(0.75);
            this.state.opacity2.setValue(0.75);
            Animated.parallel([
                Animated.timing(this.state.opacityValue, {
                    toValue: 0.75,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 350,
                }),
                Animated.timing(this.state.scaleX, {
                    toValue: 1,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 100,
                }),
                Animated.timing(this.state.scaleY, {
                    toValue: 1,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 100,
                }),
            ]).start(function onComplete() {
                that._showComplete();
            });
        }
        else{
            this.state.scaleX.setValue(1);
            this.state.scaleY.setValue(1);
            this.state.yPos.setValue(60);
            this.state.opacity2.setValue(0.75);
            if(this.overlayType != GLOBALS.SING_OVERLAY.KEYBROARD){
                Animated.parallel([
                    Animated.timing(this.state.opacityValue, {
                        toValue: 0.75,
                        useNativeDriver: Platform.OS === 'android',
                        duration: 200,
                    }),
                    Animated.timing(this.state.yPos, {
                        toValue: 0,
                        useNativeDriver: Platform.OS === 'android',
                        duration: 100,
                    }),
                ]).start(function onComplete() {
                    that._showComplete();
                });
            }
            else{
                this.state.opacityValue.setValue(0.75);
                that._showComplete();
            }
        }
    }

    _showComplete = ()=>{
        EventRegister.emit("ShowScreen",{obj:this});
    }

    hide = () => {
        const {maxZindex,onClose} = this.props;
        let container = this._container;
        this._isVisible = false;
        var that = this;
        if(this.overlayType == GLOBALS.SING_OVERLAY.VOLUME){
            Animated.parallel([
                Animated.timing(this.state.opacityValue, {
                    toValue: 0,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 350,
                }),
                Animated.timing(this.state.scaleX, {
                    toValue: 0.5,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 150,
                }),
                Animated.timing(this.state.scaleY, {
                    toValue: 0,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 150,
                }),
                Animated.timing(this.state.opacity2, {
                    toValue: 0,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 150,
                }),
            ]).start(function onComplete() {
                container.setNativeProps({
                    style: {
                        zIndex: 0,
                        width:0
                    }
                });
                that.state.scaleX.setValue(0);
                that.state.scaleY.setValue(0);
                that.state.opacity2.setValue(0);
                that._hideCompleted();
            });
        }
        else{
            
            Animated.parallel([
                Animated.timing(this.state.opacityValue, {
                    toValue: 0,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 200,
                }),
                Animated.timing(this.state.yPos, {
                    toValue: 50,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 100,
                }),
                Animated.timing(this.state.opacity2, {
                    toValue: 0,
                    useNativeDriver: Platform.OS === 'android',
                    duration: 100,
                }),
            ]).start(function onComplete() {
                container.setNativeProps({
                    style: {
                        zIndex: 0,
                        width:0
                    }
                });
                that.state.scaleX.setValue(0);
                that.state.scaleY.setValue(0);
                that.state.opacity2.setValue(0);
                that._hideCompleted();
            });
        }
        
        if(onClose != null){
            onClose();
        }
    }
    _hideCompleted = () =>{
        EventRegister.emit("HideScreen",{obj:this});
    }
    render = () => {
        var screenHeight = Utils.Height() - GLOBALS.STATUS_BAR_HEIGHT ;
        var top = {};
        const {opacityValue,yPos,scaleX,scaleY,opacity2} = this.state;

        if(this.overlayType == GLOBALS.SING_OVERLAY.KEYBROARD){
            top = {top:GLOBALS.HEADER_HEIGHT} ;
            //this.state.opacityValue.setValue(0.5);
            this._data.height = 0;
        }
        var _posY = (this.overlayType == GLOBALS.SING_OVERLAY.VOLUME)?new Animated.Value(0):yPos;
        var bottom = (this.overlayType == GLOBALS.SING_OVERLAY.VOLUME)?(screenHeight + GLOBALS.FOOTER_HEIGHT -this._data.height)/2:GLOBALS.FOOTER_HEIGHT;
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
                                {height:this._data.height,bottom:bottom, 
                                opacity:opacity2,
                                transform:[{
                                    translateY: _posY
                                },
                                {scaleX : scaleX},
                                {scaleY : scaleY}]
                            }]}>
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
