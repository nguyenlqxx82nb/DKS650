import React from "react";
import {Text,StyleSheet, View} from "react-native";
import InputAdmin from "./InputAdmin";
import ButtonAdmin from "./ButtonAdmin";
import { EventRegister } from 'react-native-event-listeners'
import Language from '../../DataManagers/Language';
import GLOBALS from '../../DataManagers/Globals';
import BoxControl from '../../DataManagers/BoxControl';
import DATA_INFO from '../../DataManagers/DataInfo'

export default class LanScreen extends React.Component
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
        this._text1.setText(DATA_INFO.SYSTEM_INFO.stb_ipadd);
        this._text2.setText(DATA_INFO.SYSTEM_INFO.stb_gateway);
    }
    onPressButton = ()=>{
        const text1 = this._text1.getValue();
        const text2 = this._text2.getValue();
        if(text1.length < 10 && text2.length < 10){
            return;
        }

        const value = text1 +","+text2+",";
        BoxControl.stbset(GLOBALS.ADMIN_CMD.LAN,value,(error)=>{
            //console.warn("error = "+error);
            if(error == 0){
                DATA_INFO.SYSTEM_INFO.stb_ipadd = text1;
                DATA_INFO.SYSTEM_INFO.stb_gateway = text2;
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
        this._text2.blur();
        this._text1.blur();
    }
    render() {
        return(
            <View style={[{flex:1,margin:20,justifyContent:"flex-start",alignItems:"center"}]} >
                <InputAdmin 
                    //ref = {ref = (this._input = ref)}
                    ref = {ref => (this._text1 = ref)}
                    placeholder=""
                />

                <InputAdmin 
                    ref = {ref => (this._text2 = ref)}
                    placeholder=""
                />

                <ButtonAdmin onPress={this.onPressButton} />

            </View>
        );
    }
} 

const styles = StyleSheet.create({
})
