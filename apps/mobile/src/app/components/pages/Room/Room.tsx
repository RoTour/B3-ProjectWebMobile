import React, { FC, useState } from 'react';
import { Chatroom, Message } from '@prisma/client';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppCss } from '../../../styles';
import ChatBubble from './ChatBubble';

export type ChatroomProps = {
  room: Chatroom
};

type Props = NativeStackScreenProps<RootStackParamList, 'Room'>;

const Room: FC<Props> = ({ route, navigation }: Props) => {
  const room = route.params.room;

  const [currentMsg, setCurrentMsg] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, chatroomId: 1, createdAt: new Date(2022, 3, 11, 11, 0), text: 'Hola', userId: 2 },
    { id: 2, chatroomId: 1, createdAt: new Date(2022, 3, 11, 11, 11), text: 'Quetal', userId: 2 },
    { id: 3, chatroomId: 1, createdAt: new Date(2022, 3, 11, 11, 14), text: 'Affogato', userId: 3 },
  ]);

  const sendMessage = () => {
    setMessages(prevState => [...prevState, {
      id: Math.max(...prevState.map(it => it.id)) + 1,
      chatroomId: 1,
      createdAt: new Date(),
      text: currentMsg,
      userId: 1,
    }]);
    setCurrentMsg('');
  };


  return <SafeAreaView style={ [AppCss.bg] }>
    <Text style={ AppCss.white }>{ room.title }</Text>
    <ScrollView>
      { messages.sort(((a, b) => a.createdAt > b.createdAt ? 1 : -1)).map(message => {
        return <ChatBubble key={ message.id } orientation={ 'left' } text={ message.text }/>;
      }) }
    </ScrollView>
    {/*<ScrollView style={ AppCss.expand }>*/ }
    {/*  { messages.map((message) => {*/ }
    {/*    return <ChatBubble text={ message.text } orientation={ message.userId === 2 ? 'right' : 'left' }/>;*/ }
    {/*  }) })*/ }
    {/*</ScrollView>*/ }
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

const css = StyleSheet.create({});
