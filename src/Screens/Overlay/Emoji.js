import React from "react";
import { StyleSheet,View,} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals.js';
import { Col, Grid, Row } from "react-native-easy-grid";
import BoxControl from '../../DataManagers/BoxControl';


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
        return(
            <View style={styles.innerContainer}>
                <View style={{height:170,width:'100%'}}>
                    <Grid>
                        <Row size={1}>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo1} size = {50}
                                    text={{content: "Huýt Sáo", layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.HuytSao)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo2} size = {50}
                                    text={{content: "Nụ Hôn", layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.Kiss)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo3} size = {50}
                                    text={{content: "Cười", layout: 2}} textStyle={styles.textEmoji} 
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.Smile)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo4} size = {50}
                                    text={{content: "Hò Reo", layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.HoRep)}
                                    />
                            </Col>
                        </Row>
                        <Row size={1}>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo5} size = {50}
                                    text={{content: "Chấm Điểm", layout: 2}} textStyle={styles.textEmoji} 
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.ChamDiem)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo6} size = {50}
                                    text={{content: "Vỗ Tay", layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.VoTay)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo7} size = {50}
                                    text={{content: "Tặng Hoa", layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.TangHoa)}
                                    />
                            </Col>
                            <Col size = {1} style={styles.inner}>
                                <IconRippe vector={false} iconSource = {GLOBALS.Emo8} size = {50}
                                    text={{content: "Triệu Like", layout: 2}} textStyle={styles.textEmoji}
                                    onPress={this.effectClick.bind(this,GLOBALS.EMOJI.Like)}
                                    />
                            </Col>
                        </Row>
                    </Grid>
                </View>
                {/* <View style={{height:50,width:'100%', backgroundColor:"#444083"}}>
                    <IconRippe vector={true} name={""}
                        text={{content: "Hủy", layout: 1}} textStyle={styles.textButton}
                    />
                </View> */}
        </View>);
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
    }
})
