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
        return (
            <View style={{ height: 50, justifyContent: "flex-start", alignItems: "center", flexDirection: "row" }}>
                {/* <Text style={styles.titleHot}>TỪ KHÓA HOT</Text> */}
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    // style={{ marginLeft: 20 }}
                    contentContainerStyle ={{
                        paddingLeft:15
                    }}
                >
                {
                    this.state.data.map((item, index) => {
                        //console.warn("thumb url = "+item.thumb);
                        return (
                            <View 
                                key={index}
                                style={styles.containerItem}>
                                <ListItem 
                                    style={styles.listItem}
                                    rippleRound = {true}
                                    onPress={() => {
                                        ///var res = item.title.replace(" ", "+");
                                        if(this.props.onSelectChannel != null)
                                            this.props.onSelectChannel(item.title);
                                    }}
                                >
                                <View style={{width:40,height:40, marginRight:5}}>
                                    <Image style={{flex:1,borderRadius: 20}}  source={{ uri:item.thumb}} />    
                                </View>
                                
                                <Text style={styles.title}>{item.title}</Text>
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
        paddingLeft: 15,
        paddingRight: 15,
       // backgroundColor:"blue"
    },

    title: {
        fontFamily: GLOBALS.FONT.MEDIUM,
        fontSize: 14,
        color: "#fff",

    }
})
