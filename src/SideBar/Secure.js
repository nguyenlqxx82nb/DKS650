import React from "react";
import { StyleSheet, Text,View} from "react-native";
import PropTypes from 'prop-types';
import IconRippe from '../Components/IconRippe.js'
import { Col, Grid, Row } from "react-native-easy-grid";
import GLOBALS from '../DataManagers/Globals.js';
import PassInput from './PassInput';
import Header from '../Screens/Header/header1';
import {EventRegister} from 'react-native-event-listeners';

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
        return (
            <View style={{flex:1}}>
                <Header title={"Mật Khẩu"} onBack={()=>{this.props.onBack()}} />

                <View style={{ flex: 1,backgroundColor:"transparent",justifyContent:"center",alignItems:"center"}}>
                    <Text style={styles.title}>NHẬP MẬT KHẨU</Text>
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

                    <View style={styles.numberContainer}>
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
                                            text={{content: "Xóa", layout: 1}} textStyle={styles.textNumber}
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
        margin:6,
        borderRadius:10,
        backgroundColor:GLOBALS.COLORS.MAIN,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        //fontWeight: '300',
        color:"#fff",
        fontFamily:GLOBALS.FONT.REGULAR,
        marginBottom:15
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
