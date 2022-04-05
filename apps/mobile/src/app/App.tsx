import React from 'react';
// @ts-ignore
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './components/pages/Login/Login';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerStyle: { backgroundColor: "#080C1E" },
            headerTitleStyle: { color: "#ffffff00", fontSize: 0, fontWeight: "bold" },
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
