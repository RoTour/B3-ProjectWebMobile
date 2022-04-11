import React, { FC } from 'react';
import { Text } from 'react-native';
import { AppCss } from '../../../styles';

type ChatBubbleProps = {
  text: string;
  orientation: 'left' | 'right';
};

const ChatBubble: FC<ChatBubbleProps> = ({ text }) => {
  return <Text style={ AppCss.white }>{ text }</Text>;
};

export default ChatBubble;
