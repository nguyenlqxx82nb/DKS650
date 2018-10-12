import React from "react";
import { StyleSheet, View, TextInput,Text,ActivityIndicator} from "react-native";
import PropTypes from 'prop-types';
import CustomIcon from '../Components/CustomIcon'
import IconRippe from '../Components/IconRippe.js'
import { EventRegister  } from 'react-native-event-listeners';
import GLOBALS from '../DataManagers/Globals';

export default class SearchInput extends React.Component {
    static propTypes = {
       // onClear: PropTypes.func,
        onSearch: PropTypes.func,
        style : Text.propTypes.style,
        onSearchChange : PropTypes.func,
        onFocus : PropTypes.func,
        onBlur : PropTypes.func,
        holder : PropTypes.string,
        //duration : PropTypes.number
    };
    static defaultProps = {
        style : {},
        holder :"Tìm kiếm ..."
    };
    _showIndicator = false;
    _holder = "";
    constructor(props) {
        super(props);
        this.height = 35;
        this._holder = this.props.holder;
        this.state={
            value: "",
            showRemoveBtn : false
        }
    }

    getValue = ()=>{
        if(this._searchInput._lastNativeText == undefined)
            return "";
        else
            return this._searchInput._lastNativeText;
    }
    blur = ()=>{
        this._searchInput.blur();
    }
    focus = ()=>{
        this._searchInput.focus();
    }
    focusSearch = (term)=>{
        this.setValue(term);
        if(term != "")
            this.setState({showRemoveBtn:true});
            
        this._searchInput.focus();
    }
    _handleTextFocus = () =>{
        const {onFocus,onSearch} = this.props;
        EventRegister.emit("ShowKeybroard",{input:this});
        if(onFocus != null){
            onFocus();
        }
        if(onSearch != null){
            onSearch(this.getValue());
        }
    }
    _handleBlur = () =>{
        const {onBlur,onSearch} = this.props;
        setTimeout(()=>{
            EventRegister.emit("HideKeybroard",{});
            if(onBlur != null){
                onBlur();
            }
        },250);

        if(onSearch != null){
            onSearch(this.getValue());
        }
    }
    _handleTextSubmit = () =>{
        //EventRegister.emit("ShowFooter",{});
        if(this.props.onSearch != null){
            this.props.onSearch(this.getValue());
        }
    }
    _handleClearSearch = () =>{
        this.setState({showRemoveBtn:false});
        this.clear();
        if(this.props.onSearch != null){
            this.props.onSearch("");
        }
    }
    _handleTextChanged = (value) =>{
        var showRemoveBtn = (value == "")?false:true;
        if(this.state.showRemoveBtn != showRemoveBtn){
            this.setState({showRemoveBtn:showRemoveBtn});
        }

        if(this.props.onSearchChange != null){
            this.props.onSearchChange(this.getValue());
        }
    }
    clear = ()=>{
        this.setValue("");
        this.setState({showRemoveBtn:false});
    }
    setValue = (value)=>{
        this._searchInput.setNativeProps({ text: value });
        setTimeout(() => {
            this._searchInput.setNativeProps({ text: value });
        });
        //this._searchInput.clear();
        this._searchInput._lastNativeText = value;
    }
    showIndicator = (isShow) =>{
        if(isShow != this._showIndicator){
            this._showIndicator = isShow;
            this.setState({});
        }
    }
    setHoler = (holder)=>{
        if(holder != this._holder){
            this._holder = holder;
            this.setState({});
        }
    }
    render = () => {
        const {showRemoveBtn} =this.state;
        const {style,holder} = this.props;
        //console.warn("LANDSCAPE = "+GLOBALS.LANDSCAPE);
        var conteinerStyle = {},indicator={};
        if(GLOBALS.LANDSCAPE){
            conteinerStyle = {
                marginRight:0,
                marginLeft: 0,
            }
        }
        var inputStyle = {};
        if (GLOBALS.MOBILE_SMALL){
            inputStyle = {
                fontSize : 14,
                marginLeft:5,
                marginRight:5
            }
        }
        return (
            <View style={[styles.container,conteinerStyle,style]}>
                <CustomIcon size={15} name="search" style={{ color: "#9197CC", marginLeft: 10 }} />
                <TextInput
                    numberOfLines={1}
                    ref = {ref => (this._searchInput = ref)}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor={'#9192C6'}
                    style={[styles.input,inputStyle]}
                    placeholder={this._holder}
                    onFocus = {this._handleTextFocus}
                    onBlur = {this._handleBlur}
                    onSubmitEditing = {this._handleTextSubmit}
                    onChangeText={this._handleTextChanged}
                    disableFullscreenUI={true}
                    returnKeyType='search'
                    //onEndEditing={(e) => {}}
                    //value={this.state.value}
                />
                {this._showIndicator && 
                    <ActivityIndicator 
                    style={styles.indicator}
                    color="#00ECBC"
                    size="small" />
                }
                {showRemoveBtn && 
                (<View style={{ width: 30, height: 30,marginRight:5 }}>
                    <IconRippe vector={true} size={15} name="close" color={"#fff"} 
                        onPress = {this._handleClearSearch} />
                </View>) }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "center",
        //marginRight:5,
        borderRadius: 16,
        backgroundColor: "#565BAC", 
        height: 32, 
        // paddingRight: 3,
        //marginLeft: 5,
    },
    input: {
        flex:1, 
        fontSize: 17,
        color: "white", 
        padding: 0, 
        margin: 0,
        fontFamily:GLOBALS.FONT.MEDIUM,
        marginLeft:10,
        marginRight:10
    },
    indicator : {
        marginRight : 5
    }
})
