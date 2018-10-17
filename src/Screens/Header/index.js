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
export default class Header extends React.Component {
    static propTypes = {
        onBack: PropTypes.func,
        onSearch: PropTypes.func,
        onSearchChange : PropTypes.func,
        h: PropTypes.number
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this._startWidth = 350;
        if(GLOBALS.LANDSCAPE_NORMAL){
            this._startWidth = 450;
        }
        else if(GLOBALS.LANDSCAPE_LARGE){
            this._startWidth = 550;
        }
        this.isSearchVisible = false;
        this.fullSearch = false;
        this._searchWidth = new Animated.Value(this._startWidth);
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
       // this.state.searchWidth.setValue(800);
        this.fullSearch = true;
        //this.setState({});
        this._searchWidth.setValue(Utils.Width()-100);
        Animated.parallel([
            Animated.timing(this._opacity,{
                toValue: 0,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
                //useNativeDriver: Platform.OS === 'android',
                duration: 50,
            }),
            Animated.timing(this._searchWidth,{
                toValue: Utils.Width()-30,
                //useNativeDriver: Platform.OS === 'android',
                duration: 100,
               //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            })
        ]).start();
        
    }
    searchShow = () =>{
        return this.isSearchVisible;
    }
    clear = () =>{
        this._searchInput.clear();
    }
    setSearchHolder = (title)=>{
        this._searchInput.setHoler(title);
    }
    showIndicator = (value)=>{
        this._searchInput.showIndicator(value);
    }
    hideSearchInput = () =>{
        if(!this.fullSearch)
            return;

        this.fullSearch = false;

        Animated.parallel([
            Animated.timing(this._opacity,{
                toValue: 1,
                //useNativeDriver: Platform.OS === 'android',
                duration: 150,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }),
            Animated.timing(this._searchWidth,{
                toValue: this._startWidth,
                //useNativeDriver: Platform.OS === 'android',
                duration: 100,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            })
        ]).start();
    }
    render() {
        const {onSearch,onSearchChange,h} = this.props
        var color = (GLOBALS.IS_BOX_CONNECTED)?GLOBALS.COLORS.SELECTED:GLOBALS.COLORS.ERROR;
        return (
            <View style={[styles.container,{height:h}]}>
                
                <Animated.View 
                    style={{ width: GLOBALS.ICON_SIZE*2.5, height: "100%", marginLeft: 0, opacity:this._opacity }}>
                    <IconRippe vector={true} name="back" size={GLOBALS.ICON_SIZE} color="#fff"
                        onPress={()=>{
                            if(this.props.onBack != null){
                                //this._searchInput.blur();
                                this.props.onBack();
                            }
                        }}
                    />
                </Animated.View>
                
                <Animated.View
                    ref = {ref =>(this._centerView = ref)}
                    style={{flex:1,justifyContent:"center",alignItems:"flex-start",
                             opacity:this._opacity}}>
                    {this.props.center}
                </Animated.View>

                <Animated.View
                    ref = {ref => (this._inputSearchView = ref)}
                    style={{
                        zIndex:2,
                        // position: 'absolute',
                        // right : 0,
                        //top:0,
                        height:h,
                        width: this._searchWidth,
                        marginRight:15,
                        marginLeft:15,
                        justifyContent:"center",
                    }}>
                    <SearchInput 
                        h={h}
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
                <Animated.View 
                    style={{ width:GLOBALS.ICON_SIZE*2.5, height: "100%", marginLeft: 0, opacity:this._opacity }}>
                    <IconRippe vector={true} name="wifi" size={GLOBALS.ICON_SIZE} color={color}
                        onPress={()=>{}}
                    />
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "center",
        width:'100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        elevation: 5,
        backgroundColor :GLOBALS.COLORS.HEADER,
    },

   
})
