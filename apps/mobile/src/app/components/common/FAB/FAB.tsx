import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppCss } from '../../../styles';

type FABProps = {
  onPress: () => void;
};

const FAB: FC<FABProps> = ({ onPress }) => {
  return <TouchableOpacity style={ [styles.container, AppCss.primaryBg] } onPress={ () => onPress() }>
    <Icon name="plus" size={ 30 } color="#000"/>
  </TouchableOpacity>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    height: 60,
    width: 60,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FAB;
