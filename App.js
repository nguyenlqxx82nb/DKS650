/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component,} from 'react';
import {Dimensions} from "react-native";
import {Platform, StyleSheet, Text, View} from 'react-native';
import Portrail from "./src/Screens/index.js";
//import Portrail from "./src/Test/tabview"
//import Portrail from "./src/Test/FaceBookTest"
//import Portrail from "./src/Test/tab2"
//import Landscape from "./src/Screens/Home/index.landscape"
import Landscape from "./src/Screens/index.landscape.js"
//import Landscape from "./src/Test/layout";
//import Landscape from "./src/Test/drawer2";
import Orientation from 'react-native-orientation';
// import ScrollScreen from "./src/Test/scroll";
// import ScrollSwagger from './src/Test/ScrollSwagger'
//import RTCSocket from './RctSockets.js'
import GLOBALS from './src/DataManagers/Globals';

const screen = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height
}

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  orientation = GLOBALS.ORIENTATION_TYPE.LANDSCAPE;
  componentWillMount(){
    var maxSize = Math.max(screen.width,screen.height);
    if(maxSize > 800){
        Orientation.lockToLandscape();
        this.orientation = GLOBALS.ORIENTATION_TYPE.LANDSCAPE;
    }
    else{
        Orientation.lockToPortrait();
        this.orientation = GLOBALS.ORIENTATION_TYPE.PORTRAIT;
    }
  }
  render() {
    if(this.orientation == GLOBALS.ORIENTATION_TYPE.LANDSCAPE){
      return (
        <Landscape />
        // <View style={{backgroundColor:"red", flex:1}}></View>
      );
    }
    else{
      return (
        <Portrail />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
