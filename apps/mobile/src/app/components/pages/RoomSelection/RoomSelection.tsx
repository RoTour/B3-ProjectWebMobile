import React, { FC, useCallback, useEffect, useState } from 'react';
import { Alert, Image, Platform, SafeAreaView, ScrollView, Text, ToastAndroid, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useNavigation } from '@react-navigation/native';
import { Chatroom } from '@prisma/client';
import { AppCss } from '../../../styles';
import { unauthorized, unauthorizedEffect } from '../../../interceptors/unauthorized.interceptor';
import { useAxiosInterceptors } from '../../../hooks/state/AxiosInterceptors';
import FAB from '../../common/FAB/FAB';
import axios, { AxiosResponse } from 'axios';
import { CreateChatDto } from '@projetweb-b3/dto';
import { environnement } from '../../../../environnement';
import { JwtHeaderInterceptor } from '../../../interceptors/jwt-header.interceptor';
import GroupCreationModal from './GroupCreationModal';
import GroupJoinModal from './GroupJoinModal';
import { useCurrentRoom } from '../../../hooks/state/CurrentRoom';

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
  const [roomToLeave, setRoomToLeave] = useState<Chatroom | null>(null);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [joinGroupID, setJoinGroupID] = useState<number>(0);
  const [createOrJoin, setCreateOrJoin] = useState<'create' | 'join'>('create');
  const { setRoomId } = useCurrentRoom();

  const { setUnauthorized, resetUnauthorized } = useAxiosInterceptors((state) => ({
    setUnauthorized: state.addInterceptor,
    resetUnauthorized: state.clearInterceptors,
  }));

  const fetchRooms = useCallback(() => {
    return axios.get(`${ environnement.apiBaseUrl }/user/rooms`).then((response: AxiosResponse<Chatroom[]>) => {
      setRooms(response.data);
    }).catch((error) => {
      if (error.response.status === 401) {
        unauthorized(error, navigation);
        notify('You have been automatically logged out due to inactivity');
        return;
      }
      notify(error.message);
    });
  }, [navigation]);

  const selectRoom = (room: Chatroom) => {
    console.log(room);
    setRoomId(room.id);
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
      fetchRooms().catch((error) => {
        notify('An error occurred. Please try again later.');
        console.log(error);
      });
    }).catch((err) => {
      notify(err.message);
      navigation.replace('Login');
    });
  };

  useEffect(() => {
    fetchRooms().catch((error) => {
      notify('An error occurred. Please try again later.');
      console.log(error);
    });
  }, [fetchRooms]);

  useEffect(
    () => {
      JwtHeaderInterceptor();
      unauthorizedEffect(navigation, setUnauthorized, resetUnauthorized);
    }, [navigation, resetUnauthorized, setUnauthorized],
  );

  function leaveGroup() {
    if (!roomToLeave) return;
    const payload = { chatId: roomToLeave?.id };
    axios.post(`${ environnement.apiBaseUrl }/chat/leave`, payload)
      .then(() => {
        setRoomToLeave(null);
        fetchRooms().catch((err) => {
          notify(err.message);
        });
      })
      .catch((err) => {
        notify(err.message);
      });
  }

  const joinRoom = () => {
    const payload = {
      chatId: joinGroupID,
    };
    axios.post(`${ environnement.apiBaseUrl }/chat/join`, payload)
      .then(() => {
        setCreateOrJoin('create');
        setJoinGroupID(0);
        setShowCreationModal(false);
        fetchRooms().catch((error) => {
          notify('An error occured. Please try again later.');
          console.log(error);
        });
      })
      .catch((err) => {
        notify(err.message);
      });
    console.log(payload);
  };

  return <SafeAreaView style={ AppCss.bg }>
    <GroupCreationModal createOrJoin={ createOrJoin } setCreateOrJoin={ setCreateOrJoin }
                        showCreationModal={ showCreationModal } setShowCreationModal={ setShowCreationModal }
                        createRoom={ createRoom }
                        joinRoom={ joinRoom } setJoinGroupID={ setJoinGroupID } setNewGroupName={ setNewGroupName }
                        newGroupName={ newGroupName }/>

    <GroupJoinModal leaveGroup={ leaveGroup } roomToLeave={ roomToLeave } setRoomToLeave={ setRoomToLeave }/>


    <ScrollView>
      { rooms.map((room, idx) => {
        return <TouchableOpacity style={ AppCss.flexRow } onPress={ () => selectRoom(room) } key={ idx }
                                 onLongPress={ () => setRoomToLeave(room) }>
          <Image style={ [AppCss.iconImage, AppCss.margin] } source={ require('./default-room-img.jpeg') }/>
          <Text style={ [AppCss.white, AppCss.bold, AppCss.bigText, AppCss.overflowHidden, AppCss.expand] }
                numberOfLines={ 1 } ellipsizeMode={ 'tail' }>{ room.title }</Text>
        </TouchableOpacity>;
      }) }
    </ScrollView>
    <FAB onPress={ () => setShowCreationModal(true) }/>
  </SafeAreaView>;
};

export default RoomSelection;

