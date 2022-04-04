import React, { FC, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

type LoginProps = Record<string, never>;

const Login: FC<LoginProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    console.log('email: ', email);
    console.log('password: ', password);
  };

  return <SafeAreaView style={ styles.container }>
      <View style={styles.form}>
        <Text style={styles.label}>Login</Text>
        <View>
          <TextInput
            placeholder="Email"
            value={ email }
            style={ styles.input }
            onChangeText={ setEmail }/>
        </View>
        <Text style={styles.label}>Password</Text>
        <View>
          <TextInput
            placeholder={ 'Password' }
            secureTextEntry={ true }
            value={ password }
            style={ styles.input }
            onChangeText={ setPassword }/>
        </View>
        <View>
          <TouchableOpacity style={ styles.loginScreenButton } onPress={ handleLogin }>
            <Text style={ styles.loginBtnTxt }>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>;
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C1E',
    color: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    color: '#fff',
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  button: {
    color: '#0f0',
  },
  loginBtnTxt: {
    color: '#080C1E',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loginScreenButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#44d62c',
    borderRadius: 10,
  },
  form: {
    margin: 20,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
