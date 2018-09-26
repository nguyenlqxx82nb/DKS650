import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import PropTypes from 'prop-types';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import CustomScrollableTabBar from '../Components/CustomScrollableTabBar.js'
import GLOBALS from '../DataManagers/Globals.js';
import { EventRegister  } from 'react-native-event-listeners';
import SingerListView from './SingerListView.js';
import Globals from "../DataManagers/Globals.js";


export default class SingerTabsView extends React.Component {
    static propTypes = {
        lanTabs: PropTypes.array.isRequired,
        onChangeTab : PropTypes.func,
        onScroll : PropTypes.func,
        top: PropTypes.number,
    };
    // static defaultProps = {
    //     //number: PropTypes.number.isRequired,
    //     //color: PropTypes.string.isRequired,
    //     onOptionOverlayOpen: null,
    //     onBack: null,
    //     //duration : 200
    // };

    _tabs = [];
    _currPage = 0;
    _searchTerm = "";
    _sex = GLOBALS.SINGER_SEX.ALL;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        
    }
    
    componentWillUnmount() {
        
    }

    _onOptionBaiHatClick = (id, overlayType) => {
        // const { onOptionOverlayOpen } = this.props;
        // if (onOptionOverlayOpen != null) {
        //     onOptionOverlayOpen(id,overlayType);
        // }
    }

    _onChangeTab = (page) => {
        this._currPage = page.i;
        if(this.props.onChangeTab != null){
            setTimeout(()=>{
                this.props.onChangeTab(page.i);
            },50);
        }
    }

    loadData = (term,sex) =>{
        this._searchTerm = term;
        this._sex = sex;
        this._tabs[this._currPage].loadData(term,sex);
    }

    searchData = (term,sex) =>{
        this._searchTerm = term;
        this._tabs[this._currPage].searchData(term,sex);
    }

    _handleScroll = (offsetY) =>{
        const {onScroll} = this.props;
        if(onScroll != null){
            onScroll(offsetY);
        }
    }

    setScrollTabTop = (value)=>{
        //console.warn("setScrollTabTop 0 = "+value);
        this._scrollTab.setScrollTabTop(value);
    }

    setScrollTop = (value) => {
       // console.warn("setScrollTop = "+value)
        this._tabs[this._currPage].setScrollTop(value);
    }

    getCurrentScrollOffset= () =>{
        return this._tabs[this._currPage].getCurrentScrollOffset();
    }

    render() {
        var tabContent = {};
        if(GLOBALS.LANDSCAPE){
            tabContent = {
                //marginTop: 50,
                borderTopWidth: 0,
                borderColor: '#00ECBC',
            }
        }
        return (
            <ScrollableTabView
                        style={{ marginTop: 0, }}
                        initialPage={0}
                        onChangeTab = {this._onChangeTab}
                        renderTabBar={() => 
                        <CustomScrollableTabBar
                            ref = {ref=>{this._scrollTab = ref}}
                            underlineStyle={{ backgroundColor: "#0ECAB1", height:30,bottom:5, borderRadius:15 }}
                            activeTextColor={"#0ECAB1"}
                            inactiveTextColor={"#fff"}
                            textStyle={{ fontSize: 14, color: "#fff", fontFamily:Globals.FONT.BOLD }}
                            style={{ borderWidth: 0, }}
                            isTabRound = {true}
                            tabContainerStyle = {{height:30,borderRadius:10, marginLeft:10}}
                            style ={{height:40,top:40}}
                            tabWidth={110}
                        />}
                    >
                    {this.props.lanTabs.map((lan, index) => {
                       // console.warn("lanTabs lan = "+lan +" , page = "+index);
                       return (
                            <View key={index} style={[styles.tabContent,tabContent]} tabLabel={GLOBALS.LANGUAGE_NAME[lan]}>
                                <SingerListView 
                                    lan={lan} 
                                    ref={ref => (this._tabs[index] = ref)}
                                    onScroll = {this._handleScroll}
                                    top={this.props.top}
                                    />
                            </View>) ;
                    })}
                    </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        borderTopWidth: 0.5,
        borderColor: '#00ECBC',
    },
})
