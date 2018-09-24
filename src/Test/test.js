import React, { Component } from 'react';
import {  TextInput,View } from 'react-native';

export default class Example extends Component {
  componentDidMount () {
    //this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    //this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    //this.keyboardDidShowListener.remove();
   // this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
    //alert('Keyboard Shown');
  }

  _keyboardDidHide () {
    //alert('Keyboard Hidden');
  }

  render() {
    return (
        <View style={{flex:1, backgroundColor:"red"}}>
             <TextInput
                returnKeyType='search'
                onEndEditing={(e) => {}}
                style = {{height:40,width:500, backgroundColor:"blue"}}
                    onSubmitEditing={()=>{
                        
                    }}
                    disableFullscreenUI = {true}
                />
        </View>
    );
  }
}