import React from 'react';
import { Image, Platform, View, Animated,Easing } from 'react-native';
import PropTypes from 'prop-types';
import GLOBALS from '../DataManagers/Globals.js';
import ListItem from '../Components/ListItem.js'

const isIOS = Platform.OS === 'ios';

export default class ImageRenderer extends React.Component {
  static propTypes = {
    source: PropTypes.number,
    id: PropTypes.string,
    imageUrl: PropTypes.string,
    maxOpacity: PropTypes.number,
    onPress: PropTypes.func,
    width: PropTypes.number,
    
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
  
  render() {
    const {width,onPress} = this.props;
    var height = (width)*3.5/3 - 13;
    return (
      <View
          style={{
            flex: 1,
            backgroundColor: 'lightgrey',
            borderRadius: 10,
            marginRight: 5,
            marginLeft: 5,
            marginBottom:13,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            elevation: 2,
          }}>
            <View 
              style={{ flex: 1 }}>
                <Image
                    ref={ref => {
                      this.imageRef = ref;
                    }}
                    //resizeMode={'contain'}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                    }}
                    onLoad={this.handleOnLoad}
                    //source={{ uri: GLOBALS.SINGER_TEST[this.props.source] }} 
                    source={{ uri:this.props.imageUrl}} />
            </View>
            <View 
            // onPress = {this.onPressed}
              style={{width:width - 10,height:height, position:"absolute"
                      ,top:0,zIndex:2,borderRadius:10}}>
                  <ListItem 
                      rippleRound={true}
                      style={{width:width - 10,height:height}}
                      onPress = {()=>{
                        if(onPress != null){
                          onPress();
                        }
                      }}>
                    
                  </ListItem> 
              
            </View>      
        </View>
    );
  }
}
