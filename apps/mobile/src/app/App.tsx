import React from 'react';
// @ts-ignore
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './components/pages/Login/Login';
import RoomSelection from './components/pages/RoomSelection/RoomSelection';
import Room, { ChatroomProps } from './components/pages/Room/Room';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './local-storage-keys';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Login: undefined;
  Rooms: undefined;
  Room: ChatroomProps;
};

const App = () => {
  axios.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.authToken);
    console.log('token', token);
    if (token) {
      config.headers = {
        Authorization: `Bearer ${ token }`,
      };
    }
    return config;
  }, (error) => {
    console.log('error', error);
    return Promise.reject(error);
  });
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={ Login }
          options={ {
            headerStyle: { backgroundColor: '#080C1E' },
            headerTitleStyle: { color: '#ffffff00', fontSize: 0, fontWeight: 'bold' },
          } }/>
        <Stack.Screen
          name="Rooms"
          component={ RoomSelection }
          options={ {
            headerStyle: { backgroundColor: '#080C1E' },
            headerTitleStyle: { color: '#ffffff' },
          } }/>
        <Stack.Screen
          name="Room"
          component={ Room }
          options={ {
            headerStyle: { backgroundColor: '#080C1E' },
            headerTitleStyle: { color: '#ffffff' },
          } }/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
