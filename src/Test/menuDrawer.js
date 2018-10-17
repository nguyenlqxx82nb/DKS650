import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Easing,
  TouchableHighlight
} from 'react-native';
import Drawer from 'react-native-drawer-menu';
import Home from '../Screens/Home/index.landscape';
import SideBar from '../SideBar/SideBar';
import {EventRegister} from 'react-native-event-listeners';
import Utils from '../Utils/Utils';

const {width, height} = Dimensions.get('window');

export default class drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
  }
  componentWillMount() {
    // openDrawer
    this._listenerOpenDrawerEvent = EventRegister.addEventListener('OpenDrawer', (data) => {
        this.openDrawer();
    });
    // Close Drawer
    this._listenerCloseDrawerEvent = EventRegister.addEventListener('CloseDrawer', (data) => {
        this.closeDrawer();
    });
  }
  componentWillUnmount(){
    EventRegister.removeEventListener(this._listenerOpenDrawerEvent);
    EventRegister.removeEventListener(this._listenerCloseDrawerEvent);
  }
  closeDrawer = () => {
    this._drawer.closeLeftDrawer();
  }
  openDrawer = () => {
    this._drawer.openLeftDrawer();
  }
  render () {
    var minSize = Math.min(Utils.Width(), Utils.Height());
    var width = 250;
    var size = 1;
    if(minSize < 605){
      width = 250;
    }
    else if(minSize < 705){
      width = 350;
      size = 2;
    }
    else if(minSize >= 705){
      width = 450;
      size = 3;
    }

    return (
      <Drawer
        ref={(comp) => {this._drawer = comp;}}
        style={styles.container}
        drawerWidth={width}
        leftDrawerContent={<SideBar size = {size} />}
        //rightDrawerContent={rightDrawerContent}
        type={Drawer.types.Overlay}
        customStyles={{
          leftDrawer: styles.leftDrawer,
          //rightDrawer: styles.rightDrawer
        }}
        drawerWidth={width}
        disabled={this.state.disabled}
        drawerPosition={Drawer.positions.Left}
       // easingFunc={Easing.ease}
      >
        <Home/>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  main: {
    position: 'absolute',
    backgroundColor: '#2ba'
  },
  head: {
    height: 60,
    marginBottom: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#6a0d45'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#e3b8cb'
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftTop: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: '#8ad8dd'
  },
  leftBottom: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#f0f0f0'
  },
  leftDrawer: {
    borderWidth: 0,
    borderRightColor: 'red'
  },
  rightDrawer: {
    borderWidth: 0,
    //borderLeftColor: '#5b585a'
  },
  btn1: {
    marginTop: 10,
    padding: 10,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#f06355'
  },
  btn2: {
    marginTop: 10,
    padding: 10,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#37b9d5'
  },
  btnText: {
    fontSize: 14,
    color: '#f0f0f0'
  }
});