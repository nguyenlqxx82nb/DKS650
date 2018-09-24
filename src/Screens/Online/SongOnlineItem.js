import React from 'react';
import { Image, Platform,Text, View, TouchableWithoutFeedback,Animated,Easing,Dimensions,StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Button from '../../Components/Button';
import GLOBALS from '../../DataManagers/Globals';
import Utils from '../../Utils/Utils';

const isIOS = Platform.OS === 'ios';

export default class SongOnlineItem extends React.Component {
  static propTypes = {
    thumbnail: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    channel: PropTypes.string,
    onPress: PropTypes.func,
    maxOpacity: PropTypes.number,
    onPress : PropTypes.func,
    height : PropTypes.number
  }

  static defaultProps = {
    maxOpacity: 0.25
  }

  shouldComponentUpdate(newProps) {
    return this.props.id !== newProps.id;
  }
  constructor(props, context) {
    super(props, context);

    const { maxOpacity } = this.props;
    this.state = {
      maxOpacity,
      scaleValue: new Animated.Value(0.01),
      opacityValue: new Animated.Value(maxOpacity)
    };
  }
  componentWillUpdate() {
    //On iOS while recycling till the new image is loaded the old one remains visible. This forcefully hides the old image.
    //It is then made visible onLoad
    if (isIOS && this.imageRef) {
      this.imageRef.setNativeProps({
        opacity: 0,
      });
    }
  }
  handleOnLoad = () => {
    if (isIOS && this.imageRef) {
      this.imageRef.setNativeProps({
        opacity: 1,
      });
    }
  }
  onPressedIn = () => {
    const { maxOpacity, onPress } = this.props;
    
    Animated.timing(this.state.scaleValue, {
      toValue: 1,
      duration: 225,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      useNativeDriver: Platform.OS === 'android',
    }).start(() => {
      Animated.timing(this.state.opacityValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: Platform.OS === 'android',
      }).start(() => {
        this.state.scaleValue.setValue(0.01);
        this.state.opacityValue.setValue(maxOpacity);
      });
    });

    if(onPress != null){
      onPress();
    }
  }
  
  find_dimesions = (layout) =>{
    const {x, y, width, height} = layout;
    this._rippleView.setNativeProps({style:{
        width: height,
        height: height,
        left: (width - height)/2,
        borderRadius: height/2}});
  }

  renderRippleView() {
    const { scaleValue, opacityValue } = this.state;
    const { height}= this.props;
    _height = height - 25;
    return (
      <Animated.View
        ref={component => this._rippleView = component}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: Utils.Width(),
          height: _height,
          borderRadius: _height/2,
          zIndex :2,
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
          backgroundColor: 'white',
        }}
      />
    );
  }

  find_dimesions = (layout) =>{
    const {x, y, width, height} = layout;
    this._rippleView.setNativeProps({style:{
        width: height,
        height: height,
        left: (width - height)/2,
        borderRadius: height/2}});
  }
  render() {
    //console.warn(" url = "+GLOBALS.SINGER_SEX[1]);
    var imageHeight = Utils.Width()*18/32;
   // console.warn("channel = "+this.props.channel);
    return (
      <Button onPress = {this.onPressedIn}>
        <View style={{flex:1}}  >
            {this.renderRippleView()}
            <View
                style={{
                    width:'100%',
                    height: imageHeight,
                    backgroundColor: 'lightgrey'}}>
                <Image
                        ref={ref => {this.imageRef = ref;}}
                        style={{flex: 1,}}
                        onLoad={this.handleOnLoad}
                        source={{ uri: this.props.thumbnail }} />
            </View>
            <View style={styles.textContainer}>
                <Text numberOfLines={2} style={styles.textTitle} >{this.props.title}</Text>
                <Text style={styles.textChannel} >{this.props.channel}</Text>
            </View>
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
    textContainer : {
        flex:1,
        backgroundColor:"#7984ED", 
        marginBottom:25,
        justifyContent:"flex-start",
        alignItems:"flex-start",
        paddingLeft:20,
        paddingRight:20,
        paddingTop:5,
        paddingBottom:5,
        borderColor:"#515EAC",
        borderBottomWidth:1
    },
    textTitle :{
        fontSize:16,
        color:"#fff",
        fontFamily:GLOBALS.FONT.MEDIUM
    },

    textChannel :{
        fontSize:13,
        color:"#CCCCCC",
        fontFamily:"SF-Pro-Text-Regular",
    }

});
