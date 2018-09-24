import React, { Component} from "react";
import PropTypes from "prop-types";
import {
  TouchableHighlight,
  Platform,
  TouchableNativeFeedback,
  View
} from "react-native";

export default class ListItem extends Component {
  static contextTypes = {
    theme: PropTypes.object
  };

  static propTypes = {
    rippleColor: PropTypes.string,
    rippleRound:PropTypes.bool
  };
  static defaultProps = {
    rippleColor : '#ccc',
    rippleRound : false
  }
  render() {
    const {rippleColor,rippleRound} = this.props;
    if (
      Platform.OS === "ios" ||
      Platform.OS === "web" ||
      //variables.androidRipple === false ||
      (!this.props.onPress && !this.props.onLongPress) ||
      Platform.Version <= 21
    ) {
      return (
        <TouchableHighlight
          onPress={this.props.onPress}
          onLongPress={this.props.onLongPress}
          ref={c => (this._root = c)}
          underlayColor={"#DDD"}
          {...this.props}
          style={this.props.touchableHighlightStyle}
        >
          <View {...this.props}>{this.props.children}</View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableNativeFeedback
          ref={c => (this._root = c)}
          {...this.props}
          background={(rippleRound)?TouchableNativeFeedback.Ripple(rippleColor,true):TouchableNativeFeedback.Ripple(rippleColor)}
        //  delayPressIn={30}
        >
          <View style={{ marginLeft: 0, paddingLeft: 0 }}>
            <View {...this.props}>{this.props.children}</View>
          </View>
        </TouchableNativeFeedback>
      );
    }
  }
}

ListItem.propTypes = {
  ...TouchableHighlight.propTypes,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array
  ]),
  touchableHighlightStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  itemDivider: PropTypes.bool,
  button: PropTypes.bool
};

// const StyledListItem = connectStyle(
//   "NativeBase.ListItem",
//   {},
//   mapPropsToStyleNames
// )(ListItem);

//export { StyledListItem as ListItem };
