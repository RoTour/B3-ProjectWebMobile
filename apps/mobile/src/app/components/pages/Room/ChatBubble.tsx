import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ChatBubbleProps = {
  text: string;
  orientation: 'left' | 'right';
};

const ChatBubble: FC<ChatBubbleProps> = ({ text, orientation }) => {
  return <View
    style={ [css.bubble, orientation === 'left' ? [css.alignSelfStart, css.roundedLeft] : [css.alignSelfEnd, css.roundedRight]] }
  >
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
