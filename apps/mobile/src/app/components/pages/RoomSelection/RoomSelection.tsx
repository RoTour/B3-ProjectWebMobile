import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useNavigation } from '@react-navigation/native';
import { STORAGE_KEYS } from '../../../local-storage-keys';
import { Chatroom } from '@prisma/client';
import { AppCss } from '../../../styles';
import { unauthorized, unauthorizedEffect } from '../../../interceptors/unauthorized.interceptor';
import { useAxiosInterceptors } from '../../../hooks/state/AxiosInterceptors';
import FAB from '../../common/FAB/FAB';
import Modal from 'react-native-modal';
import axios, { AxiosResponse } from 'axios';
import { CreateChatDto } from '@projetweb-b3/dto';
import { environnement } from '../../../../environnement';
import { JwtHeaderInterceptor } from '../../../interceptors/jwt-header.interceptor';


type RoomsScreenProp = NativeStackNavigationProp<RootStackParamList, 'Rooms'>;

type RoomSelectionProps = Record<string, never>;

const notify = (msg: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg);
  }
};

const RoomSelection: FC<RoomSelectionProps> = () => {

  const navigation = useNavigation<RoomsScreenProp>();
  const [rooms, setRooms] = useState<Chatroom[]>([]);
  const [showCreationModal, setShowCreationModal] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');

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

  const fetchRooms = useCallback(() => {
    axios.get(`${ environnement.apiBaseUrl }/user/rooms`).then((response: AxiosResponse<Chatroom[]>) => {
      setRooms(response.data);
    }).catch((error) => {
      console.log('Fetch rooms failed', error);
      notify(error.message);
      if (error.response.status === 401) {
        unauthorized(error, navigation);
      }
      // navigation.replace('Login');
    });
    // return [
    //   { id: 1, title: 'Room 1', thumbnailUrl: '' },
    //   { id: 2, title: 'Homies Crew', thumbnailUrl: '' },
    //   { id: 3, title: 'NSFW channel - Dont question it UHH', thumbnailUrl: '' },
    // ];
  }, [navigation]);

  const selectRoom = (room: Chatroom) => {
    console.log(room);
    navigation.navigate('Room', { room });
  };

  const createRoom = () => {
    const payload: CreateChatDto = {
      title: newGroupName,
    };
    axios.post(`${ environnement.apiBaseUrl }/chat`, payload).then((res: AxiosResponse<Chatroom>) => {
      selectRoom(res.data);
      setShowCreationModal(false);
      setNewGroupName('');
      fetchRooms();
    }).catch((err) => {
      notify(err.message);
      navigation.replace('Login');
    });
  };

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(
    () => {
      JwtHeaderInterceptor();
      unauthorizedEffect(navigation, setUnauthorized, resetUnauthorized);
    }, [navigation, resetUnauthorized, setUnauthorized],
  );

  return <SafeAreaView style={ AppCss.bg }>
    <View>
      <Modal isVisible={ showCreationModal }>
        <View style={ [styles.modalContainer, AppCss.rounded] }>
          <View style={ [AppCss.expand, AppCss.flexCenter, AppCss.fullWidth] }>
            {/* Input the new group name */ }
            <Text style={ { alignSelf: 'flex-start', marginStart: 10 } }>Create a new group</Text>
            <TextInput
              placeholder="Group Name"
              value={ newGroupName }
              style={ [styles.input, AppCss.rounded, AppCss.fullWidth] }
              onChangeText={ setNewGroupName }/>
          </View>

          <View style={ styles.buttons }>
            <View style={ AppCss.expand }>
              <Button title="Cancel" onPress={ () => setShowCreationModal(false) }/>
            </View>
            <View style={ AppCss.expand }>
              <Button title="Create Group" onPress={ () => createRoom() }/>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    <ScrollView>
      { rooms.map((room, idx) => {
        return <TouchableOpacity style={ AppCss.flexRow } onPress={ () => selectRoom(room) } key={ idx }>
          <Image style={ [AppCss.iconImage, AppCss.margin] } source={ require('./default-room-img.jpeg') }/>
          <Text style={ [AppCss.white, AppCss.bold, AppCss.bigText, AppCss.overflowHidden, AppCss.expand] }
                numberOfLines={ 1 } ellipsizeMode={ 'tail' }>{ room.title }</Text>
        </TouchableOpacity>;
      }) }
    </ScrollView>
    <FAB onPress={ () => setShowCreationModal(true) }/>
    {/*<TouchableOpacity style={ [AppCss.margin, AppCss.primaryBg] } onPress={ logout }>*/ }
    {/*  <Text style={ AppCss.centerText }>Logout</Text>*/ }
    {/*</TouchableOpacity>*/ }
    {/*<TouchableOpacity style={ [AppCss.margin, AppCss.primaryBg] } onPress={ DEBUG_EmptyStack }>*/ }
    {/*  <Text style={ AppCss.centerText }>[DEBUG] Empty stack</Text>*/ }
    {/*</TouchableOpacity>*/ }
    {/*<TouchableOpacity style={ [AppCss.margin, AppCss.primaryBg] } onPress={ DEBUG_RemoveToken }>*/ }
    {/*  <Text style={ AppCss.centerText }>[DEBUG] Remove JWT</Text>*/ }
    {/*</TouchableOpacity>*/ }
    {/*<TouchableOpacity style={ [AppCss.margin, AppCss.primaryBg] } onPress={ DEBUG_SeeToken }>*/ }
    {/*  <Text style={ AppCss.centerText }>[DEBUG] See JWT</Text>*/ }
    {/*</TouchableOpacity>*/ }
    {/*{ error && notify(error) }*/ }
  </SafeAreaView>;
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    height: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    color: '#000',
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
  },
});

export default RoomSelection;

