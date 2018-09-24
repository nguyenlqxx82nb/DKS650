import React from "react";
import { StyleSheet,View, Dimensions} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals.js';
import BoxControl from '../../DataManagers/BoxControl'
import { EventRegister  } from 'react-native-event-listeners';

export default class SongMenu extends React.Component {
    static propTypes = {
        songId : PropTypes.string,
        actor: PropTypes.string,
        onClose: PropTypes.func,
        menuType: PropTypes.number
    };

    constructor(props) {
        super(props);
        
    }

    _playNow = ()=>{
        BoxControl.playNow(this.props.songId);
        this._close();
    }

    _priority = () =>{
        BoxControl.priority(this.props.songId);
        this._close();
    }

    _findSinger = () =>{
        //console.warn("actor: "+this.props.actor);
        EventRegister.emit("OpenSingerSong",{name:this.props.actor});
        this._close();
    }

    _close = () =>{
        setTimeout(()=>{
            if(this.props.onClose != null)
                this.props.onClose()
        },50);
    }
   
    render = () =>{
        const {menuType,actor} = this.props;
        let isSinger = (menuType == GLOBALS.SONG_MENU_TYPE.SINGER);
        return(
            <View style={styles.innerContainer}>
                <View style={{height:50,width:'100%'}}>
                    <IconRippe vector={true} name="play2" size={23} 
                        text={{content: "Hát Ngay", layout: 1}} textStyle={styles.textButton}
                        onPress={this._playNow}
                    />
                </View>
                <View style={{height:50,width:'100%'}}>
                    <IconRippe vector={true} name="uutien" size={23} 
                        text={{content: "Ưu Tiên", layout: 1}} textStyle={styles.textButton}
                        onPress={this._priority}
                    />
                </View>
                {!isSinger && 
                    <View style={{height:50,width:'100%'}}>
                        <IconRippe vector={true} name="singerOpt" size={25} 
                            text={{content: actor, layout: 1}} textStyle={styles.textButton}
                            onPress={this._findSinger}
                        />
                    </View>}
        </View>);
    }
}


const styles = StyleSheet.create({
    
    textButton: {
        fontFamily: GLOBALS.FONT.MEDIUM,
        color:"#fff",
        fontSize:15,
        marginLeft:20
    },
    
    textEmoji:{
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 12, 
        marginTop: 2,
        color:"#fff"
    }
})
