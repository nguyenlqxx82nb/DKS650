import React from "react";
import {StyleSheet,TextInput, View} from "react-native";
import GLOBALS from "../../DataManagers/Globals";
import PropTypes from 'prop-types';

export default class InputAdmin extends React.Component
{   
    static propTypes = {
        placeholder: PropTypes.string,
    };
    static defaultProps = {
        placeholder : ""
    }
    setText = (text)=>{
        this._input.setNativeProps({ text:text });
        setTimeout(() => {
            this._input.setNativeProps({ text: text });
        });
        this._input._lastNativeText = text;
    }
    getValue = ()=>{
        if(this._input._lastNativeText == undefined)
            return "";
        else
            return this._input._lastNativeText;
    }
    blur = () =>{
        this._input.blur();
    }
    constructor(props) {
        super(props);
    }
    
    render() {
        const {placeholder} = this.props;
        return(
            <TextInput 
                ref = {ref => (this._input = ref)}
                underlineColorAndroid={'transparent'}
                placeholderTextColor={'#9192C6'}
                style={[styles.input]}
                placeholder={placeholder}
                
            // onFocus = {this._handleTextFocus}
                //onBlur = {this._handleBlur}
                //onSubmitEditing = {this._handleTextSubmit}
            // onChangeText={this._handleTextChanged}
                //value={this.state.value}
            />
        );
    }
} 

const styles = StyleSheet.create({
    input: {
        height: 40, 
        width:"100%",
        fontSize: 17, 
        color: "white", 
        padding: 0, 
        margin: 0,
        marginLeft: 0,
        fontFamily:GLOBALS.FONT.MEDIUM,
        marginTop:20,
        borderRadius: 20,
        backgroundColor: "#565BAC",
        paddingLeft:20,
        paddingRight:20,
    },
})
