import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../local-storage-keys';

export const JwtHeaderInterceptor = () => {
  axios.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.authToken);
    console.log('token', token);
    if (token) {
      config.headers = {
        Authorization: `Bearer ${ token }`,
      };
    }
    return config;
  }, (error) => {
    console.log('error', error);
    return Promise.reject(error);
  });
};
