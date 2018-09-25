import React from "react";
import { StyleSheet,View,Text,ScrollView} from "react-native";
import PropTypes from 'prop-types';
import ScreenBase from '../ScreenBase.js';
import AutoHeightImage from 'react-native-auto-height-image';
import { Col, Grid, Row } from "react-native-easy-grid";
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from '../../DataManagers/Globals'
import LinearGradient from 'react-native-linear-gradient';
import ListItem from '../../Components/ListItem.js';
import Utils from '../../Utils/Utils';
import TuKhoaHot from '../../Views/TukhoaHot';

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
        var width1 = (Utils.Width()-80)*0.68/(0.68*2+1) - 6;
        var width2 = (Utils.Width()-80)/(0.68*2+1) - 6;
        var width3 = (width2 - 6)/2;
        return (
            <View style={{ flex: 1,width:"100%"}}>
                <View style={styles.headerContainer}>
                    <View style={{ width: 40, height: 40, marginLeft: 5 }}>
                            <IconRippe vector={true} name="menu" size={20} color="#fff"
                                onPress={() =>{
                                    //this.props.navigation.navigate("DrawerOpen");
                                    if(this.props.onOpenMenu != null)
                                        this.props.onOpenMenu();
                                }} />
                    </View>
                    <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                        <AutoHeightImage source={logo} width={70} ></AutoHeightImage>
                    </View>
                    <View style={{ width: 40, height: 40}}>
                            <IconRippe vector={true} name="wifi" size={20}
                                color={GLOBALS.COLORS.SELECTED}
                                onPress={onOpenSearch} />
                    </View>

                    <View style={{ width: 40, height: 40, marginRight: 5 }}>
                            <IconRippe vector={true} name="search" size={20} color="#fff"
                                onPress={onOpenSearch} />
                    </View>
                </View>
                <TuKhoaHot />

                <View style={{ flex: 1, paddingLeft: 50, paddingRight: 50,paddingTop:40,paddingBottom:40}}>
                    <Grid>
                        <Row>
                            <Col size={0.68}>
                                <LinearGradient start={{ x: 0.0, y: 0 }} end={{ x: 0.9, y: 0.7 }} colors={['#FF8888', '#EE4B4C', '#DB0909']} style={[styles.container3]}>
                                    <IconRippe vector={true} name="hotOpt" size={80} text={{content: "BÀI HOT", layout: 2}}
                                        textStyle={styles.labelBottom}  
                                        onPress={()=>{
                                            if(this.props.onOpenHotSong != null){
                                                this.props.onOpenHotSong();
                                            }}} />
                                </LinearGradient>
                            </Col>
                            <Col size={0.98}>
                                <Row size={1}>
                                    <LinearGradient colors={['#D1EB3F', '#6DCD34', '#0AAF29']} style={[styles.container3,{marginRight:0}]}>
                                            <IconRippe vector={true} name="singerOpt" size={70} text={{
                                                content: "CA SỸ", layout: 1 }} textStyle = {[styles.labelBottom,{marginTop:30, marginLeft:25}]}
                                                onPress={()=>{
                                                    if(this.props.onOpenSinger != null){
                                                        this.props.onOpenSinger();
                                                    }}} />
                                    </LinearGradient>
                                </Row>
                                <Row size={1}>
                                    <Col size={1}>
                                        <LinearGradient start={{ x: 0.0, y: 0 }} end={{ x: 0.9, y: 0.7 }}
                                            locations={[0.3, 0.6, 1]} colors={['#FFF70A', '#FFBB06', '#FF5A01']} style={[styles.container3,{marginRight:3,marginTop:6}]}>
                                            <IconRippe vector={true} name="singOpt" size={50} text={{content: "BÀI HÁT", layout: 2,}} 
                                                textStyle = {[styles.labelBottom]}
                                                onPress={()=>{
                                                    if(this.props.onOpenSong != null){
                                                        this.props.onOpenSong();
                                                    }}} />
                                        </LinearGradient>             
                                    </Col>
                                    <Col size={1}>
                                        <LinearGradient colors={['#FF99CC', '#BD4ED4', '#7F08DC']} style={[styles.container3,{marginLeft:3,marginTop:6,marginRight:0}]}>
                                            <IconRippe vector={true} name="theloai" size={50} 
                                                onPress = {()=>{ if(this.props.onOpenTheloai != null)
                                                                        this.props.onOpenTheloai()}}
                                            text={{content: "THỂ LOẠI", layout: 2}} textStyle = {styles.labelBottom} />
                                        </LinearGradient>
                                    </Col>
                                </Row>
                            </Col>
                            <Col size={0.68}>
                                <LinearGradient start={{ x: 0.0, y: 0 }} end={{ x: 0.9, y: 0.7 }}
                                    locations={[0.1, 0.4, 1]} colors={['#7DC4E3', '#59A3DB', '#3481D3']} style={[styles.container3,{marginRight:0,marginLeft:6}]}>
                                        <IconRippe vector={true} name="musicOnline" size={80} text={{
                                        content: "NHẠC ONLINE", layout: 2,}} textStyle = {styles.labelBottom} 
                                        onPress={()=>{
                                            if(this.props.onOnlineScreen != null){
                                                this.props.onOnlineScreen();
                                            }}} />
                                </LinearGradient>                
                            </Col>
                        </Row>
                    </Grid>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer:{
        flexDirection: "row",
        alignItems:"center", 
        height: 45
    },
    container_center: {
        justifyContent: "center", alignItems: "center"
    },
    
    container3: {
        flex: 1,
        borderRadius: 5,
        marginRight:6,
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
