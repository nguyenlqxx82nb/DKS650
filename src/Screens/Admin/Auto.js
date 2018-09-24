import React from "react";
import {Text,StyleSheet,View} from "react-native";
import SongListView from '../../Views/SongListView';
import GLOBALS from '../../DataManagers/Globals'

export default class AutoScreen extends React.Component
{
    constructor(props) {
        super(props);
    }
    componentWillMount(){
       
    }
    componentWillUnmount(){
       
    }
    componentDidMount(){
        this._songList.loadData("");
    }
    
    render() {
        return(
            <View style={{flex:1}} >
               <SongListView 
                        ref={ref=>(this._songList = ref)} 
                        listType = {GLOBALS.SONG_LIST_TYPE.AUTO} 
                     />

            </View>
        );
    }
} 

const styles = StyleSheet.create({
})
