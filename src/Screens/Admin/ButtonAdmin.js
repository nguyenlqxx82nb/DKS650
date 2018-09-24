import React from "react";
import {StyleSheet,TextInput, View} from "react-native";
import GLOBALS from "../../DataManagers/Globals";
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe';

export default class ButtonAdmin extends React.Component
{   
    static propTypes = {
        title: PropTypes.string,
        onPress : PropTypes.func,
    };
    static defaultProps = {
        title : "Lưu lại"
    }

    constructor(props) {
        super(props);
    }
    
    render() {
        const {title} = this.props;
        return(
            <View style={{marginTop:20,borderRadius:20,
                height:50,width:"100%",backgroundColor:"#444083"}}>
                      <IconRippe vector={true} name={""} fit = {true}
                              text={{content:title, layout: 1}} 
                              textStyle={styles.textButton}
                              onPress = {()=>{
                                  if(this.props.onPress != null)
                                    this.props.onPress();
                              }}
                              />
            </View>
        );
    }
} 

const styles = StyleSheet.create({
    textButton: {
        fontFamily: GLOBALS.FONT.BOLD,
        fontSize: 18, 
        color:"#fff"
    },
})
