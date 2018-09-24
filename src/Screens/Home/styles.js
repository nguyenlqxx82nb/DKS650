const React = require("react-native");
const {Dimensions, Platform} = React;
const deviceHeight = Dimensions.get("window").deviceHeight;

export default{
    imageBackground : {
        flex : 1,
        width : null,
        height : null
    } ,

    icon : {
        // width : 45,
        // height : 45,
        // justifyContent: "center"
        color: "#fff"
    }
}