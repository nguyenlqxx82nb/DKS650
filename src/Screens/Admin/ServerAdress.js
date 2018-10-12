import React from "react";
import {Text,StyleSheet,TextInput, View} from "react-native";
import InputAdmin from "./InputAdmin";
import ButtonAdmin from "./ButtonAdmin";
import { EventRegister } from 'react-native-event-listeners'
import Language from '../../DataManagers/Language';
import GLOBALS from '../../DataManagers/Globals';
import BoxControl from '../../DataManagers/BoxControl';
import DATA_INFO from '../../DataManagers/DataInfo'

export default class ServerScreen extends React.Component
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
        this._text1.setText(DATA_INFO.SYSTEM_INFO.stb_downdomain);
    }
    onPressButton = ()=>{
        //console.warn(" tai sao "+this._text1.getValue()+" , "+this._text2.getValue());
        const text1 = this._text1.getValue();
        if(text1.length < 10){
            return;
        }

        const value = text1 +",";
        BoxControl.stbset(GLOBALS.ADMIN_CMD.DOMAIN,value,(error)=>{
            //console.warn("error = "+error);
            if(error == 0){
                DATA_INFO.SYSTEM_INFO.stb_downdomain = text1;
                EventRegister.emit("ShowToast",{message:Language.Strings.admin.updateSuccess});
            }
            else{
                EventRegister.emit("ShowToast",
                    {message:Language.Strings.admin.updateError,
                     type: GLOBALS.TOAST_TYPE.ERROR});
            }
        });
    }
    blur = ()=>{
        this._text1.blur();
    }
    render() {
       return(
            <View style={[{flex:1,margin:20,justifyContent:"flex-start",alignItems:"center"}]} >
                <InputAdmin 
                    //ref = {ref = (this._input = ref)}
                    ref = {ref => (this._text1 = ref)}
                    placeholder={Language.Strings.hdm}
                />
                <ButtonAdmin onPress={this.onPressButton} />
            </View>
        );
    }
} 

const styles = StyleSheet.create({
})
