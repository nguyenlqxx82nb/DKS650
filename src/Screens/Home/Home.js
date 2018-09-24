import React from "react";
import { StyleSheet,View} from "react-native";
import PropTypes from 'prop-types';
import ScreenBase from '../ScreenBase.js';

import AutoHeightImage from 'react-native-auto-height-image';
import { Col, Grid, Row } from "react-native-easy-grid";
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from '../../DataManagers/Globals'
import LinearGradient from 'react-native-linear-gradient';

const logo = require("../../../assets/logo.png");

export default class HomeScreen extends ScreenBase {
    static propTypes = {
        onOpenSearch: PropTypes.func,
        onOpenSinger : PropTypes.func,
        onOpenTheloai : PropTypes.func,
        onOpenSong : PropTypes.func,
        onOpenHotSong: PropTypes.func,
        onOnlineScreen : PropTypes.func,
        onOpenMenu : PropTypes.func
    };
    
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        //console.warn(" componentWillMount HomeScreen");
    }
    renderContentView = () => {
        const { onOpenSearch,onOpenSinger } = this.props;
        return (
            <View style={{ flex: 1,width:"100%"}}>
                <View style={{ flexDirection: "row",justifyContent:"flex-start", alignItems: "center", marginTop: 0, height: 50 }}>
                    <View style={{ width: 40, height: 40, marginLeft: 0 }}>
                        <IconRippe vector={true} name="menu" size={20} color="#fff"
                            onPress={() =>{
                                //this.props.navigation.navigate("DrawerOpen");
                                if(this.props.onOpenMenu != null)
                                    this.props.onOpenMenu();
                            }} />
                    </View>
                    <View style={{flex:1}}>
                        <AutoHeightImage source={logo} width={70} ></AutoHeightImage>
                    </View>
                    <View style={{ width: 40, height:40, marginLeft: 0 }}>
                            <IconRippe vector={true} name="search" size={20} color="#fff"
                                onPress={onOpenSearch} />
                    </View>
                </View>

                <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
                    <Grid>
                        <Row size={1}>
                            <Grid>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0.0, y: 0 }} end={{ x: 0.9, y: 0.7 }} colors={['#FF8888', '#EE4B4C', '#DB0909']} style={[styles.container3]}>
                                        <IconRippe vector={true} name="hotOpt" size={80} text={{content: "BÀI HOT", layout: 2}}
                                            textStyle={styles.labelBottom}  
                                            onPress={()=>{
                                                if(this.props.onOpenHotSong != null){
                                                    this.props.onOpenHotSong();
                                                }}} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0.0, y: 0 }} end={{ x: 0.9, y: 0.7 }}
                                        locations={[0.3, 0.6, 1]} colors={['#FFF70A', '#FFBB06', '#FF5A01']} style={[styles.container3]}>
                                        <IconRippe vector={true} name="singOpt" size={77} text={{content: "BÀI HÁT", layout: 2,}} 
                                            textStyle = {styles.labelBottom}
                                            onPress={()=>{
                                                if(this.props.onOpenSong != null){
                                                    this.props.onOpenSong();
                                                }}} />
                                    </LinearGradient>
                                </Col>
                            </Grid>
                        </Row>
                        <Row size={1}>
                            <Col size={1}>
                                <LinearGradient colors={['#D1EB3F', '#6DCD34', '#0AAF29']} style={[styles.container3]}>
                                    <IconRippe vector={true} name="singerOpt" size={77} text={{
                                        content: "CA SỸ", layout: 2 }} textStyle = {styles.labelBottom}
                                        onPress={()=>{
                                            if(this.props.onOpenSinger != null){
                                                this.props.onOpenSinger();
                                            }}} />
                                </LinearGradient>
                            </Col>
                            <Col size={1}>
                                <LinearGradient colors={['#FF99CC', '#BD4ED4', '#7F08DC']} style={[styles.container3]}>
                                    <IconRippe vector={true} name="theloai" size={77} 
                                        onPress = {()=>{ if(this.props.onOpenTheloai != null)
                                                                this.props.onOpenTheloai()}}
                                    text={{content: "THỂ LOẠI", layout: 2}} textStyle = {styles.labelBottom} />
                                </LinearGradient>
                            </Col>
                        </Row>
                        <Row size={1}>
                            <LinearGradient start={{ x: 0.0, y: 0 }} end={{ x: 0.9, y: 0.7 }}
                                locations={[0.1, 0.4, 1]} colors={['#7DC4E3', '#59A3DB', '#3481D3']} style={[styles.container3]}>
                                <IconRippe vector={true} name="musicOnline" size={80} text={{
                                    content: "NHẠC ONLINE", layout: 1,}} textStyle = {styles.labelRight} 
                                    onPress={()=>{
                                        if(this.props.onOnlineScreen != null){
                                            this.props.onOnlineScreen();
                                        }}} />
                            </LinearGradient>
                        </Row>
                    </Grid>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container_center: {
        justifyContent: "center", alignItems: "center"
    },
    
    container3: {
        flex: 1,
        borderRadius: 5,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    labelBottom:{
        fontFamily:"SF-Pro-Text-Medium",
        fontSize: 20,
        marginTop: 10,
        color:"#fff"
    },
    labelRight:{
        fontFamily:"SF-Pro-Text-Medium",
        fontSize: 20,
        marginLeft: 15,
        color:"#fff"
    },
})
