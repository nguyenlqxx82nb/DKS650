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
        sizeX : PropTypes.number,
        sizeY : PropTypes.number,
        transition : PropTypes.number,
        bottom :  PropTypes.number,
        type: PropTypes.number,
        preLoad : PropTypes.bool,
        startTrans : PropTypes.number,
        searchHolder : PropTypes.string,
        forceLoad : PropTypes.bool,
    };
     
    static defaultProps = {
        duration: 150,
        opacity: 1,
        maxZindex: 1,
        sizeX : Utils.Width(),
        sizeY : Utils.Height(),
        transition : GLOBALS.TRANSITION.FADE,
        type : GLOBALS.SCREEN_TYPE.BOTTOM,
        preLoad : true,
        startTrans : 100,
        searchHolder : "",
        forceLoad : true,
    };
    _songTabs = null;
    MAX_SCROLL_HEIGHT = 135;
    _offsetY = 0;
    _headerTopY = 0;
    _allowLoad = false;
    _bottom = 0;
    constructor(props) {
        super(props);

        const {transition} = this.props;
        var opacity = (transition == GLOBALS.TRANSITION.FADE)?this.props.opacity:1;
        var posX = (transition == GLOBALS.TRANSITION.SLIDE_LEFT)?this.props.sizeX:0;
        var posY = (transition == GLOBALS.TRANSITION.SLIDE_TOP)?this.props.sizeY:0;

        this.animate = {
            opacity: new Animated.Value(opacity),
            posX : new Animated.Value(posX),
            posY : new Animated.Value(posY),
        };

        this._isVisible = false;//(this.props.preLoad)?false:true;
        this._processing = false;
        this._maxIndex = this.props.maxZindex;

        this._scrollY = new Animated.Value(0);

        this._bottom = (this.props.bottom == null)? GLOBALS.FOOTER_HEIGHT:this.props.bottom;
    }
    setVisible = (isVisible) =>{
        this._isVisible = isVisible;
    }
    show = () => {
        if(this._processing)
            return;
        if(this._isVisible){
            this.hide();
            return;
        }
        
        if(this.props.preLoad && !this._allowLoad){
            setTimeout(()=>{
                this._allowLoad = true;
                this.setState({});
            },5);
            this._show();
        }
        else{
            this._show();
        }
    }
    _show = ()=>{
        this._processing = true;

        let container = this._container;
        const {maxZindex,transition,duration,startTrans} = this.props;
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
            this.animate.posX.setValue(100);
            this.animate.opacity.setValue(0.3);
            Animated.parallel([
                Animated.timing(this.animate.posX, {
                    toValue: 0,
                    useNativeDriver: Platform.OS === 'android',
                    duration: duration,
                    easing: Easing.bezier(0.0, 0.0, 0.2, 1),
                }),
                Animated.timing(this.animate.opacity, {
                    toValue: 1,
                    useNativeDriver: Platform.OS === 'android',
                    duration: duration,
                    easing: Easing.bezier(0.0, 0.0, 0.2, 1),
                })
            ])
            .start(function onComplete() {
                that.showCompleted();
            });
        }
        else if(transition == GLOBALS.TRANSITION.SLIDE_TOP){
            container.setNativeProps({
                style: {
                    zIndex: zindex
                }
            });
            this.animate.posY.setValue(100);
            this.animate.opacity.setValue(1);
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
        const {maxZindex,transition,duration,startTrans,sizeX,sizeY} = this.props;
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
            Animated.parallel([
                Animated.timing(this.animate.posX, {
                    toValue: 100,
                    useNativeDriver: Platform.OS === 'android',
                    duration: duration,
                    easing: Easing.bezier(0.0, 0.0, 0.2, 1),
                }),
                Animated.timing(this.animate.opacity, {
                    toValue: 0,
                    useNativeDriver: Platform.OS === 'android',
                    duration: duration,
                    easing: Easing.bezier(0.0, 0.0, 0.2, 1),
                })
            ])
            .start(function onComplete() {
                that.animate.posX.setValue(sizeX);
                that.hideCompleted();
               
                if(callback != null)
                    callback();
            });
        }
        else if(transition == GLOBALS.TRANSITION.SLIDE_TOP){
            Animated.parallel([
                Animated.timing(this.animate.posY, {
                    toValue: 100,
                    useNativeDriver: Platform.OS === 'android',
                    duration: duration,
                    easing: Easing.bezier(0.0, 0.0, 0.2, 1),
                }),
                Animated.timing(this.animate.opacity, {
                    toValue: 0,
                    useNativeDriver: Platform.OS === 'android',
                    duration: duration,
                    easing: Easing.bezier(0.0, 0.0, 0.2, 1),
                })
            ]).start(function onComplete() {
                that.animate.posY.setValue(Utils.Height());
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
    setVisible = (isVisible)=>{
        this._isVisible = isVisible;
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
        return (<View style={{width:200,height:200,backgroundColor:"red"}}></View>);
    }

    render() {
        const {opacity,posX,posY} = this.animate;
        const {type , maxZindex,sizeX,sizeY} = this.props;
        var style = {};
        // if(type == GLOBALS.SCREEN_TYPE.BOTTOM){
        //     style.top = 0;
        // }
        // else{
        //     style.top = 0;
        // }
        style.top = 0;
        style.height = sizeY - GLOBALS.STATUS_BAR_HEIGHT;
        style.width = sizeX;

        return (
            <Animated.View
                ref={ref => (this._container = ref)}
                style={[styles.container,style,{zIndex:maxZindex, opacity : opacity,transform: [{translateY: posY},{translateX:posX}]}]}>
                
                <LinearGradient 
                    start={{x: 0.1, y: 0.1}} end={{x: 1, y: 1}} 
                    colors={['#444284', '#434B8C', '#445D9D', '#436BA8', '#2C87A2', '#1F98A1', '#05BA9B']} 
                    style={{flex:1, width:'100%'}}>
                    <View style={{flex:1, marginBottom:this._bottom, width:'100%'}}>
                        {this.renderContentView()}
                    </View>
                </LinearGradient>
                
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position:"absolute",
        //width: "100%"
    }
})

export default BaseScreen;
