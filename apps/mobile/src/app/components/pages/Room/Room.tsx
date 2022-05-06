import React, { FC, useCallback, useEffect, useState } from 'react';
import { Chatroom, Message } from '@prisma/client';
import { Button, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppCss } from '../../../styles';
import ChatBubble from './ChatBubble';
import axios from 'axios';
import { environnement } from '../../../../environnement';
import { JwtUserContent } from '@projetweb-b3/dto';

export type ChatroomProps = {
  room: Chatroom
};

type Props = NativeStackScreenProps<RootStackParamList, 'Room'>;

const Room: FC<Props> = ({ route }: Props) => {
  const room = route.params.room;

  const [currentMsg, setCurrentMsg] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, chatroomId: 1, createdAt: new Date(2022, 3, 11, 11, 0), text: 'Hello I m React-native', userId: 2 },
    {
      id: 2,
      chatroomId: 1,
      createdAt: new Date(2022, 3, 11, 11, 11),
      text: 'Im one of the most used libraries in the world',
      userId: 2,
    },
    { id: 3, chatroomId: 1, createdAt: new Date(2022, 3, 11, 11, 14), text: '*Report as spam*', userId: 3 },
  ]);
  const [user, setUser] = useState<JwtUserContent | undefined>(undefined);


  const sendMessage = useCallback(() => {
    if (!user) return;
    setMessages(prevState => [...prevState, {
      id: Math.max(...prevState.map(it => it.id)) + 1,
      chatroomId: 1,
      createdAt: new Date(),
      text: currentMsg,
      userId: user.id,
    }]);
    setCurrentMsg('');
  }, [currentMsg, user]);

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

  return <SafeAreaView style={ [AppCss.bg] }>
    <ScrollView contentContainerStyle={ [AppCss.flexColumn, AppCss.justifyEnd, AppCss.expand, AppCss.bigMargin] }>
      { user && messages.sort(((a, b) => a.createdAt > b.createdAt ? 1 : -1)).map(message => {
        return <ChatBubble
          key={ message.id }
          orientation={ user.id === message.userId ? 'right' : 'left' }
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
    <Button title={ 'Debug' } onPress={ () => console.log(messages) }/>
  </SafeAreaView>;
};

export default Room;
