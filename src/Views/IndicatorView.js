import React from "react";
import { StyleSheet,ActivityIndicator,View } from "react-native";
import PropTypes from 'prop-types';

export default class IndicatorView extends React.Component {
    static propTypes = {
        isShow : PropTypes.bool
    };

    static defaultProps = {
        isShow : false,
    };
    
    _loaded = false;

    constructor(props) {
        super(props);
        this.state = {
            isShowing : this.props.isShow,
        };
    }
    
    show = () =>{
        this.setState({isShowing : true});
    }

    hide = ()=>{
        if(this.state.isShowing){
            this.setState({isShowing : false});
        }
    }

    render = () => {
        const {isShowing} = this.state;
        return (isShowing)?
            <ActivityIndicator 
            style={styles.indicator}
            color="#00ECBC"
            size="large" /> : null;
    }
}

const styles = StyleSheet.create({
    indicator :{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
