import React from "react";
import {Text,StyleSheet,Alert, View} from "react-native";
import InputAdmin from "./InputAdmin";
import ButtonAdmin from "./ButtonAdmin"; 
import GLOBALS from "../../DataManagers/Globals"
import { EventRegister } from 'react-native-event-listeners'
import IconRippe from '../../Components/IconRippe'
import CustomIcon from '../../Components/CustomIcon'
import BoxControl from '../../DataManagers/BoxControl';
import DATA_INFO from '../../DataManagers/DataInfo'
import Language from '../../DataManagers/Language'

export default class NgoVideoScreen extends React.Component
{   
    _videoOuputs = [
        {
            name: "1080I",
            output:"1080I",
            index : 0,
        },
        {
            name: "AV",
            output:"AVOut",
            index : 1,
        },
        {
            name: "480P",
            output:"480P",
            index : 2,
        },
        {
            name: "1080P",
            output:"1080P",
            index : 3,
        },
    ];
    _curr_video = -1;
    _video_out = "";
    constructor(props) {
        super(props);

        this._curr_video = DATA_INFO.SYSTEM_INFO.stb_videoput;
    }
    componentWillMount(){
        
    }
    componentWillUnmount(){
    }
    componentDidMount(){
        //this._text1.setText("taisao");
    }
    onPressButton = ()=>{
        if(this._video_out == ""){
            return;
        }

        BoxControl.stbset(GLOBALS.ADMIN_CMD.VIDEO,this._video_out,(error)=>{
            if(error == 0){
                DATA_INFO.SYSTEM_INFO.stb_videoput = this._curr_video;
                EventRegister.emit("ShowToast",{message:Language.Strings.admin.updateSuccess});
            }
            else{
                EventRegister.emit("ShowToast",
                    {message:Language.Strings.admin.updateError,
                     type: GLOBALS.TOAST_TYPE.ERROR});
            }
        });
    }
    onSelectedVideoOutput = (output,index) =>{
        this._video_out =  output;
        this._curr_video = index;
        setTimeout(()=>{
            this.setState({});
        },50);
    }

    render() {
        return(
            <View style={[{flex:1,margin:20,justifyContent:"flex-start",alignItems:"center"}]} >
                {
                    this._videoOuputs.map((item,index)=>{
                        return(
                            <View key={index} style={{height:60,width:'100%',marginTop:5}}>
                                <IconRippe vector={true} name={""} 
                                        text={{content:item.name, layout: 1}} 
                                        textStyle={styles.textButton}
                                        onPress = {this.onSelectedVideoOutput.bind(this,item.output,item.index)}
                                        />
                                {(item.index == this._curr_video) && <CustomIcon name="mkDung" size={30} color="#00ECBC" style={{position:"absolute",left:80,top:15}} />}
                            </View>
                        )
                    })
                }
                <ButtonAdmin onPress={this.onPressButton} />

            </View>
        );
    }
} 

const styles = StyleSheet.create({
    textButton: {
        fontFamily: GLOBALS.FONT.BOLD,
        fontSize: 22, 
        color:"#fff"
    },
})
