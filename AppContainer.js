import React from 'react';
import { createAppContainer, createStackNavigator,createSwitchNavigator } from 'react-navigation';
import HomeScreen from "./screens/HomeScreen";

const AppNavigator = createStackNavigator({
    Home:{
        screen: HomeScreen,
        navigationOptions:{ header: null}
    }


});

export default createAppContainer(createSwitchNavigator(
    {
        App:AppNavigator
    }
))