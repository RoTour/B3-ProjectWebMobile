import React, { FC, useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useNavigation } from '@react-navigation/native';
import { STORAGE_KEYS } from '../../../local-storage-keys';
import { Chatroom } from '@prisma/client';

type RoomsScreenProp = NativeStackNavigationProp<RootStackParamList, 'Rooms'>;

type RoomSelectionProps = Record<string, never>;

const RoomSelection: FC<RoomSelectionProps> = () => {

  const navigation = useNavigation<RoomsScreenProp>();
  const [rooms, setRooms] = useState<Chatroom[]>([]);


  const logout = () => {
    AsyncStorage.removeItem(STORAGE_KEYS.authToken).then(() => {
      navigation.replace('Login');
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
    // navigation.navigate('Chat', { room });
  };

  useEffect(() => {
    setRooms(fetchRooms());
  }, []);

  return <SafeAreaView style={ css.bg }>
    <ScrollView>
      { rooms.map((room) => {
        return <TouchableOpacity style={ css.flexRow } onPress={ () => selectRoom(room) }>
          <Image style={ [css.iconImage, css.margin] } source={ require('./default-room-img.jpeg') }/>
          <Text style={ [css.white, css.bold, css.bigText, css.overflowHidden, css.expand] }
                numberOfLines={ 1 } ellipsizeMode={ 'tail' }>{ room.title }</Text>
        </TouchableOpacity>;
      }) }
    </ScrollView>
    <TouchableOpacity style={ [css.margin, css.primaryBg] } onPress={ logout }>
      <Text style={ css.centerText }>Logout</Text>
    </TouchableOpacity>
  </SafeAreaView>;
};

export default RoomSelection;

const css = StyleSheet.create({
  margin: {
    margin: 10,
  },
  primaryBg: {
    backgroundColor: '#44d62c',
  },
  bg: {
    backgroundColor: '#080C1E',
    flex: 1,
  },
  white: {
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  centerText: {
    textAlign: 'center',
  },
  bigText: {
    fontSize: 18,
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  iconImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  expand: {
    flex: 1,
  },
});
