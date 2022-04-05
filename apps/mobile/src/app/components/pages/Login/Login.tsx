import React, { FC, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type LoginProps = Record<string, never>;

const Login: FC<LoginProps> = () => {
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
    console.log('email: ', email);
    console.log('password: ', password);
  };

  const handleRegister = () => {
    setError('');
    console.log('email: ', email);
    console.log('password: ', password);
    console.log('confirmPassword: ', confirmPassword);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    }
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
