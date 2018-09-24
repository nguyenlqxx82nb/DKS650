import React from "react";
import { View } from "react-native";
import { StackNavigator, DrawerNavigator } from "react-navigation";

// screens
import HomeScreen from "./Home/index.landscape";
import SideBar from "../SideBar/SideBar.js";

const Drawer = DrawerNavigator(
    {
        Home: { screen: HomeScreen },
    },
    {
        initialRouteName: "Home",
        contentComponent: props => <SideBar {...props} />
    }
);

// const AppNavigator = StackNavigator(
//     {
//         Drawer: { screen: Drawer },
//     },
//     {
//         initialRouteName: "Drawer",
//         headerMode: "none"
//     }
// );

export default () =>
    <Drawer />