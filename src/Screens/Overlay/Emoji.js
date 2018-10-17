import React from "react";
import { StyleSheet,View,} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals.js';
import { Col, Grid, Row } from "react-native-easy-grid";
import BoxControl from '../../DataManagers/BoxControl';
import Language from '../../DataManagers/Language';

export default class Emoji extends React.Component {
    static propTypes = {
        
    };

    constructor(props) {
        super(props);
    }

    effectClick = (type)=>{
        BoxControl.effect(type);
        this._close();
    }

    _close = () =>{
        setTimeout(()=>{
            if(this.props.onClose != null)
                this.props.onClose()
        },50);
    }
   
    render = () =>{
        if(!GLOBALS.LANDSCAPE){
            return(
                <View style={{height:170,width:'100%'}}>
                    <Grid>
                        <Row size={1}>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo1} size = {50}
                                    text={{content: Language.Strings.effect.huyt, layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.HuytSao)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo2} size = {50}
                                    text={{content: Language.Strings.effect.kiss, layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.Kiss)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo3} size = {50}
                                    text={{content: Language.Strings.effect.smile, layout: 2}} textStyle={styles.textEmoji} 
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.Smile)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo4} size = {50}
                                    text={{content: Language.Strings.effect.horeo, layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.HoRep)}
                                    />
                            </Col>
                        </Row>
                        <Row size={1}>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo5} size = {50}
                                    text={{content: Language.Strings.effect.diem, layout: 2}} textStyle={styles.textEmoji} 
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.ChamDiem)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo6} size = {50}
                                    text={{content: Language.Strings.effect.votay, layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.VoTay)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo7} size = {50}
                                    text={{content: Language.Strings.effect.rose, layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.TangHoa)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo8} size = {50}
                                    text={{content: Language.Strings.effect.like, layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.Like)}
                                    />
                            </Col>
                        </Row>
                    </Grid>
            </View>);
        }
        else{
            return(
                <View style={{height:"100%",width:'100%',padding:5}}>
                    <Grid>
                        <Row size={1}>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo1} size = {90}
                                    text={{content: Language.Strings.effect.huyt, layout: 2}} textStyle={styles.textEmoji1}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.HuytSao)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo2} size = {90}
                                    text={{content: Language.Strings.effect.kiss, layout: 2}} textStyle={styles.textEmoji1}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.Kiss)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo3} size = {90}
                                    text={{content:Language.Strings.effect.smile, layout: 2}} textStyle={styles.textEmoji1} 
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.Smile)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo4} size = {90}
                                    text={{content: Language.Strings.effect.horeo, layout: 2}} textStyle={styles.textEmoji1}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.HoRep)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo5} size = {90}
                                    text={{content: Language.Strings.effect.diem, layout: 2}} textStyle={styles.textEmoji1} 
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.ChamDiem)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo6} size = {90}
                                    text={{content: Language.Strings.effect.votay, layout: 2}} textStyle={styles.textEmoji1}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.VoTay)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo7} size = {90}
                                    text={{content: Language.Strings.effect.rose, layout: 2}} textStyle={styles.textEmoji1}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.TangHoa)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo8} size = {90}
                                    text={{content: Language.Strings.effect.diem, layout: 2}} textStyle={styles.textEmoji1}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.Like)}
                                    />
                            </Col>
                        </Row>
                    </Grid>
            </View>);
        }
        
    }
}


const styles = StyleSheet.create({
    inner:{
        padding:3
    },
    textButton: {
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 18, 
        marginLeft: 15,
        color:"#fff"
    },
    singerText : {
        fontSize: 14,
        marginLeft:25
    },
    textEmoji:{
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 12, 
        marginTop: 2,
        color:"#fff"
    },

    textEmoji1:{
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 14, 
        marginTop: 2,
        color:"#fff"
    }
})
