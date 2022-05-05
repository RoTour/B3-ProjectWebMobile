import React, { FC } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { AppCss } from '../../../styles';

type GroupCreationModalProps = {
  showCreationModal: boolean,
  createOrJoin: 'create' | 'join',
  setCreateOrJoin: (state: 'create' | 'join') => void,
  newGroupName: string,
  setNewGroupName: (state: string) => void,
  setJoinGroupID: (state: number) => void,
  setShowCreationModal: (state: boolean) => void,
  createRoom: () => void,
  joinRoom: () => void,
};

const GroupCreationModal: FC<GroupCreationModalProps> = ({
  showCreationModal,
  createOrJoin,
  setCreateOrJoin, newGroupName,
  setNewGroupName,
  setJoinGroupID,
  setShowCreationModal,
  createRoom,
  joinRoom,
}) => {
  return <View>
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
  </View>;
};

export default GroupCreationModal;

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
