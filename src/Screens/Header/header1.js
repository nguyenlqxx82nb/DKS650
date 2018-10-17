import React from "react";
import { View,StyleSheet, Text} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals';

export default class Header extends React.Component {
    static propTypes = {
        onBack: PropTypes.func,
        style : Text.propTypes.style,
        back : PropTypes.bool
    };
    static defaultProps = {
        style : {},
        back : true
    };
    constructor(props) {
        super(props);
    }
    render() {
        const {title,back} = this.props;
        return (
            <View style={[styles.container,this.props.style]}>
                {back && <View style={{ width: GLOBALS.ICON_SIZE*2.5, height: "100%", marginLeft: 0 }}>
                    <IconRippe vector={true} name="back" size={GLOBALS.ICON_SIZE} color="#fff"
                        onPress={()=>{
                            if(this.props.onBack != null){
                                //this._searchInput.blur();
                                this.props.onBack();
                            }
                        }}
                    />
                </View>}
                
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
        height:40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        elevation: 5,
        backgroundColor :GLOBALS.COLORS.HEADER,
    },
    title: {
        fontSize: 20,
        fontWeight: '300',
        //paddingLeft:20,
        marginLeft:10,
        color:"#fff",
       // flex:1,
        fontFamily:GLOBALS.FONT.BOLD
    },
   
})
