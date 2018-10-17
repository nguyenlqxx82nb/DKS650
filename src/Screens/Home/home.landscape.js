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
import Language from '../../DataManagers/Language';
import Header from '../Header/header3';

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
       // var width1 = (Utils.Width()-80)*0.68/(0.68*2+1) - 6;
        var width2 = (Utils.Width()-80)/(0.68*2+1) - 6;
        //var width3 = (width2 - 6)/2;
        var logo_width = 70;
        var paddings = [45,55,55,45];
        var margin = 6;
        var icon_sizes = [90,80,60,60,90];
        var size = 20;
        if(GLOBALS.LANDSCAPE_NORMAL){
            logo_width = 80;
            paddings = [55,60,60,55];
            margin = 8;
            icon_sizes = [110,100,70,70,110];
            size = 22;
        }
        else if(GLOBALS.LANDSCAPE_LARGE){
            logo_width = 100;
            paddings = [55,65,65,55];
            margin = 12;
            icon_sizes = [140,130,100,100,140];
            size = 24;
        }

        return (
            <View style={{ flex: 1,width:"100%"}}>
                {/* <View style={{height: 40,width:"100%"}}>
                   <TuKhoaHot />
                </View> */}
                <View style={{ flexDirection: "row", marginTop: 0, height: GLOBALS.HEADER_HEIGHT }}>
                    <Header 
                        back={false}
                        left={<View style={{ width: GLOBALS.ICON_SIZE*2.5, height: "100%", marginLeft: 0 }}>
                                <IconRippe 
                                    vector={true} 
                                    name="menu" 
                                    size={GLOBALS.ICON_SIZE} 
                                    color="#fff"
                                    onPress={() =>{
                                        if(this.props.onOpenMenu != null)
                                            this.props.onOpenMenu();
                                    }} />
                            </View>}
                        center  = {
                            <AutoHeightImage source={logo} width={logo_width} ></AutoHeightImage>    
                        }
                    />          
                </View>
                <View style={{ flex: 1, paddingLeft: paddings[2], paddingRight: paddings[1],paddingTop:paddings[0],paddingBottom:paddings[3]}}>
                    <Grid>
                        <Row>
                            <Col size={0.7}>
                                <LinearGradient start={{ x: 0.0, y: 0 }} end={{ x: 0.9, y: 0.7 }} colors={['#FF8888', '#EE4B4C', '#DB0909']} 
                                    style={[styles.container3,{marginRight:margin}]}>
                                    <IconRippe vector={true} name="hotOpt" size={icon_sizes[0]} 
                                        text={{content: Language.Strings.baihot.toUpperCase(), layout: 2}}
                                        textStyle={[styles.labelBottom,{fontSize:size}]}  
                                        onPress={()=>{
                                            if(this.props.onOpenHotSong != null){
                                                this.props.onOpenHotSong();
                                            }}
                                        } />
                                </LinearGradient>
                            </Col>
                            <Col size={1}>
                                <Row size={1}>
                                    <LinearGradient colors={['#D1EB3F', '#6DCD34', '#0AAF29']} style={[styles.container3,{marginRight:0,marginBottom:margin/2}]}>
                                            <IconRippe vector={true} name="singerOpt" size={icon_sizes[1]} text={{
                                                content: Language.Strings.casy.toUpperCase(), layout: 1 }}
                                                textStyle = {[styles.labelBottom,{marginTop:30, marginLeft:25,fontSize:size}]}
                                                onPress={()=>{
                                                    if(this.props.onOpenSinger != null){
                                                        this.props.onOpenSinger();
                                                    }}} />
                                    </LinearGradient>
                                </Row>
                                <Row size={1}>
                                    <Col size={1}>
                                        <LinearGradient start={{ x: 0.0, y: 0 }} end={{ x: 0.9, y: 0.7 }}
                                            locations={[0.3, 0.6, 1]} colors={['#FFF70A', '#FFBB06', '#FF5A01']} 
                                            style={[styles.container3,{marginRight:margin/2,marginTop:margin/2}]}>
                                            <IconRippe vector={true} name="singOpt" 
                                                size={icon_sizes[2]} 
                                                text={{content: Language.Strings.baihat.toUpperCase(), layout: 2,}} 
                                                textStyle = {[styles.labelBottom,{fontSize:size}]}
                                                onPress={()=>{
                                                    if(this.props.onOpenSong != null){
                                                        this.props.onOpenSong();
                                                    }}} />
                                        </LinearGradient>             
                                    </Col>
                                    <Col size={1}>
                                        <LinearGradient colors={['#FF99CC', '#BD4ED4', '#7F08DC']} 
                                            style={[styles.container3,{marginLeft:margin/2,marginTop:margin/2,marginRight:0}]}>
                                            <IconRippe 
                                                vector={true} 
                                                name="theloai" 
                                                size={icon_sizes[3]} 
                                                onPress = {()=>{ if(this.props.onOpenTheloai != null)
                                                                        this.props.onOpenTheloai()}}
                                                text={{content: Language.Strings.tl.toUpperCase(), layout: 2}}
                                                textStyle = {[styles.labelBottom,{fontSize:size}]} />
                                        </LinearGradient>
                                    </Col>
                                </Row>
                            </Col>
                            <Col size={0.7}>
                                <LinearGradient start={{ x: 0.0, y: 0 }} end={{ x: 0.9, y: 0.7 }}
                                    locations={[0.1, 0.4, 1]} colors={['#7DC4E3', '#59A3DB', '#3481D3']} 
                                        style={[styles.container3,{marginRight:0,marginLeft:margin}]}>
                                        <IconRippe vector={true} name="musicOnline" 
                                            size={icon_sizes[4]} 
                                            text={{content: Language.Strings.online.toUpperCase(), layout: 2,}}
                                            textStyle = {[styles.labelBottom,{fontSize:size}]} 
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
