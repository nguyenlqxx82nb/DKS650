import React from "react";
import {Text,StyleSheet,TextInput, View,AsyncStorage} from "react-native";
import InputAdmin from "./InputAdmin";
import ButtonAdmin from "./ButtonAdmin";
import { EventRegister } from 'react-native-event-listeners'
import Language from '../../DataManagers/Language';
import GLOBALS from '../../DataManagers/Globals';
import SyncStorage from 'sync-storage';

export default class MatkhauScreen extends React.Component
{
    constructor(props) {
        super(props);
    }
    componentWillMount(){
        this._listenerSubAdminBackEvent = EventRegister.addEventListener('SubAdminBack', (data) => {
            this.blur();
        });
    }
    componentWillUnmount(){
        EventRegister.removeEventListener(this._listenerSubAdminBackEvent);
    }
    componentDidMount(){
        //this._text1.setText("taisao");
    }
    onPressButton = ()=>{
        //console.warn(" tai sao "+this._text1.getValue()+" , "+this._text2.getValue());
        if(this._text1.getValue() != GLOBALS.LAN){
            return;
        }

        if(this._text2.getValue().length != 5
            || isNaN(this._text2.getValue())
                || (this._text2.getValue() != this._text3.getValue())){
             return;   
        }

        SyncStorage.set('pass',this._text2.getValue());
        GLOBALS.PASS == this._text2.getValue();
        EventRegister.emit("ShowToast",{message:Language.Strings.admin.updateSuccess});
    }
    blur = ()=>{
        this._text2.blur();
        this._text1.blur();
        this._text3.blur();
    }
    render() {
        return(
            <View style={[{flex:1,margin:20,justifyContent:"flex-start",alignItems:"center"}]} >
                <InputAdmin 
                    //ref = {ref = (this._input = ref)}
                    ref = {ref => (this._text1 = ref)}
                    placeholder={Language.Strings.admin.mkc}
                />

                <InputAdmin 
                    ref = {ref => (this._text2 = ref)}
                    placeholder={Language.Strings.admin.mkn}
                />

                <InputAdmin 
                    ref = {ref => (this._text3 = ref)}
                    placeholder={Language.Strings.admin.mkr}
                />

                <ButtonAdmin onPress={this.onPressButton} />

            </View>
        );
    }
} 

const styles = StyleSheet.create({
})
