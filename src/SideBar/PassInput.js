import React from "react";
import { StyleSheet, TextInput,View } from "react-native";
import PropTypes from 'prop-types';
import GLOBALS from '../DataManagers/Globals.js';
import CustomIcon from '../Components/CustomIcon';

export default class PassInput extends React.Component {
    static propTypes = {
        pass:PropTypes.string,
        onSuccess: PropTypes.func,
        onFailure : PropTypes.func
    };
    static defaultProps = {
        pass : "12345"
    }
    constructor(props) {
        super(props);

        this.state={
            value : ""
        }
    }
    AddNumber = (number)=>{
        const {onSuccess,onFailure} = this.props;
        if(this.state.value.length == 5)
            return;

        let _value = this.state.value+number;
        this.setState({value:_value});
        if(_value.length == 5){
            if(_value == this.props.pass){
                if(onSuccess != null){
                    onSuccess();
                }
            }
            else{
                if(onFailure != null){
                    onFailure();
                }
            }
        }
        
    }
    RemoveText = () =>{
        if(this.state.value.length == 0)
            return;
        let _value = this.state.value.slice(0, -1);
        this.setState({value:_value});
    }
    _handleTextChanged = (value) =>{
        //console.warn("text change = "+value);
    }
    _renderIcon = () =>{
        const {value} = this.state;
        if(value.length == 5){
            if(value != this.props.pass)
                return(
                    <View style={{width:40,height:40, position:"absolute",
                                    zIndex:2, top:7,right:0, justifyContent:"center",alignItems:"center"}}>
                        <CustomIcon name="mkDung" size={25} style={{color:GLOBALS.COLORS.ERROR}} />
                    </View>
                )
            else{
                return(
                    <View style={{width:40,height:40, position:"absolute",
                                    zIndex:2, top:7,right:0, justifyContent:"center",alignItems:"center"}}>
                        <CustomIcon name="mkDung" size={25} style={{color:GLOBALS.COLORS.SELECTED}} />
                    </View>
                )
            }
        }
    }
    render = () => {
        const {value} = this.state;
        var inputBorder = {};
        if(value.length == 5){
            if(value != this.props.pass){
                inputBorder= {
                    borderWidth :1,
                     borderColor: GLOBALS.COLORS.ERROR
                }
            }
            else{
                inputBorder= {
                    borderWidth :1,
                    borderColor: GLOBALS.COLORS.SELECTED
                }
            }
        }
        return (
            <View style={{height: 60,width:294}}>
                <View style={{flex:1,backgroundColor:"transparent",padding:2}}>
                    <TextInput
                        secureTextEntry = {true}
                        ref = {ref => (this._passInput = ref)}
                        underlineColorAndroid={'transparent'}
                        style={[styles.input,inputBorder]}
                        textAlign={'center'}
                        editable={false} 
                        selectTextOnFocus={false}
                        onChangeText={this._handleTextChanged}
                        value={this.state.value}
                    />
                </View>
                {this._renderIcon()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        flex:1,
        fontSize: 32, 
        color: "white",
        fontFamily:GLOBALS.FONT.MEDIUM,
        borderRadius:25,
        backgroundColor:GLOBALS.COLORS.MAIN,
        textAlign:"center",
        alignItems:"center",
        justifyContent:"center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        zIndex:0
    },
})
