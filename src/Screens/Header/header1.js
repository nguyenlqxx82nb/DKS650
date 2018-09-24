import React from "react";
import { View,StyleSheet, Text} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals';

export default class Header extends React.Component {
    static propTypes = {
        onBack: PropTypes.func,
        style : Text.propTypes.style,
    };
    static defaultProps = {
        style : {}
    };
    constructor(props) {
        super(props);
    }
    render() {
        const {title} = this.props;
        return (
            <View style={[styles.container,this.props.style]}>
                <View style={{ width: 40, height: 40, marginLeft: 0 }}>
                    <IconRippe vector={true} name="back" size={20} color="#fff"
                        onPress={()=>{
                            if(this.props.onBack != null){
                                //this._searchInput.blur();
                                this.props.onBack();
                            }
                        }}
                    />
                </View>
                <View
                    ref = {ref =>(this._centerView = ref)}
                    style={{flex:1,justifyContent:"center",alignItems:"flex-start"}}>
                        <Text style={[styles.title]}>{title}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "center",
        width:'100%',
        height:60
    },
    title: {
        fontSize: 20,
        fontWeight: '300',
        //paddingLeft:20,
        marginLeft:10,
        color:"#fff",
       // flex:1,
        fontFamily:GLOBALS.FONT.MEDIUM
    },
   
})
