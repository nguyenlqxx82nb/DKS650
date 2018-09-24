import {Dimensions,Platform } from 'react-native';
import GLOBALS from '../DataManagers/Globals'

const _screen = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
}

const screen = {
    width: (Math.max(_screen.width,_screen.height) > 800)?Math.max(_screen.width,_screen.height):Math.min(_screen.width,_screen.height),
    height: (Math.max(_screen.width,_screen.height) > 800)?Math.min(_screen.width,_screen.height):Math.max(_screen.width,_screen.height),
}

export default class Utils{

    static Width(){
        return screen.width;
    }

    static Height(){
        return screen.height;
    }

    static zIndexWorkaround(val){
        return Platform.select({
            ios: {zIndex: val},
            android: {zIndex: val}
        });
    }
}