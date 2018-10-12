import React from 'react';
import { Image, Platform,Text, View, TouchableWithoutFeedback,Animated,Easing,Dimensions,StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Button from '../../Components/Button';
import ListItem from '../../Components/ListItem';
import GLOBALS from '../../DataManagers/Globals';
import {Grid,Row,Col} from 'react-native-easy-grid'
import Utils from '../../Utils/Utils';
import  CustomIcon from '../../Components/CustomIcon';
import DATA_INFO from '../../DataManagers/DataInfo';

const isIOS = Platform.OS === 'ios';

export default class SongOnlineItem extends React.Component {
  static propTypes = {
    thumbnail: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    channel: PropTypes.string,
    maxOpacity: PropTypes.number,
    onPress : PropTypes.func,
    onPlayPress : PropTypes.func,
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

  onPlayPress = () =>{
    const {onPlayPress} = this.props;
    if(onPlayPress != null){
      onPlayPress();
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
    const {width,height2,thumbnail,id} = this.props;
    var _h = height2 - 25;
    var imageHeight = width*18/32;
    var container = {};
    if(GLOBALS.LANDSCAPE)
      container = {marginLeft:5, marginRight:5};

    var _isSelected = (DATA_INFO.PLAY_QUEUE.indexOf(id) > 0)?true:false;
    //console.warn("select = "+_isSelected+" , id = "+id);
    //_isSelected = true;
    return (
      <View style={[{flex:1},container]}>
          <View style={{width:width,height:height2, position:"absolute",top:0,zIndex:1}}>
              <View
                  style={{
                      width:'100%',
                      height: imageHeight,
                      backgroundColor: 'lightgrey'}}>
                  <Image
                          ref={ref => {this.imageRef = ref;}}
                          style={{flex: 1,}}
                          onLoad={this.handleOnLoad}
                          source={{ uri: thumbnail }} />
              </View>
              <View style={styles.textContainer}>
                  <Grid>
                      <Row>
                          <Col size={0.8}>
                              <Text numberOfLines={2} style={styles.textTitle} >{this.props.title}</Text>
                              <Text style={styles.textChannel} >{this.props.channel}</Text>
                          </Col>
                          <Col size={0.2} style={{justifyContent:"center",alignItems:"flex-end"}}>
                              
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

          <View 
           // onPress = {this.onPressed}
            style={{width:70,height:70, position:"absolute",borderRadius:35
                    ,bottom:30,right:0,zIndex:3}}>
                 <ListItem
                    rippleRound = {true} 
                    style={{width:70,height:70,justifyContent:"center",alignItems:"center"}}
                    onPress = {this.onPlayPress}>
                    <CustomIcon name="play" color="#14DCC4" size={40} />
                 </ListItem> 
          </View>
          {_isSelected &&
            <View style={{position:"absolute",top:10,right:10,width:40,height:40,zIndex:5}}> 
                <CustomIcon name="mkDung" color="#14DCC4" size={35} /></View>}
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
