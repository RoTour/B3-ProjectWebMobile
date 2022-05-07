import React, { FC, useCallback, useEffect, useState } from 'react';
import { Chatroom, Message } from '@prisma/client';
import { Button, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppCss } from '../../../styles';
import ChatBubble from './ChatBubble';
import axios from 'axios';
import { environnement } from '../../../../environnement';
import { JwtUserContent, SendMessageDto } from '@projetweb-b3/dto';
import RNEventSource from 'react-native-event-source';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../local-storage-keys';
import Utils from '../../../utils/arrays';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SSE_LIB = require('sse.js');

export type ChatroomProps = {
  room: Chatroom
};

type Props = NativeStackScreenProps<RootStackParamList, 'Room'>;

const Room: FC<Props> = ({ route }: Props) => {
  const room = route.params.room;

  const [currentMsg, setCurrentMsg] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<JwtUserContent | undefined>(undefined);


  const sendMessage = useCallback(() => {
    if (!user) return;
    console.log('current msg', currentMsg);
    const payload: SendMessageDto = {
      chatroomId: room.id,
      text: currentMsg,
    };
    axios.post(`${ environnement.apiBaseUrl }/message/send`, payload)
      .then()
      .catch((error) => {
        console.log('error : ', error);
      });
    setCurrentMsg('');
  }, [currentMsg, room.id, user]);

  useEffect(() => {
    console.log('connecting');
    let src: RNEventSource | undefined;
    const msgListener = (event: any) => {
      const data = JSON.parse(event?.data);
      setMessages(prevState => [...prevState, ...data?.messages]);
      console.log('Ro connect', data?.messages);
    };
    AsyncStorage.getItem(STORAGE_KEYS.authToken).then(token => {
      if (!token) return;
      const headers = {
        'Authorization': `Bearer ${ token }`,
      };
      console.log(`chatroom url: ${ environnement.apiBaseUrl }/message/listen/${ room.id }`);
      src = new RNEventSource(`${ environnement.apiBaseUrl }/message/listen/${ room.id }`, { headers });
      src.addEventListener('message', msgListener);
    });
    return () => {
      src?.removeAllListeners();
      src?.close();
    };
  }, [room.id]);

  useEffect(() => {
    axios.get(`${ environnement.apiBaseUrl }/auth`)
      .then(({ data }: { data: JwtUserContent }) => {
        setUser(data);
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const sendTestMessage = () => {
    console.log('sendTestMessage');
    return axios.post(`${ environnement.apiBaseUrl }/message`, {});
  };

  return <SafeAreaView style={ [AppCss.bg] }>
    <ScrollView contentContainerStyle={ [AppCss.flexColumn, AppCss.justifyEnd, AppCss.expand, AppCss.bigMargin] }>
      { user && Utils.removeDuplicates(messages, (mess) => mess.id).sort(((a, b) => a.createdAt > b.createdAt ? 1 : -1)).map(message => {
        return <ChatBubble
          key={ message.id }
          orientation={ user.id === message.senderId ? 'right' : 'left' }
          text={ message.text }/>;
      }) }
    </ScrollView>
    <View style={ [AppCss.flexRow, AppCss.margin] }>
      <TextInput
        style={ [AppCss.input, AppCss.margin, AppCss.rounded, AppCss.expand] }
        placeholder={ 'Text ChatBubble.tsx' }
        value={ currentMsg }
        onChangeText={ setCurrentMsg }/>
      <TouchableOpacity style={ AppCss.margin } onPress={ sendMessage }>
        <Text style={ AppCss.white }>Send</Text>
      </TouchableOpacity>
    </View>
    <Button title={ 'Debug' } onPress={ () => sendTestMessage() }/>
  </SafeAreaView>;
};

export default Room;
