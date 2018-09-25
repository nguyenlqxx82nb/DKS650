import React from "react";
import { StyleSheet, View, Animated, Platform,Easing } from "react-native";
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import GLOBALS from '../DataManagers/Globals.js';
import Utils from '../Utils/Utils';

class BaseScreen extends React.Component {
    static propTypes = {
        duration: PropTypes.number,
        opacity: PropTypes.number,
        maxZindex: PropTypes.number,
        posX : PropTypes.number,
        posY : PropTypes.number,
        transition : PropTypes.number,
        bottom :  PropTypes.number,
        type: PropTypes.number
    };
     
    static defaultProps = {
        duration: 250,
        opacity: 1,
        maxZindex: 1,
        posX : Utils.Width(),
        posY : Utils.Height(),
        transition : GLOBALS.TRANSITION.FADE,
        bottom : 115,
        type : GLOBALS.SCREEN_TYPE.BOTTOM
    };
    _songTabs = null;
    MAX_SCROLL_HEIGHT = 130;
    _offsetY = 0;
    _headerTopY = 0;

    constructor(props) {
        super(props);

        const {transition} = this.props;
        var opacity = (transition == GLOBALS.TRANSITION.FADE)?this.props.opacity:1;
        var posX = (transition == GLOBALS.TRANSITION.SLIDE_LEFT)?this.props.posX:0;
        var posY = (transition == GLOBALS.TRANSITION.SLIDE_TOP)?this.props.posY:0;

        this.animate = {
            opacity: new Animated.Value(opacity),
            posX : new Animated.Value(posX),
            posY : new Animated.Value(posY),
        };

        this._isVisible = false;
        this._processing = false;
        this._maxIndex = this.props.maxZindex;

        this._scrollY = new Animated.Value(0);
    }
    show = () => {
        if(this._processing)
            return;
        if(this._isVisible){
            this.hide();
            return;
        }
        this._processing = true;

        let container = this._container;
        const {maxZindex,transition,duration} = this.props;
        var that = this;
        var zindex = Math.min(this._maxIndex,maxZindex);
        this._isVisible = true;
        
        if(transition == GLOBALS.TRANSITION.FADE){
            Animated.timing(this.animate.opacity, {
                toValue: 1,
                useNativeDriver: Platform.OS === 'android',
                duration: duration,
                easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }).start(function onComplete() {
                container.setNativeProps({
                    style: {
                        zIndex: zindex
                    }
                });
    
                that.showCompleted();
            });
        }
        else if(transition == GLOBALS.TRANSITION.SLIDE_LEFT){
            container.setNativeProps({
                style: Utils.zIndexWorkaround(zindex)
            });
            //console.warn("show = "+zindex);
            Animated.timing(this.animate.posX, {
                toValue: 0,
                useNativeDriver: Platform.OS === 'android',
                duration: duration,
                easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }).start(function onComplete() {
                that.showCompleted();
            });
        }
        else if(transition == GLOBALS.TRANSITION.SLIDE_TOP){
            container.setNativeProps({
                style: {
                    zIndex: zindex
                }
            });
            Animated.timing(this.animate.posY, {
                toValue: 0,
                useNativeDriver: Platform.OS === 'android',
                duration: duration,
                easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }).start(function onComplete() {
                that.showCompleted();
            });
        }
    }
    hide = (callback) => {
       // console.warn("hide = "+this._processing +" , "+this._isVisible);
        if(this._processing)
            return;

        if(!this._isVisible){
            this.show();
            return;
        }
        this._processing = true;

        let container = this._container;
        const {maxZindex,transition,duration} = this.props;
        var that = this;
        this._isVisible = false;
        if(transition == GLOBALS.TRANSITION.FADE){
            Animated.timing(this.animate.opacity, {
                toValue: 0,
                useNativeDriver: Platform.OS === 'android',
                duration: duration,
                easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }).start(function onComplete() {
                container.setNativeProps({
                    style: {
                        zIndex: 0
                    }
                });
    
                that.hideCompleted();
                if(callback != null)
                    callback();
            });
        }
        else if(transition == GLOBALS.TRANSITION.SLIDE_LEFT){
            container.setNativeProps({
                style: Utils.zIndexWorkaround(0)
            });

            Animated.timing(this.animate.posX, {
                toValue: Utils.Width(),
                useNativeDriver: Platform.OS === 'android',
                duration: duration,
                easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }).start(function onComplete() {
                that.hideCompleted();
               
                if(callback != null)
                    callback();
            });
        }
        else if(transition == GLOBALS.TRANSITION.SLIDE_TOP){
            Animated.timing(this.animate.posY, {
                toValue: Utils.Height(),
                useNativeDriver: Platform.OS === 'android',
                duration: duration,
                easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }).start(function onComplete() {
                that.hideCompleted();
                if(callback != null)
                    callback();
                container.setNativeProps({
                    style: {
                        zIndex: 0
                    }
                });
            });
        }
    }

    showCompleted = () =>{
        this._processing = false;
        this._showCompleted();
    }
    _showCompleted = () =>{}
    hideCompleted = () =>{
        this._processing = false;
        this._hideCompleted();
    }
    _hideCompleted = () =>{}

    _handleListViewScroll = (offsetY) => {
        //console.warn("offset = "+offset);
        if(offsetY > this.MAX_SCROLL_HEIGHT){
            if(this._offsetY <= offsetY){
                if(this._headerTopY > -this.MAX_SCROLL_HEIGHT){
                    var delta = offsetY - this._offsetY;
                    this._headerTopY = Math.max(this._headerTopY - delta,-this.MAX_SCROLL_HEIGHT);
                    this._headerTopY = (this._headerTopY > 0)?0:this._headerTopY;

                    this._scrollY.setValue(this._headerTopY);
                    
                    this.scrollExtendComponent(-this.MAX_SCROLL_HEIGHT);
                }
            }
            else{
                if(this._headerTopY < 0){
                    this._headerTopY = 0;
                    Animated.timing(this._scrollY,{toValue:0,duration:250}).start();
                }
            }
        }
        else{
            if(this._offsetY > this.MAX_SCROLL_HEIGHT){
                var delta = offsetY - this._offsetY;
                this._headerTopY = Math.max(this._headerTopY - delta,-this.MAX_SCROLL_HEIGHT);
            }
            else{
                this._headerTopY =  Math.max(-offsetY,-this.MAX_SCROLL_HEIGHT);
            }

            //this._headerTopY = (this._headerTopY > 0)?0:this._headerTopY;
            this._headerTopY = Math.min(-offsetY,this._headerTopY);

            this._scrollY.setValue(this._headerTopY);
            this.scrollExtendComponent(this._headerTopY);
        }

        this._offsetY = offsetY;
    }

    scrollExtendComponent = (top) =>{

    }

    renderContentView = () => {
        return (<View></View>);
    }

    render() {
        const {opacity,posX,posY} = this.animate;
        const { bottom,type , maxZindex} = this.props;
        var style = {};
        // if(type == GLOBALS.SCREEN_TYPE.BOTTOM){
        //     style.top = 0;
        // }
        // else{
        //     style.top = 0;
        // }
        style.top = 0;
        style.height = Utils.Height() - GLOBALS.STATUS_BAR_HEIGHT;
        return (
            <Animated.View
                ref={ref => (this._container = ref)}
                style={[styles.container,style,{zIndex:maxZindex, opacity : opacity,transform: [{translateY: posY},{translateX:posX}]}]}>
                
                <LinearGradient 
                    start={{x: 0.1, y: 0.1}} end={{x: 1, y: 1}} 
                    colors={['#444284', '#434B8C', '#445D9D', '#436BA8', '#2C87A2', '#1F98A1', '#05BA9B']} 
                    style={{flex:1, width:'100%'}}>
                    <View style={{flex:1, marginBottom:bottom, width:'100%'}}>
                        {this.renderContentView()}
                    </View>
                </LinearGradient>
                
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        position:"absolute",
        width: Utils.Width()
    }
})

export default BaseScreen;
