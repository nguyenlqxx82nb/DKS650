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
import {EventRegister} from 'react-native-event-listeners';

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
        this._searchWidth = new Animated.Value(0.6);
        this._opacity = new Animated.Value(1);
    }
    
    componentWillMount(){
        this._listenerConnectToBoxEvent = EventRegister.addEventListener('ConnectToBox', (data) => {
            if(GLOBALS.LANDSCAPE)
                this.setState({});
        });
    }

    componentWillUnmount(){
        EventRegister.removeEventListener(this._listenerConnectToBoxEvent);
    }

    showSearchInput = ()=>{
        if(this.fullSearch)
            return;

        this.fullSearch = true;
        this._searchWidth.setValue(0.95);
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
                duration: 100,
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
                toValue: 0.6,
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
    setSearchHolder = (title)=>{
        this._searchInput.setHoler(title);
    }
    setSearchValue = (term)=>{
        this._searchInput.setValue(term);
    }
    showIndicator = (value)=>{
        this._searchInput.showIndicator(value);
    }
    render() {
        const {onSearch,onSearchChange,h} = this.props
        var color = (GLOBALS.IS_BOX_CONNECTED)?GLOBALS.COLORS.SELECTED:GLOBALS.COLORS.ERROR;
        return (
            <View style={[styles.container,{height:h}]}>
                <Animated.View 
                    ref={ref=>(this._left=ref)}
                    style={{ width: "20%",height: h, left: 0,top:0, opacity:this._opacity,zIndex:2,
                            position: 'absolute',flexDirection:"row",
                            justifyContent:"flex-start", alignItems:"center" }}>
                            <View style={{width:GLOBALS.ICON_SIZE*2.5,height:"100%"}}>
                                <IconRippe vector={true} name="back" size={GLOBALS.ICON_SIZE} color="#fff"
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
                    style={{ width: "20%", height: h, right: 0,top:0, opacity:this._opacity,zIndex:2,
                            position: 'absolute'}}>
                            <View style={{ flex:1,flexDirection:"row",
                                            justifyContent:"flex-end", alignItems:"center" }}>
                                <View style={{width:GLOBALS.ICON_SIZE*2.5,height:"100%"}}>
                                    <IconRippe vector={true} name="wifi" size={GLOBALS.ICON_SIZE} color={color}/>
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
                                   // onSearchChange(value);
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
