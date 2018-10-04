import React from "react";
import { StyleSheet, Text,View } from "react-native";
import BaseScreen from "../ScreenBase.js"
import PropTypes from 'prop-types';
import IconRippe from '../../Components/IconRippe.js'
import { Grid, Col, Row } from "react-native-easy-grid";
import LinearGradient from 'react-native-linear-gradient';
import GLOBALS from '../../DataManagers/Globals.js';
import { EventRegister } from 'react-native-event-listeners';
import Header from '../Header/header1';
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
    renderContentView = () => {
        return (
            <View style={{ flex: 1, position: "relative" }}>
                <View style={{ flex: 1 }}>
                    <View style={styles.headerContainer}>
                        <Header title={"THỂ LOẠI"} onBack={()=>{this.props.onBack()}} 
                            style = {{height:GLOBALS.HEADER_HEIGHT}}
                        />
                    </View>

                    <View style={{ flex: 1, margin: 5, backgroundColor: "transparent" }}>
                        <Grid>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#07E2BF', '#35A1D1', '#6C54E7', '#9F0BFC']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.DJ, "DJ Hot")}
                                            text={{ content: "DJ Hot", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#37FAFD', '#809FD8', '#C14EB8', '#F60C9E']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.TRE, "Nhạc Trẻ")}
                                            text={{ content: "Nhạc Trẻ", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FFD800', '#FFB900', '#FF7D00', '#FF6500']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.VANG, "Nhạc Vàng")}
                                            text={{ content: "Nhạc Vàng", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FFA794', '#FF7E80', '#FF4261', '#FF1048']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.DO, "Nhạc Đỏ")}
                                            text={{ content: "Nhạc Đỏ", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#52E96C', '#37D38D', '#13B5B9', '#05A9CB']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.SONGCA, "Song Ca")}
                                            text={{ content: "Song Ca", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#2A9BFB', '#6196E6', '#B48DC5', '#D78AB8']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.TN, "Thiếu Nhi")}
                                            text={{ content: "Thiếu Nhi", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#C3209B', '#B61FAF', '#9F1ED1', '#861CF7']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.LK, "Liên Khúc")}
                                            text={{ content: "Liên Khúc", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#F36010', '#C7584B', '#864DA1', '#4B42F0']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.SN, "Sinh Nhật")}
                                            text={{ content: "Sinh Nhật", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FF8BE2', '#FF99B2', '#FFAC73', '#FFCB09']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.XUAN, "Nhạc Xuân")}
                                            text={{ content: "Nhạc Xuân", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#B56CFE', '#C24EB9', '#D2275C', '#E1040B']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.TRINH, "Nhạc Trịnh")}
                                            text={{ content: "Nhạc Trịnh", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#13C7AB', '#5E9CC2', '#A774D7', '#F14BED']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.NHACTRINH, "Cải Lương")}
                                            text={{ content: "Cải Lương", layout: 1 }} textStyle={styles.textButton} />
                                    </LinearGradient>
                                </Col>
                                <Col size={1}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#00CBFF', '#1AA5F2', '#367CE4', '#613ACE']} style={[styles.button]}>
                                        <IconRippe vector={true} name={""}
                                            onPress={this._openTheloaiSong.bind(this, GLOBALS.SONG_TYPE.DC, "Dân Ca")}
                                            text={{ content: "Dân Ca", layout: 1 }} textStyle={styles.textButton} />
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
        height: 50
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
