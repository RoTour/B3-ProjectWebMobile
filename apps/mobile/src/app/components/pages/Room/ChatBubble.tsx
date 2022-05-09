import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCss } from '../../../styles';

type ChatBubbleProps = {
  text: string;
  orientation: 'left' | 'right';
  senderName: string;
};

const ChatBubble: FC<ChatBubbleProps> = ({ text, orientation, senderName }) => {
  return <View
    style={ [
      css.bubble, orientation === 'left' ?
        [css.alignSelfStart, css.roundedLeft] :
        [css.alignSelfEnd, css.roundedRight, AppCss.primaryBg],
    ] }
  >
    { orientation === 'left' &&
      <Text style={ [AppCss.bold] }>{ senderName }</Text> }
    <Text>
      { text }
    </Text>
  </View>;
};

export default ChatBubble;

const css = StyleSheet.create({
  bgRed: {
    backgroundColor: 'red',
  },
  roundedRight: {
    borderBottomStartRadius: 20,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  roundedLeft: {
    borderBottomEndRadius: 20,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  alignSelfEnd: {
    alignSelf: 'flex-end',
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  bubble: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    color: 'black',
  },
});
