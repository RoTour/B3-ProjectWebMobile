import React from 'react';
// @ts-ignore
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './components/pages/Login/Login';
import RoomSelection from './components/pages/RoomSelection/RoomSelection';
import Room, { ChatroomProps } from './components/pages/Room/Room';
import NavigatorWrapper from './NavigatorWrapper';
import { useCurrentRoom } from './hooks/state/CurrentRoom';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Login: undefined;
  Rooms: undefined;
  Room: ChatroomProps;
};

const App = () => {
  const { roomId } = useCurrentRoom();
  return (
    <NavigationContainer>
      <NavigatorWrapper Stack={ Stack }>
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
          name={ 'Room' }
          component={ Room }
          options={ {
            headerStyle: { backgroundColor: '#080C1E' },
            headerTitleStyle: { color: '#ffffff' },
            title: `Room #${ roomId }`,
          } }/>
      </NavigatorWrapper>
    </NavigationContainer>
  );
};

export default App;
