import React, { FC, useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useNavigation } from '@react-navigation/native';
import { STORAGE_KEYS } from '../../../local-storage-keys';
import { Chatroom } from '@prisma/client';
import { AppCss } from '../../../styles';
import { unauthorizedEffect } from '../../../interceptors/unauthorized.interceptor';
import { useAxiosInterceptors } from '../../../hooks/state/AxiosInterceptors';

type RoomsScreenProp = NativeStackNavigationProp<RootStackParamList, 'Rooms'>;

type RoomSelectionProps = Record<string, never>;

const RoomSelection: FC<RoomSelectionProps> = () => {

  const navigation = useNavigation<RoomsScreenProp>();
  const [rooms, setRooms] = useState<Chatroom[]>([]);
  const { setUnauthorized, resetUnauthorized } = useAxiosInterceptors((state) => ({
    setUnauthorized: state.addInterceptor,
    resetUnauthorized: state.clearInterceptors,
  }));


  const logout = () => {
    AsyncStorage.removeItem(STORAGE_KEYS.authToken).then(() => {
      navigation.replace('Login');
    });
  };

  const DEBUG_RemoveToken = () => {
    AsyncStorage.removeItem(STORAGE_KEYS.authToken).then(() => {
      console.log('Token removed');
    });
  };

  const DEBUG_SeeToken = () => {
    AsyncStorage.getItem(STORAGE_KEYS.authToken).then((data) => {
      console.log(`Token : ${ data }`);
    });
  };

  const DEBUG_EmptyStack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const fetchRooms = (): Chatroom[] => {
    // TODO : replace by real data
    return [
      { id: 1, title: 'Room 1' },
      { id: 2, title: 'Homies Crew' },
      { id: 3, title: 'NSFW channel - Dont question it UHH' },
    ];
  };

  const selectRoom = (room: Chatroom) => {
    console.log(room);
    navigation.navigate('Room', { room });
  };

  useEffect(() => {
    setRooms(fetchRooms());
  }, []);

  useEffect(
    () => unauthorizedEffect(navigation, setUnauthorized, resetUnauthorized),
    [navigation, resetUnauthorized, setUnauthorized],
  );

  return <SafeAreaView style={ AppCss.bg }>
    <ScrollView>
      { rooms.map((room, idx) => {
        return <TouchableOpacity style={ AppCss.flexRow } onPress={ () => selectRoom(room) } key={ idx }>
          <Image style={ [AppCss.iconImage, AppCss.margin] } source={ require('./default-room-img.jpeg') }/>
          <Text style={ [AppCss.white, AppCss.bold, AppCss.bigText, AppCss.overflowHidden, AppCss.expand] }
                numberOfLines={ 1 } ellipsizeMode={ 'tail' }>{ room.title }</Text>
        </TouchableOpacity>;
      }) }
    </ScrollView>
    <TouchableOpacity style={ [AppCss.margin, AppCss.primaryBg] } onPress={ logout }>
      <Text style={ AppCss.centerText }>Logout</Text>
    </TouchableOpacity>
    <TouchableOpacity style={ [AppCss.margin, AppCss.primaryBg] } onPress={ DEBUG_EmptyStack }>
      <Text style={ AppCss.centerText }>[DEBUG] Empty stack</Text>
    </TouchableOpacity>
    <TouchableOpacity style={ [AppCss.margin, AppCss.primaryBg] } onPress={ DEBUG_RemoveToken }>
      <Text style={ AppCss.centerText }>[DEBUG] Remove JWT</Text>
    </TouchableOpacity>
    <TouchableOpacity style={ [AppCss.margin, AppCss.primaryBg] } onPress={ DEBUG_SeeToken }>
      <Text style={ AppCss.centerText }>[DEBUG] See JWT</Text>
    </TouchableOpacity>
  </SafeAreaView>;
};

export default RoomSelection;

