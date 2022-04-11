import React, { FC } from 'react';
import { Button, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useNavigation } from '@react-navigation/native';
import { STORAGE_KEYS } from '../../../local-storage-keys';

type RoomsScreenProp = NativeStackNavigationProp<RootStackParamList, 'Rooms'>;

type RoomSelectionProps = Record<string, never>;

const RoomSelection: FC<RoomSelectionProps> = () => {

  const navigation = useNavigation<RoomsScreenProp>();

  const logout = () => {
    AsyncStorage.removeItem(STORAGE_KEYS.authToken).then(() => {
      navigation.replace('Login');
    });
  };
  return <View>
      <Button title={ 'Logout' } onPress={ logout }/>
    </View>;
};

export default RoomSelection;
