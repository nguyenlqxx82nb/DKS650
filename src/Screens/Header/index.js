import React from "react";
import { View, 
    StyleSheet, 
    LayoutAnimation,
    Platform, 
    UIManager } from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from "../../DataManagers/Globals.js";
import PropTypes from 'prop-types';
import Utils from '../../Utils/Utils';
import SearchInput from '../../Views/SearchInput';

var CustomLayoutSpring = {
    duration: 200,
    create: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.scaleXY,
      springDamping: 0.6,
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.6,
    },
  };
export default class Header extends React.Component {
    static propTypes = {
        onBack: PropTypes.func,
        onSearch: PropTypes.func,
        onSearchChange : PropTypes.func,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.isSearchVisible = false;
        UIManager.setLayoutAnimationEnabledExperimental(true);
        this.fullSearch = false;
        this.state = {
        }
    }
    // getSearchValue = () =>{
    //     return this._searchInput.getValue();
    // }
    // _onSearch = (value) =>{
    //     if(this.props.onSearch != null)
    //         this.props.onSearch(value);
    // }
    // _onSearchChange = (value) =>{
    //     if(this.props.onSearchChange != null)
    //         this.props.onSearchChange(value);
    // }
    showSearchInput = ()=>{
        if(this.fullSearch)
            return;

        LayoutAnimation.configureNext(CustomLayoutSpring);

        this.fullSearch = true;
        this.setState({});
    }
    searchShow = () =>{
        return this.isSearchVisible;
    }
    hideSearchInput = () =>{
        if(!this.fullSearch)
            return;

        LayoutAnimation.configureNext(CustomLayoutSpring,()=>{
            console.warn("hideSearchInput");
        });
        this.fullSearch = false;
        this.setState({});
    }
    render() {
        const {onSearch,onSearchChange} = this.props
        var searchWidth = Utils.Width() - 20;
        if(!this.fullSearch){
            searchWidth = (Utils.Width() - 20)*0.6;
        }
        return (
            <View style={styles.container}>
                <View style={{ width: 40, height: 40, marginLeft: 0 }}>
                    <IconRippe vector={true} name="back" size={20} color="#fff"
                        onPress={()=>{
                            if(this.props.onBack != null){
                                //this._searchInput.blur();
                                this.props.onBack();
                            }
                        }}
                    />
                </View>
                <View
                    ref = {ref =>(this._centerView = ref)}
                    style={{flex:1,justifyContent:"center",alignItems:"flex-start",
                             opacity: 1}}>
                    {this.props.center}
                </View>
                <View 
                    ref = {ref => (this._inputSearchView = ref)}
                    style={{
                        zIndex:2,
                        position: 'absolute',
                        right : 0,
                        //top:0,
                        height:40,
                        width: searchWidth,
                        marginRight:10,
                        marginLeft:10,
                        justifyContent:"center",
                        backgroundColor :GLOBALS.COLORS.HEADER,
                    }}>
                    <SearchInput 
                        style={{marginRight:0}} 
                        onSearch={()=>{
                            if(onSearch != null){
                                onSearch();
                            }
                        }}
                        onSearchChange = {() =>{
                            if(onSearchChange != null){
                                onSearchChange();
                            }
                        }}
                        ref={ref=>(this._searchInput = ref)}  
                        onFocus={()=>{
                            this.showSearchInput();
                        }}
                        onBlur={()=>{
                            this.hideSearchInput();
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "center",
        flex:1,
        width:'100%',
    },

   
})
