import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated, Easing, Platform, Image, Text} from 'react-native';
import PropTypes from 'prop-types';
import CustomIcon from './CustomIcon.js'
import AutoHeightImage from 'react-native-auto-height-image';

import GLOBALS from '../DataManagers/Globals.js';

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        flex:1,
        // margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor:"red"
    },
    badgeContainer : {
        position:"absolute",
        backgroundColor:"red",
        top : 0,
        right:0,
        width:20,
        height:20,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
    },
    badgeNumber:{
        color:"#fff",
        fontSize:12
    }
});

const { source } = Image.propTypes;
const propTypes = {
    color: PropTypes.string,
    /**
    * The color of the underlay that will show when the touch is active.
    */
    underlayColor: PropTypes.string,
    /**
    * Max opacity of ripple effect
    */
    maxOpacity: PropTypes.number,
    /**
    * Size of underlayColor
    */
    percent: PropTypes.number,
    /**
    * If true, the interaction will be forbidden
    */
    disabled: PropTypes.bool,
    
    square: PropTypes.bool,

    vector: PropTypes.bool,

    text : PropTypes.object,

    textColor : PropTypes.string,

    iconType : PropTypes.number,

    name1 : PropTypes.string,

    badge : PropTypes.number,

    status: PropTypes.number,

    fit : PropTypes.bool,

    textStyle : Text.propTypes.style,
    /**
    * Size of icon (default is 24 - see spacing in palette)
    */
    size: PropTypes.number,
    /**
    * Name of icon to show
    */
    name: PropTypes.string,
    /**
    * It'll be used instead of icon (see props name) if exists
    */
    children: PropTypes.element,
    iconSource : source,
    /**
    * Call when icon was pressed
    */
    onPress: PropTypes.func
    // style: PropTypes.shape({
    //     container: ViewPropTypes.style,
    //     icon: Text.propTypes.style,
    // }),
};
const defaultProps = {
    badge : 0,
    name1 : "",
    iconType : 1,
    children: null,
    onPress: null,
    color: "#ffffff",
    underlayColor: null,
    square : true,
    size: 24,
    disabled: false,
    percent: 90,
    maxOpacity: 0.16,
    style: {},
    vector :true,
    textColor : "#fff",
    fit: false,
    status: GLOBALS.ICON_STATUS.ONLINE,
    text:{
        content :"",
        layout : 1,
    },
};

class IconRippe extends PureComponent {
    
    constructor(props, context) {
        super(props, context);

        const {maxOpacity} = this.props;
        this._badge = this.props.badge;

        this.state = {
            containerSize : {width:1,height:1},
            maxOpacity,
            scaleValue: new Animated.Value(0.01),
            opacityValue: new Animated.Value(0),
            status : this.props.status
        };
        this._iconType = this.props.iconType;
        this.renderRippleView = this.renderRippleView.bind(this);
        this.onPressedIn = this.onPressedIn.bind(this);
        this.onPressedOut = this.onPressedOut.bind(this);
        this.find_dimesions = this.find_dimesions.bind(this);
    }
    onPressedIn() {
        if(this.props.status == GLOBALS.ICON_STATUS.OFFLINE)
            return;

        this.state.opacityValue.setValue(this.state.maxOpacity);
        Animated.timing(this.state.scaleValue, {
            toValue: 1,
            duration: 225,
            easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            useNativeDriver: Platform.OS === 'android',
        }).start(()=>{
        });
    }
    onPressedOut() {
        if(this.props.status == GLOBALS.ICON_STATUS.OFFLINE)
            return;

        const {containerSize} = this.state;
        const {maxOpacity,onPress} = this.props;

        Animated.timing(this.state.opacityValue, {
            toValue: 0,
            useNativeDriver: Platform.OS === 'android',
        }).start(() => {
            this.state.scaleValue.setValue(0.01);
            this.state.opacityValue.setValue(0);
        });
        
        if(onPress){
            onPress();
        }
    }
    renderRippleView() {
        const { size, color } = this.props;
        const { scaleValue, opacityValue, containerSize,width } = this.state;

        return (
            <Animated.View
                ref={component => this._rippleView = component}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex:5,
                    transform: [{ scale: scaleValue }],
                    opacity: opacityValue,
                    backgroundColor: color || 'white',
                }}
            />
        );
    }
    renderBadge = () =>{
        return (this._badge > 0)?
            <View style={styles.badgeContainer}><Text style={styles.badgeNumber}>{this._badge}</Text></View> : null;
    }
    renderImageView(){
        const {size, color, iconSource, name,name1, vector,text , iconType, textStyle} = this.props;
        const iconSize = {width:size, height:size};

        var iconName = (this._iconType == 1)?name: name1;
        var iconColor = (this.props.status == GLOBALS.ICON_STATUS.ONLINE)?color:"#C0C0C0";
        if(text.content == ""){
            if(!vector){
                return(<AutoHeightImage source={iconSource} width={size}  />);
            }
            else{
                return(
                    <CustomIcon ref={ref =>(this._icon = ref)} name={iconName} size ={size} style={{color:iconColor}} />
                );
            }
        }
        else{
            if(!vector){
                if(text.layout == 1){
                    return(
                        <View style={{flexDirection: 'row', justifyContent:"center",alignItems:"center"}}>
                            <AutoHeightImage source={iconSource} width={size} />
                            <Text style={textStyle}>{text.content}</Text>
                        </View>
                    );
                }    
                else{
                    return(
                        <View style={{alignItems:"center",justifyContent:"center",alignItems:"center"}}>
                            <AutoHeightImage source={iconSource} width={size} />
                            <Text style={textStyle}>{text.content}</Text>
                        </View>
                    );
                }
            }
            else{
                if(name == ""){
                    return(
                        <View style={{flexDirection: 'row', justifyContent:"center",alignItems:"center"}}>
                            <Text style={textStyle}>{text.content}</Text>
                        </View>
                    );
                }
                else{
                    if(text.layout == 1){
                        return(
                            <View style={{flexDirection: 'row', justifyContent:"center",alignItems:"center"}}>
                                <CustomIcon ref={ref =>(this._icon = ref)} name={iconName} size ={size} style={{color:iconColor}} />
                                <Text style={textStyle}>{text.content}</Text>
                            </View>
                        );
                    }    
                    else{
                        return(
                            <View style={{alignItems:"center",justifyContent:"center",alignItems:"center"}}>
                                <CustomIcon ref={ref =>(this._icon = ref)} name={iconName} size ={size} style={{color:iconColor}} />
                                <Text style={textStyle}>{text.content}</Text>
                            </View>
                        );
                    }
                }
                
            }
        }
    }

    setIconType = (type) =>{
        if(type == this._iconType)
            return;

        this._iconType = type;
        this.forceUpdate();
        //this.setState({});
    }

    // setIconStatus = (status) =>{
    //     if(status == this.state.status)
    //         return;
        
    //     this.setState({status:status});   
    // }

    updateBagde = (number) =>{
        if(this._badge == number)
            return;

        this._badge = number;
        this.forceUpdate();
        //this.setState({});
    }

    render() {
        //const { size, color, iconSource, width, height,square, name, vector } = this.props;
        const {size} = this.state;
        const iconContainer = { width: size*2, height: size*2 };
        return (
            <View 
                onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }} 
                style={{flex: 1}} >
                <TouchableWithoutFeedback onPressIn={this.onPressedIn} onPressOut={this.onPressedOut}>
                    <View style={[styles.iconContainer]}>
                        {this.renderRippleView()}
                        {this.renderImageView()}
                        {this.renderBadge()}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    find_dimesions(layout){
        const {fit} = this.props;
        const {x, y, width, height} = layout;
        let size = Math.max(width,height);
        if (!fit)  {
            this._rippleView.setNativeProps({
                style:{
                    top: (height - size)/2,
                    left: (width - size)/2,
                    width: size,
                    height: size,
                    borderRadius: size/2}});
        }
        else{
            this._rippleView.setNativeProps({
                style:{
                    top: 0,
                    left: 0,
                    width: width,
                    height: height,
                    borderRadius: height/2}});
        }
    }
}

IconRippe.propTypes = propTypes;
IconRippe.defaultProps = defaultProps;

export default IconRippe;