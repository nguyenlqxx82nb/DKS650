import React from "react";
import { View,StyleSheet, Text, Animated} from "react-native";
import IconRippe from '../../Components/IconRippe.js'
import PropTypes from 'prop-types';
import GLOBALS from '../../DataManagers/Globals';
import SearchInput from '../../Views/SearchInput';
import Utils from "../../Utils/Utils.js";
import {EventRegister} from 'react-native-event-listeners';

const _width = Utils.Width();
export default class Header extends React.Component {
    static propTypes = {
        onBack: PropTypes.func,
        style : Text.propTypes.style,
        back : PropTypes.bool,
        onSearch : PropTypes.func,
        onSearchChange :  PropTypes.func,
        searchHolder : PropTypes.string,
    };
    static defaultProps = {
        style : {},
        back : true,
        searchHolder:""
    };
    constructor(props) {
        super(props);
        this._opacity = new Animated.Value(1);
        this._opacity2 = new Animated.Value(0);
        this._searchWidth = new Animated.Value(0);
        this._startSearchWidth = 0;
        this._searchX = new Animated.Value(0);
    }
    showSearchInput = ()=>{
        if(this.fullSearch)
            return;

        this.fullSearch = true;
        //this._searchWidth.setValue(_width/2);
        this._opacity2.setValue(1);
        var that = this;
        Animated.parallel([
            Animated.timing(this._opacity,{
                toValue: 0,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
                //useNativeDriver: Platform.OS === 'android',
                duration: 50,
            }),
            Animated.timing(this._searchWidth,{
                toValue: _width - 20,
                //useNativeDriver: Platform.OS === 'android',
                duration: 150,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }),
            Animated.timing(this._searchX,{
                toValue: 10,
                //useNativeDriver: Platform.OS === 'android',
                duration: 100,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            })
        ]).start(()=>{
            //that.focus();
        });
    }
    // searchShow = () =>{
    //     return this.isSearchVisible;
    // }
    focus = () =>{
        this._searchInput.focus();
    }
    focusSearch = (value) =>{
        this.showSearchInput();
        setTimeout(()=>{
            this._searchInput.focusSearch(value);
        },100);
    }
    clear = () =>{
        this._searchInput.clear();
    }
    hideSearchInput = () =>{
        if(!this.fullSearch)
            return;

        this.fullSearch = false;
        var that = this;
        Animated.parallel([
            Animated.timing(this._opacity,{
                toValue: 1,
                //useNativeDriver: Platform.OS === 'android',
                duration: 150,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }),
            Animated.timing(this._searchX,{
                toValue: this._startSearchX,
                //useNativeDriver: Platform.OS === 'android',
                duration: 50,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            }),
            Animated.timing(this._searchWidth,{
                toValue:this._startSearchWidth,
                //useNativeDriver: Platform.OS === 'android',
                duration: 100,
                //easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            })
        ]).start(()=>{
            //that._searchWidth.setValue(0);
        });

        // this._center.setNativeProps({
        //     style:{
        //         zIndex:1}});
        // this._left.setNativeProps({
        //     style:{
        //         zIndex:2}});
        // this._right.setNativeProps({
        //     style:{
        //         zIndex:2}});
    }
    find_dimesions = (layout) =>{
        const {x, y, width, height} = layout;
        //console.warn("x ,width,height = "+x +" , "+width+" , "+height);
        this._startSearchWidth = width;
        this._startSearchX = x;
        this._searchWidth.setValue(width);
        this._searchX.setValue(x);
        this._searchView.setNativeProps({
            style:{
                //top: (height - size)/2,
                //left: x,
                //right: y,
                opacity: 1,}});
        
    }
    showIndicator = (value)=>{
        this._searchInput.showIndicator(value);
    }
    _onEmojiPress = () => {
        EventRegister.emit('ShowOptOverlay', 
            {   overlayType:GLOBALS.SING_OVERLAY.EMOJI,
                data:{height:180}
            });
    }
    _onVolume = () => {
        EventRegister.emit('ShowOptOverlay', 
            {   overlayType:GLOBALS.SING_OVERLAY.VOLUME,
                data:{height:60}
            });
    }
    setSearchHolder = (title) =>{
        this._searchInput.setHoler(title);
    }
    render() {
        const {title,back,onSearch,onSearchChange,searchHolder} = this.props;
        return (
            <View style={[styles.container,this.props.style]}>
                <Animated.View  
                        style={[{opacity:this._opacity,flex:1,justifyContent:"flex-start",alignItems:"center",flexDirection:"row"}]}
                        >
                    {back && <View style={{ width: 40, height: 40, marginLeft: 0 }}>
                        <IconRippe vector={true} name="back" size={20} color="#fff"
                            onPress={()=>{
                                if(this.props.onBack != null){
                                    //this._searchInput.blur();
                                    this.props.onBack();
                                }
                            }}
                        />
                    </View>}
                    {this.props.left != null && this.props.left}
                    <View 
                        onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}
                        style={{flex:1,height: 40}}>
                    </View>
                    {/* <View style={{ width: 40, height: 40}}>
                        <IconRippe vector={true} name="search" size={20} color="#fff"
                            onPress={()=>{
                                this.showSearchInput();
                            }}
                        />
                    </View> */}
                    <View style={{ width: 40, height: 40}}>
                        <IconRippe vector={true} name="emoji" size={20} color="#fff"
                            onPress={()=>{
                                this._onEmojiPress();
                            }}
                        />
                    </View>   
                    <View style={{ width: 40, height: 40}}>
                        <IconRippe vector={true} name="volumnOn" size={20} color="#fff"
                            onPress={()=>{
                                this._onVolume();
                            }}
                        />
                    </View> 
                    {this.props.right != null && this.props.right}
                </Animated.View>

                <Animated.View 
                        ref = {ref => (this._searchView = ref)}
                        style = {{
                            justifyContent:"center",
                            alignItems:"center",
                            position:"absolute",
                            left:this._searchX ,
                            width: this._searchWidth,
                            height:40,
                            opacity:this._opacity2,
                            //backgroundColor:"blue"
                        }}
                    >
                        <SearchInput 
                            h = {40}
                            holder = {searchHolder}
                            style={{marginRight:5,marginLeft:5,height:36,borderRadius:18}} 
                            onSearch={(value)=>{
                                if(onSearch != null){
                                    onSearch(value);
                                }
                            }}
                            onSearchChange = {(value) =>{
                                if(onSearchChange != null){
                                    setTimeout(()=>{
                                        //onSearchChange(value);
                                    },50);
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems:"center",
        flex:1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        elevation: 5,
        backgroundColor :GLOBALS.COLORS.HEADER,
    },
    title: {
        fontSize: 20,
        fontWeight: '300',
        //paddingLeft:20,
        marginLeft:10,
        color:"#fff",
       // flex:1,
        fontFamily:GLOBALS.FONT.BOLD
    },
    rightContainer : {
        flexDirection:"row",
        position:"absolute",
        width:150,
        height:45,
        top:0,
        right:0,
        justifyContent:"flex-end",
        alignItems:"center",
        marginLeft:5
    }
   
})
