import React from "react";
import { Image,StyleSheet, View, Text, ScrollView } from "react-native";
import PropTypes from 'prop-types';
import GLOBALS from '../DataManagers/Globals'
import Database from '../DataManagers/DatabaseManager';
import ListItem from '../Components/ListItem.js';

export default class ChannelList extends React.Component {
    static propTypes = {
        onSelectChannel : PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state={
            data : [],
        }
        this.getData = this.getData.bind(this);
        this.getData();
    }
    componentDidMount() {
        //console.warn(" componentWillMount HomeScreen");
    }

    async getData(){
        await Database.getChannels((datas)=>{
            //console.warn(" data length = "+datas.length);
            this.setState({data:datas});
        },
        ()=>{

        }) 
    }
    render() {
        var _fontSize = 16;
        if(GLOBALS.LANDSCAPE_NORMAL){
            _fontSize = 17;
        }
        else if(GLOBALS.LANDSCAPE_LARGE){
            _fontSize = 18;
        }
        return (
            <View style={{ flex:1, justifyContent: "flex-start", alignItems: "center", flexDirection: "row" }}>
                {/* <Text style={styles.titleHot}>TỪ KHÓA HOT</Text> */}
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    // style={{ marginLeft: 20 }}
                    contentContainerStyle ={{
                        paddingLeft:0
                    }}
                >
                {
                    this.state.data.map((item, index) => {
                        //console.warn("thumb url = "+item.thumb);
                        return (
                            <View 
                                key={index}
                                style={[styles.containerItem,{height:GLOBALS.HEADER_HEIGHT+5,borderRadius:(GLOBALS.HEADER_HEIGHT+5)/2}]}>
                                <ListItem 
                                    style={[styles.listItem,{height:GLOBALS.HEADER_HEIGHT+5}]}
                                    rippleRound = {true}
                                    onPress={() => {
                                        ///var res = item.title.replace(" ", "+");
                                        if(this.props.onSelectChannel != null)
                                            this.props.onSelectChannel(item.title);
                                    }}
                                >
                                <View style={{width:(GLOBALS.HEADER_HEIGHT+5),height:(GLOBALS.HEADER_HEIGHT+5), marginRight:5}}>
                                    <Image style={{flex:1,borderRadius: (GLOBALS.HEADER_HEIGHT+5)/2}}  
                                           source={{ uri:item.thumb}} />    
                                </View>
                                
                                <Text style={[styles.title,{fontSize:_fontSize}]}>{item.title}</Text>
                                </ListItem>
                            </View>) ;
                    })
                }
                    
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    // titleHot: {
    //     fontFamily: GLOBALS.FONT.MEDIUM,
    //     fontSize: 13,
    //     color: "#fff",
    //     marginLeft: 20
    // },

    containerItem: {
        height: 50,
        //borderWidth: 1,
        //borderColor: "#fff",
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
       // backgroundColor:"red"
    },

    listItem: {
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        flexDirection:"row",
        paddingLeft: 10,
        paddingRight: 10,
       // backgroundColor:"blue"
    },

    title: {
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 16,
        color: "#fff",

    }
})
