import React from 'react';
import { Image, Platform,Text, View, TouchableWithoutFeedback,Animated,Easing,Dimensions,StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Button from '../../Components/Button';
import ListItem from '../../Components/ListItem';
import GLOBALS from '../../DataManagers/Globals';
import {Grid,Row,Col} from 'react-native-easy-grid'
import Utils from '../../Utils/Utils';
import  CustomIcon from '../../Components/CustomIcon';

const isIOS = Platform.OS === 'ios';

export default class SongOnlineItem extends React.Component {
  static propTypes = {
    thumbnail: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    channel: PropTypes.string,
    maxOpacity: PropTypes.number,
    onPress : PropTypes.func,
    height : PropTypes.number,
    height2 : PropTypes.number,
    width: PropTypes.number
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
  
  onPressed = () =>{
    const {onPress} = this.props;
    if(onPress != null){
        onPress();
    }
  }

//   find_dimesions = (layout) =>{
//     const {x, y, width, height} = layout;
//     this._rippleView.setNativeProps({style:{
//         width: height,
//         height: height,
//         left: (width - height)/2,
//         borderRadius: height/2}});
//   }
  render() {
    //console.warn(" url = "+GLOBALS.SINGER_SEX[1]);
    const {width,height2} = this.props;
    var _h = height2 - 25;
    var imageHeight = width*18/32;
   /// console.warn("_h = "+_h +" , - "+height2);
    return (
      <View style={{flex:1,marginLeft:5, marginRight:5}}>
          <View style={{width:this.props.width,height:height2, position:"absolute",top:0,zIndex:1}}>
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
                  <Grid>
                      <Row>
                          <Col size={0.8}>
                              <Text numberOfLines={2} style={styles.textTitle} >{this.props.title}</Text>
                              <Text style={styles.textChannel} >{this.props.channel}</Text>
                          </Col>
                          <Col size={0.2} style={{justifyContent:"center",alignItems:"flex-end"}}>
                              <CustomIcon name="play" color="#14DCC4" size={30} />
                          </Col>
                      </Row>
                  </Grid>
              </View>
          </View>
          
          <View 
           // onPress = {this.onPressed}
            style={{width:this.props.width,height:_h, position:"absolute"
                    ,top:0,zIndex:2}}>
                 <ListItem 
                    style={{width:this.props.width,height:_h}}
                    onPress = {this.onPressed}>
                   
                 </ListItem> 
            
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    textContainer : {
        flex:1,
        backgroundColor:"#7984ED", 
        marginBottom:25,
        paddingLeft:10,
        paddingRight:10,
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
