import React, { FC } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { AppCss } from '../../../styles';
import { Chatroom } from '@prisma/client';

type GroupJoinModalProps = {
  roomToLeave: Chatroom | null,
  setRoomToLeave: (room: Chatroom | null) => void,
  leaveGroup: () => void,
};

const GroupJoinModal: FC<GroupJoinModalProps> = ({
  roomToLeave,
  setRoomToLeave,
  leaveGroup,
}) => {
  return <View>
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
  </View>;
};

export default GroupJoinModal;


const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    height: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    color: '#000',
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
  },
  buttons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
