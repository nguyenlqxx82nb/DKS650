import React from "react";
import { StyleSheet, Text,View } from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import { Grid, Col, Row } from "react-native-easy-grid";
import LinearGradient from 'react-native-linear-gradient';
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister } from 'react-native-event-listeners';
import Header from '../Header/header3';
import Language from '../../DataManagers/Language';
//import SongListScreen from '../BaiHat/SongListScreen';

export default class TheloaiScreen extends BaseScreen {
    static propTypes = {
        onBack: PropTypes.func,
    };
    constructor(props) {
        super(props);
    }

    _onBack = () => {
        const { onBack } = this.props;
        if (onBack) {
            onBack();
        }
    }
    _showCompleted = () => {
        //this._songTabs.loadData(this._searchInput.getValue(),this._sex);
    }
    _onSearch = (value) => {
        //this._songTabs.searchData(value,this._sex);
    }
    _showOptOverlay = () => {
        // EventRegister.emit('ShowOptOverlay', {id:-1,overlayType:GLOBALS.SING_OVERLAY.SINGER});
    }
    _openTheloaiSong = (type, name) => {
        // this.theloaiSong.updateSongType(GLOBAL.type, name);
        // this.theloaiSong.show();
        EventRegister.emit("OpenTypeSong",{type:type,name:name})
    }
    renderContent = () =>{
        const {searchHolder} = this.props;
        if(!this.props.preLoad || this._allowLoad){ 
        }
    }
    renderContentView = () => {
        var button = {}, textButton = {};
        if(GLOBALS.MOBILE_SMALL){
            textButton.fontSize = 17;
            button.margin = 8;
        }


        return (
            <View style={{ flex: 1, position: "relative" }}>
                <View style={{ flex: 1 }}>
                    <View style={styles.headerContainer}>
                        <Header 
                            onBack={()=>{this.props.onBack()}} 
                            style = {{height:GLOBALS.HEADER_HEIGHT}}
                            left = {<Text style={[GLOBALS.TITLE]}>
                                        {Language.Strings.tl.toUpperCase()}
                                    </Text>}
                        />
                    </View>

                    <View style={{ flex: 1, margin: 5, backgroundColor: "transparent" }}>
                        <Grid>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                            colors={['#07E2BF', '#35A1D1', '#6C54E7', '#9F0BFC']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.DJ, Language.Strings.theloai.remix)}
                                            text={{ content: Language.Strings.theloai.remix, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                    colors={['#37FAFD', '#809FD8', '#C14EB8', '#F60C9E']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.TRE, Language.Strings.theloai.nhactre)}
                                            text={{ content: Language.Strings.theloai.nhactre, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                    colors={['#FFD800', '#FFB900', '#FF7D00', '#FF6500']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.VANG, Language.Strings.theloai.nhacvang)}
                                            text={{ content: Language.Strings.theloai.nhacvang, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                    colors={['#FFA794', '#FF7E80', '#FF4261', '#FF1048']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.DO, Language.Strings.theloai.nhacdo)}
                                            text={{ content: Language.Strings.theloai.nhacdo, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                    colors={['#52E96C', '#37D38D', '#13B5B9', '#05A9CB']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.SONGCA, Language.Strings.theloai.songca)}
                                            text={{ content: Language.Strings.theloai.songca, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                        colors={['#2A9BFB', '#6196E6', '#B48DC5', '#D78AB8']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.TN,Language.Strings.theloai.thieunhi)}
                                            text={{ content: Language.Strings.theloai.thieunhi, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                    colors={['#C3209B', '#B61FAF', '#9F1ED1', '#861CF7']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.LK, Language.Strings.theloai.lienkhuc)}
                                            text={{ content: Language.Strings.theloai.lienkhuc, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                    colors={['#F36010', '#C7584B', '#864DA1', '#4B42F0']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.SN, Language.Strings.theloai.sinhnhat)}
                                            text={{ content: Language.Strings.theloai.sinhnhat, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                    colors={['#FF8BE2', '#FF99B2', '#FFAC73', '#FFCB09']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.XUAN, Language.Strings.theloai.nhacxuan)}
                                            text={{ content: Language.Strings.theloai.nhacxuan, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                    colors={['#B56CFE', '#C24EB9', '#D2275C', '#E1040B']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.TRINH, Language.Strings.theloai.nhactrinh)}
                                            text={{ content: Language.Strings.theloai.nhactrinh, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                    colors={['#13C7AB', '#5E9CC2', '#A774D7', '#F14BED']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.NHACTRINH, Language.Strings.theloai.cailuong)}
                                            text={{ content: Language.Strings.theloai.cailuong, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                    colors={['#00CBFF', '#1AA5F2', '#367CE4', '#613ACE']} style={[styles.button,button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.DC, Language.Strings.theloai.danca)}
                                            text={{ content: Language.Strings.theloai.danca, layout: 1 }} textStyle={[styles.textButton,textButton]} />
                                    </LinearGradient>
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
    headerContainer: {
        flexDirection: "row",
        height: 45
    },
    button: {
        margin: 10,
        flex: 1,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },

    title: {
        fontSize: 20,
        fontWeight: '300',
        paddingLeft: 10,
        //  marginLeft:5,
        color: "#fff",
        // flex:1,
        fontFamily: GLOBALS.FONT.BOLD
    },

    textButton: {
        fontFamily: GLOBALS.FONT.BOLD,
        fontSize: 20,
        //marginLeft: 15,
        color: "#fff"
    },

})
