import React from "react";
import { StyleSheet,View, Dimensions,Text} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals.js';
import BoxControl from '../../DataManagers/BoxControl'
import { EventRegister  } from 'react-native-event-listeners';
import ListItem from '../../Components/ListItem';
import CustomIcon from '../../Components/CustomIcon';
import Language from '../../DataManagers/Language';

export default class SongMenu extends React.Component {
    static propTypes = {
        songId : PropTypes.string,
        actor: PropTypes.string,
        onClose: PropTypes.func,
        buttons : PropTypes.array,
    };

    static defaultProps = {
        buttons : [],
    }; 
    constructor(props) {
        super(props);
    }

    _close = () =>{
        setTimeout(()=>{
            if(this.props.onClose != null)
                this.props.onClose()
        },50);
    }
    
    _doAction = (actionType)=>{
        const {songId,actor} = this.props;
        switch(actionType){
            case GLOBALS.SONG_ACTION.PLAY:
                BoxControl.playNow(songId);
                this._close();
                break;
            case GLOBALS.SONG_ACTION.PRIORITY:
                if(isNaN(songId))
                    BoxControl.AheadYoutubeToEndOfList(songId);
                else
                    BoxControl.priority(songId);
                this._close();
                break;
            case GLOBALS.SONG_ACTION.ADD_AUTO:
                BoxControl.stbset(GLOBALS.ADMIN_CMD.ADD_AUTO,songId+",",(error)=>{
                    if(error == 0){
                        EventRegister.emit("ShowToast",{message:Language.Strings.addAuto});
                        BoxControl.fetchSystemInfo();
                        this._close();
                    }
                });
                break;
            case GLOBALS.SONG_ACTION.SINGER:
                EventRegister.emit("OpenSingerSong",{name:actor.toUpperCase()});
                this._close();
                break;
            case GLOBALS.SONG_ACTION.REMOVE_SELECT:
                if(isNaN(songId))
                    BoxControl.selectYoutubeSong(songId,"","");
                else    
                    BoxControl.selectSong(songId);

                this._close();
                break;
            default : 
                break;
        }
    }
   
    render = () =>{
        const {buttons,songId} = this.props;
        if(!GLOBALS.LANDSCAPE){
            return(
                <View style={styles.innerContainer}>
                    {buttons.map((button, index) => {
                        // if(isNaN(songId) && button.type == GLOBALS.SONG_LIST_TYPE.AUTO){
                        //     continue;
                        // }
                        return(
                            <ListItem key={index} style={{height:50,width:'100%',flexDirection:"row"}}
                                onPress={this._doAction.bind(this,button.type)}
                            >
                                <View style={{width:"45%",justifyContent:"center",alignItems:"flex-end"}}>
                                    <CustomIcon name={button.icon} size ={25} style={{color:"#fff", marginRight : 30}} />
                                </View>
                                <View style={{width:"55%",justifyContent:"center",alignItems:"flex-start"}}>
                                    <Text style={{fontSize:16,fontFamily:"SF-Pro-Text-Medium",color:"#fff",marginLeft:0}}>
                                        {button.name}
                                    </Text>
                                </View>
                                {/* <IconRippe vector={true} name={button.icon} size={23} 
                                    text={{content: button.name, layout: 1}} textStyle={styles.textButton}
                                    onPress={this._doAction.bind(this,button.type)}
                                /> */}
                            </ListItem>
                        )
                    })}
            </View>);
        }
        else {
            return(
                <View style={[styles.innerContainer,{justifyContent:'center',alignItems:'center',flexDirection:"row"}]}>
                    {buttons.map((button, index) => {
                            return(
                                <View key={index} style={{ height:"100%", width:170,}}>
                                    <IconRippe name={button.icon} size = {90}
                                        text={{content: button.name, layout: 2}} 
                                        textStyle={styles.textButton}
                                        onPress={this._doAction.bind(this,button.type)}
                                        />
                                </View>
                            )
                        })}
            </View>);
        }
        
    }
}


const styles = StyleSheet.create({
    innerContainer:{
        marginTop:5,
        marginBottom:5,
        flex:1,
    },
    textButton: {
        fontFamily: GLOBALS.FONT.MEDIUM,
        color:"#fff",
        fontSize:16,
        marginTop:5
    },
    
})
