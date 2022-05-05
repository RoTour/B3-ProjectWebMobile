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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useNavigation } from '@react-navigation/native';
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
  const [roomToLeave, setRoomToLeave] = useState<Chatroom | null>(null);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [joinGroupID, setJoinGroupID] = useState<number>(0);
  const [createOrJoin, setCreateOrJoin] = useState<'create' | 'join'>('create');


  const { setUnauthorized, resetUnauthorized } = useAxiosInterceptors((state) => ({
    setUnauthorized: state.addInterceptor,
    resetUnauthorized: state.clearInterceptors,
  }));

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

  function leaveGroup() {
    if (!roomToLeave) return;
    const payload = { chatId: roomToLeave?.id };
    axios.post(`${ environnement.apiBaseUrl }/chat/leave`, payload)
      .then(() => {
        setRoomToLeave(null);
        fetchRooms();
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
        fetchRooms();
      })
      .catch((err) => {
        notify(err.message);
      });
    console.log(payload);
  };

  return <SafeAreaView style={ AppCss.bg }>
    <View>
      <Modal isVisible={ showCreationModal }>
        <View style={ [styles.modalContainer, AppCss.rounded] }>
          <View style={ [AppCss.flexRow, AppCss.flexCenter] }>
            <TouchableOpacity onPress={ () => setCreateOrJoin('create') } style={ AppCss.expand }>
              <Text style={ [AppCss.centerText, createOrJoin === 'create' ? { fontWeight: '800' } : null] }>Create
                Group</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => setCreateOrJoin('join') } style={ AppCss.expand }>
              <Text style={ [AppCss.centerText, createOrJoin === 'join' ? { fontWeight: '800' } : null] }>Join
                Group</Text>
            </TouchableOpacity>
          </View>
          { createOrJoin === 'create' && <View style={ [AppCss.expand, AppCss.flexCenter, AppCss.fullWidth] }>
            <Text style={ { alignSelf: 'flex-start' } }>Create a new group</Text>
            <TextInput
              placeholder="Group Name"
              value={ newGroupName }
              style={ [styles.input, AppCss.rounded, AppCss.fullWidth] }
              onChangeText={ setNewGroupName }/>
          </View> }
          { createOrJoin === 'join' && <View style={ [AppCss.expand, AppCss.flexCenter, AppCss.fullWidth] }>
            <Text style={ { alignSelf: 'flex-start' } }>Join a group</Text>
            <TextInput
              placeholder="Group ID"
              onChangeText={ value => {
                const numbers = value.match(/\d+/g)?.join('');
                if (numbers) setJoinGroupID(+numbers);
              } }
              style={ [styles.input, AppCss.rounded, AppCss.fullWidth] }
            />
          </View> }

          <View style={ styles.buttons }>
            <View style={ AppCss.expand }>
              <Button title="Cancel" onPress={ () => setShowCreationModal(false) }/>
            </View>
            <View style={ AppCss.expand }>
              { createOrJoin === 'create' && <Button title="Create Room" onPress={ createRoom }/> }
              { createOrJoin === 'join' && <Button title="Join Room" onPress={ joinRoom }/> }
              {/*<Button title="Create Group" onPress={ () => createRoom() }/>*/ }
            </View>
          </View>
        </View>
      </Modal>
    </View>

    <View>
      <Modal isVisible={ roomToLeave !== null }>
        <View style={ [styles.modalContainer, AppCss.rounded, { height: '20%' }] }>
          <View style={ [AppCss.expand, AppCss.flexCenter, AppCss.fullWidth] }>
            <Text style={ { alignSelf: 'flex-start', marginStart: 10, fontSize: 18 } }>
              Do you really want to leave the room "{ roomToLeave?.title }"?
            </Text>
          </View>

          <View style={ styles.buttons }>
            <View style={ AppCss.expand }>
              <Button title="Cancel" onPress={ () => setRoomToLeave(null) }/>
            </View>
            <View style={ AppCss.expand }>
              <Button title="Leave group" onPress={ () => leaveGroup() }/>
            </View>
          </View>
        </View>
      </Modal>
    </View>

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

