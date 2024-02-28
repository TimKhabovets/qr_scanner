import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import ScanScreen from './screens/Scaner';
import GenerateScreen from './screens/Generator';

const Stack = createNativeStackNavigator();

class App extends Component {

  render() {
    return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Scanner" component={ScanScreen} />
        <Stack.Screen name="Generator" component={GenerateScreen} />
      </Stack.Navigator>
    </NavigationContainer>

    );
  }
}

export default App;
