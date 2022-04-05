import React, { FC, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { environnement } from '../../../../environnement';
import { LoginDto, RegisterDto } from '@projetweb-b3/dto';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../local-storage-keys';

type AuthScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type LoginProps = Record<string, never>;

const Login: FC<LoginProps> = () => {

  const navigation = useNavigation<AuthScreenProp>()

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [route, setRoute] = useState<'login' | 'register'>('login');

  const changeRoute = (newRouter: 'login' | 'register') => {
    setError('');
    setRoute(newRouter);
  };

  const handleLogin = () => {
    setError('');
    const payload: LoginDto = { email, password }
    axios.post(`${environnement.apiBaseUrl}/auth/login`, payload)
      .then(({ data }: AxiosResponse< { accessToken: string }>) => {
        console.log(`login success () ${data.accessToken}`);
        AsyncStorage.setItem(STORAGE_KEYS.authToken, data.accessToken).then(() => {
          navigation.replace('Rooms');
        });
      })
      .catch((error: AxiosError) => {
        setError(error.response?.data.message ?? error.message);
      });
  };

  const handleRegister = () => {
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const payload: RegisterDto = {
      email: email.toLowerCase(),
      password,
      confirmPassword,
      name: '',
      username: '',
    }

    axios.post(`${environnement.apiBaseUrl}/auth/register`, payload)
      .then(({ data }: AxiosResponse< { accessToken: string }>) => {
        console.log(`register success () ${data.accessToken}`);
      })
      .catch((error: AxiosError) => {
        setError(error.response?.data.message ?? error.message);
      });
  };

  return <SafeAreaView style={ styles.container }>
    <View style={ [styles.displayFlex, styles.margin] }>
      <Text style={ [styles.selectForm, styles.route, route === 'login' ? styles.activeRoute : styles.inactive] }
            onPress={ () => changeRoute('login') }>Login</Text>
      <Text style={ [styles.selectForm, styles.route, route === 'register' ? styles.activeRoute : styles.inactive] }
            onPress={ () => changeRoute('register') }>Register</Text>
    </View>
    <View style={[styles.margin, !error ? styles.hidden : null]}>
      <Text style={ styles.error }>{ error }</Text>
    </View>
    <View style={ styles.form }>
      <Text style={ styles.label }>Login</Text>
      <View>
        <TextInput
          placeholder="Email"
          value={ email }
          style={ styles.input }
          onChangeText={ setEmail }/>
      </View>
      <Text style={ styles.label }>Password</Text>
      <View>
        <TextInput
          placeholder={ 'Password' }
          secureTextEntry={ true }
          value={ password }
          style={ styles.input }
          onChangeText={ setPassword }/>
      </View>
      <Text style={ [styles.label, route !== 'register' ? styles.hidden : null] }>Retype your password</Text>
      <View>
        <TextInput
          placeholder={ 'Password' }
          secureTextEntry={ true }
          value={ confirmPassword }
          style={ [styles.input, route !== 'register' ? styles.hidden : null] }
          onChangeText={ setConfirmPassword }/>
      </View>
      <View>
        <TouchableOpacity style={ styles.loginScreenButton }
                          onPress={ route === 'login' ? handleLogin : handleRegister }>
          <Text style={ styles.loginBtnTxt }>{ route === 'login' ? 'Login' : 'Register' }</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>;
};

export default Login;

const styles = StyleSheet.create({
  displayFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  hidden: {
    display: 'none',
  },
  margin: {
    marginLeft: 20,
    marginRight: 20,
  },
  route: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  activeRoute: {
    color: '#44d62c',
    textDecorationStyle: 'solid',
    textDecorationColor: '#44d62c',
    textDecorationLine: 'underline',
  },
  error: {
    marginTop: 20,
    color: 'red',
    fontWeight: 'bold',
    fontSize: 15,
  },
  inactive: {},
  container: {
    flex: 1,
    backgroundColor: '#080C1E',
    color: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 20,
  },
  selectForm: {
    color: '#fff',
  },
  label: {
    color: '#fff',
    fontSize: 15,
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
    color: '#44d62c',
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
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
