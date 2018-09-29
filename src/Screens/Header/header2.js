import React from "react";
import { View, 
    StyleSheet, 
    Easing,
    Animated,
    Platform} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import GLOBALS from "../../DataManagers/Globals.js";
import PropTypes from 'prop-types';
import Utils from '../../Utils/Utils';
import SearchInput from '../../Views/SearchInput';

//const AnimatedView = Animated.createAnimatedComponent(View);
export default class Header2 extends React.Component {
    static propTypes = {
        onBack: PropTypes.func,
        onSearch: PropTypes.func,
        onSearchChange : PropTypes.func,
        h : PropTypes.number
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.isSearchVisible = false;
        this.fullSearch = false;
        this._searchWidth = new Animated.Value(0.5);
        this._opacity = new Animated.Value(1);
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

        this.fullSearch = true;
        Animated.parallel([
            Animated.timing(this._opacity,{
                toValue: 0,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
                //useNativeDriver: Platform.OS === 'android',
                duration: 50,
            }),
            Animated.timing(this._searchWidth,{
                toValue: 1,
                //useNativeDriver: Platform.OS === 'android',
                duration: 150,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            })
        ]).start();

        this._center.setNativeProps({
            style:{
                zIndex:2}});
        this._left.setNativeProps({
            style:{
                zIndex:1}});
        this._right.setNativeProps({
            style:{
                zIndex:1}});
    }
    searchShow = () =>{
        return this.isSearchVisible;
    }
    focus = () =>{
        this._searchInput.focus();
    }
    focusSearch = (value) =>{
        this._searchInput.focusSearch(value);
    }

    clear = () =>{
        this._searchInput.clear();
    }
    hideSearchInput = () =>{
        if(!this.fullSearch)
            return;

        this.fullSearch = false;

        Animated.parallel([
            Animated.timing(this._opacity,{
                toValue: 1,
                //useNativeDriver: Platform.OS === 'android',
                duration: 250,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }),
            Animated.timing(this._searchWidth,{
                toValue: 0.5,
                //useNativeDriver: Platform.OS === 'android',
                duration: 50,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            })
        ]).start();

        this._center.setNativeProps({
            style:{
                zIndex:1}});
        this._left.setNativeProps({
            style:{
                zIndex:2}});
        this._right.setNativeProps({
            style:{
                zIndex:2}});
    }
    render() {
        const {onSearch,onSearchChange,h} = this.props
        // var searchWidth = Utils.Width() - 20;
        // if(!this.fullSearch){
        //     searchWidth = (Utils.Width() - 20)*0.6;
        // }
        return (
            <View style={[styles.container,{height:h}]}>
                <Animated.View 
                    ref={ref=>(this._left=ref)}
                    style={{ width: "25%",height: h, left: 0,top:0, opacity:this._opacity,zIndex:2,
                            position: 'absolute',flexDirection:"row",
                            justifyContent:"flex-start", alignItems:"center" }}>
                            <View style={{width:40,height:40}}>
                                <IconRippe vector={true} name="back" size={20} color="#fff"
                                        onPress={()=>{
                                            if(this.props.onBack != null){
                                                //this._searchInput.blur();
                                                this.props.onBack();
                                            }
                                        }}
                                    />
                            </View>
                            { this.props.left != null && this.props.left}
                </Animated.View>
                
                <Animated.View 
                    ref={ref=>(this._right=ref)}
                    style={{ width: "25%", height: h, right: 0,top:0, opacity:this._opacity,zIndex:2,
                            position: 'absolute'}}>
                            <View style={{ flex:1,flexDirection:"row",
                                            justifyContent:"flex-end", alignItems:"center" }}>
                                <View style={{width:40,height:40}}>
                                    <IconRippe vector={true} name="wifi" size={20} color="#fff"/>
                                </View>
                                { this.props.right != null && this.props.right}
                            </View>
                </Animated.View>

                <View
                    ref = {ref => (this._center = ref)}
                    style={{
                        zIndex:1,
                        position: 'absolute',
                        //top:0,
                        height:h,
                        width: Utils.Width() - 20,
                        right:10,
                        justifyContent:"center",
                        alignItems:"center",
                    }}>
                    <Animated.View 
                        ref = {ref => (this._inputSearchView = ref)}
                        style = {{
                            justifyContent:"center",
                            alignItems:"center",
                            width: this._searchWidth.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                              }),
                            height:h,
                        }}
                    >
                        <SearchInput 
                            h = {h}
                            style={{marginRight:0}} 
                            onSearch={(value)=>{
                                if(onSearch != null){
                                    onSearch(value);
                                }
                            }}
                            onSearchChange = {(value) =>{
                                //console.error("value 0 "+value);
                                if(onSearchChange != null){
                                    onSearchChange(value);
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
                    </Animated.View>
                    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //flexDirection: "row",
        // alignItems: "center", 
        // justifyContent: "center",
        position:"absolute",
        width:"100%",
        backgroundColor:GLOBALS.COLORS.HEADER,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        elevation: 5,
    },

   
})
