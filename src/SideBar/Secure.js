import React from "react";
import { StyleSheet, Text,View} from "react-native";
import PropTypes from 'prop-types';
import IconRippe from '../Components/IconRippe.js'
import { Col, Grid, Row } from "react-native-easy-grid";
import GLOBALS from '../DataManagers/Globals.js';
import PassInput from './PassInput';
import Header from '../Screens/Header/header3';
import {EventRegister} from 'react-native-event-listeners';
import Utils from '../Utils/Utils';
import Language from '../DataManagers/Language';

export default class Secure extends React.Component {
    static propTypes = {
        onBack: PropTypes.func,
        onHide: PropTypes.func
    };
    static defaultProps = {
    }
    constructor(props) {
        super(props);
    }
    
    _handleAddNumber = (number)=>{
        this._passInput.AddNumber(number);
    }
    _removeText = () =>{
        this._passInput.RemoveText();
    }
    render = () => {
        var maxSize = Math.max(Utils.Width(),Utils.Height());
        var inputSize = {};
        var containerSize = {},title={},textNumber={};

        if(!GLOBALS.LANDSCAPE){
            if(!GLOBALS.MOBILE_SMALL){
                inputSize.width = 290;
                inputSize.height = 60;

                containerSize.width= 290;
                containerSize.height=250;
            }
            else{
                inputSize.width = 270;
                inputSize.height = 50;

                containerSize.width= 270;
                containerSize.height=220;
                title={fontSize:22};
                textNumber={fontSize:25};
            }
            
            return (
                <View style={{flex:1}}>
                    <View style={{height:45, width:"100%",justifyContent:"center",alignItems:"center"}}>
                        <Header 
                            onBack={()=>{this.props.onBack()}} 
                            style = {{height:GLOBALS.HEADER_HEIGHT}}
                            left = {<Text style={[GLOBALS.TITLE]}>
                                        {Language.Strings.mk.toUpperCase()}
                                    </Text>}  />
                    </View>    
                    <View style={{ flex: 1,backgroundColor:"transparent",justifyContent:"center",alignItems:"center"}}>
                        <Text style={[styles.title,title]}>{Language.Strings.nmk.toUpperCase()}</Text>
                        <View style={inputSize}>
                            <PassInput 
                                    ref = {ref=>(this._passInput = ref)}
                                    onSuccess = {()=>{
                                        setTimeout(()=>{
                                            setTimeout(()=>{
                                                this.props.onBack();
                                            },250);
                                            EventRegister.emit("OpenAdminScreen",{});   
                                        },200);
                                    }}
                                />
                        </View>
                        

                        <View style={[styles.numberContainer,containerSize]}>
                            <Grid >
                                <Row size={1}>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "1", layout: 1}} textStyle={[styles.textNumber,textNumber]}
                                                onPress={this._handleAddNumber.bind(this,"1")} />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "2", layout: 1}} textStyle={[styles.textNumber,textNumber]} 
                                                onPress={this._handleAddNumber.bind(this,"2")} />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "3", layout: 1}} textStyle={[styles.textNumber,textNumber]} 
                                                onPress={this._handleAddNumber.bind(this,"3")} />
                                        </View>
                                    </Col>
                                </Row>
                                <Row size={1}>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "4", layout: 1}} textStyle={[styles.textNumber,textNumber]} 
                                                onPress={this._handleAddNumber.bind(this,"4")} />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "5", layout: 1}} textStyle={[styles.textNumber,textNumber]}
                                                onPress={this._handleAddNumber.bind(this,"5")} />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "6", layout: 1}} textStyle={[styles.textNumber,textNumber]} 
                                                onPress={this._handleAddNumber.bind(this,"6")} />
                                        </View>
                                    </Col>
                                </Row>
                                <Row size={1}>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "7", layout: 1}} textStyle={[styles.textNumber,textNumber]} 
                                                onPress={this._handleAddNumber.bind(this,"7")} />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "8", layout: 1}} textStyle={[styles.textNumber,textNumber]}
                                                onPress={this._handleAddNumber.bind(this,"8")}  />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "9", layout: 1}} textStyle={[styles.textNumber,textNumber]} 
                                                onPress={this._handleAddNumber.bind(this,"9")} />
                                        </View>
                                    </Col>
                                </Row>
                                <Row size={1}>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                        
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "0", layout: 1}} textStyle={[styles.textNumber,textNumber]} 
                                                onPress={this._handleAddNumber.bind(this,"9")}/>
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: Language.Strings.remove, layout: 1}} textStyle={[styles.textNumber,textNumber]}
                                                onPress={this._removeText}/>
                                        </View>
                                    </Col>
                                </Row>
                            </Grid>
                        </View>
                    </View>
                </View>
                
            );
        }
        else{
            if(GLOBALS.LANDSCAPE_SMALL){
                inputSize.width = 320;
                inputSize.height = 45;
                
                containerSize.width= 320;
                containerSize.height=270;
            }
            else if(GLOBALS.LANDSCAPE_NORMAL){
                inputSize.width = 350;
                inputSize.height = 50;
                
                containerSize.width= 350;
                containerSize.height=300;
            }
            else if(GLOBALS.LANDSCAPE_LARGE){
                inputSize.width = 400;
                inputSize.height = 55;
                
                containerSize.width= 400;
                containerSize.height= 320;
            }
            
            return (
                <View style={{flex:1}}>
                    <View style={{height:GLOBALS.HEADER_HEIGHT, width:"100%",justifyContent:"center",alignItems:"center"}}>
                        <Header 
                                onBack={()=>{this.props.onBack()}} 
                                style = {{height:GLOBALS.HEADER_HEIGHT}}
                                left = {<Text style={[GLOBALS.TITLE]}>
                                            {Language.Strings.mk.toUpperCase()}
                                        </Text>}  />
                    </View>

                    <View style={{ flex: 1,backgroundColor:"transparent",justifyContent:"center",alignItems:"center"}}>
                        <Text style={[styles.title]}>{Language.Strings.nmk.toUpperCase()}</Text>
                        <View style={inputSize}>
                            <PassInput 
                                    ref = {ref=>(this._passInput = ref)}
                                    onSuccess = {()=>{
                                        setTimeout(()=>{
                                            setTimeout(()=>{
                                                this.props.onBack();
                                            },250);
                                            EventRegister.emit("OpenAdminScreen",{});   
                                        },200);
                                    }}
                                />
                        </View>

                        <View style={[styles.numberContainer,containerSize]}>
                            <Grid >
                                <Row size={1}>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "1", layout: 1}} textStyle={styles.textNumber}
                                                onPress={this._handleAddNumber.bind(this,"1")} />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "2", layout: 1}} textStyle={styles.textNumber} 
                                                onPress={this._handleAddNumber.bind(this,"2")} />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "3", layout: 1}} textStyle={styles.textNumber} 
                                                onPress={this._handleAddNumber.bind(this,"3")} />
                                        </View>
                                    </Col>
                                </Row>
                                <Row size={1}>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "4", layout: 1}} textStyle={styles.textNumber} 
                                                onPress={this._handleAddNumber.bind(this,"4")} />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "5", layout: 1}} textStyle={styles.textNumber}
                                                onPress={this._handleAddNumber.bind(this,"5")} />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "6", layout: 1}} textStyle={styles.textNumber} 
                                                onPress={this._handleAddNumber.bind(this,"6")} />
                                        </View>
                                    </Col>
                                </Row>
                                <Row size={1}>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "7", layout: 1}} textStyle={styles.textNumber} 
                                                onPress={this._handleAddNumber.bind(this,"7")} />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "8", layout: 1}} textStyle={styles.textNumber}
                                                onPress={this._handleAddNumber.bind(this,"8")}  />
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "9", layout: 1}} textStyle={styles.textNumber} 
                                                onPress={this._handleAddNumber.bind(this,"9")} />
                                        </View>
                                    </Col>
                                </Row>
                                <Row size={1}>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                        
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: "0", layout: 1}} textStyle={styles.textNumber} 
                                                onPress={this._handleAddNumber.bind(this,"9")}/>
                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <View style={styles.buttonContainer}>
                                            <IconRippe name={""}
                                                text={{content: Language.Strings.remove, layout: 1}} textStyle={styles.textNumber}
                                                onPress={this._removeText}/>
                                        </View>
                                    </Col>
                                </Row>
                            </Grid>
                        </View>
                    </View>
                </View>
                
            );
        }
        
    }
}

const styles = StyleSheet.create({
    numberContainer: {
        width:300,
        height:260,
        // alignItems: "center", 
        // justifyContent: "center",
        marginTop:30,
        //backgroundColor:"red"
    },
    buttonContainer:{
        flex:1,
        margin:(GLOBALS.MOBILE_SMALL)?4:6,
        borderRadius:10,
        backgroundColor:GLOBALS.COLORS.MAIN,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    title: {
        fontSize:20,
        //fontWeight: '300',
        color:"#fff",
        fontFamily:GLOBALS.FONT.BOLD,
        marginBottom:10
    },
   
    error :{
        borderWidth :1,
        borderColor: GLOBALS.COLORS.ERROR
    },
    textNumber:{
        fontFamily:GLOBALS.FONT.MEDIUM,
        fontSize:30,
        alignItems:"center",
        justifyContent:"center",
        color:"#fff"
    }

})
