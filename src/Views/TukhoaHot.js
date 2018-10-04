import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import PropTypes from 'prop-types';
import GLOBALS from '../DataManagers/Globals'
import ListItem from '../Components/ListItem.js';

const tukhoas = [
    "Giấc mơ e chờ - Chi Dân",
    "Chạy ngay đi - Sơn Tùng MTP",
    "Đừng như thói quen - Saralưu",
    "Đừng quên tên anh - Hoa Vinh",
    "Chạm đáy nỗi đau - Nguyên LÊ",
    "Đừng như thói quen - Saralưu",
]

export default class TuKhoaHot extends React.Component {
    static propTypes = {
        onSelectChannel : PropTypes.func
    };

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        //console.warn(" componentWillMount HomeScreen");
    }
    render() {
        return (
            <View style={{ flex:1, justifyContent: "flex-start", alignItems: "center", flexDirection: "row" }}>
                {/* <Text style={styles.titleHot}>TỪ KHÓA HOT</Text> */}
                <ScrollView
                    style={{height:40}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    // style={{ marginLeft: 20 }}
                    contentContainerStyle ={{
                        paddingLeft:0,
                        alignItems:"center"
                    }}
                >
                {
                    tukhoas.map((item, index) => {
                        //console.warn("thumb url = "+item.thumb);
                        return (
                            <View 
                                key={index}
                                style={styles.containerItemHot}>
                                <ListItem 
                                    rippleRound={true}
                                    style={styles.listItemHot}
                                    onPress={() => {
                                        ///var res = item.title.replace(" ", "+");
                                        if(this.props.onSelectChannel != null)
                                            this.props.onSelectChannel(item);
                                    }}
                                >
                                    <Text style={styles.titleHotItem}>{item}</Text>
                                </ListItem>
                            </View>
                            ) ;
                    })
                }  
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleHot: {
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 13,
        color: "#fff",
        marginLeft: 20
    },

    containerItemHot: {
        height: 36,
        borderWidth: 0,
        borderColor: "#fff",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
        // backgroundColor:"#3D4B84",
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // elevation: 2,
    },

    listItemHot: {
        height: 30,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 10,
        paddingRight: 10,
    },

    titleHotItem: {
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 16,
        color: "#fff",

    }
})
