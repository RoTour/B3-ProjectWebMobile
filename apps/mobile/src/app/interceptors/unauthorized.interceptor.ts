import axios, { AxiosError } from 'axios';
import { HttpStatus } from '../utils/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../local-storage-keys';

export const unauthorized = (error: AxiosError, navigation: any) => {
  console.log('unauthorized interceptor');
  if (error.message === 'canceled') return;
  if (error.response && error.response.status === HttpStatus.UNAUTHORIZED) {
    AsyncStorage.removeItem(STORAGE_KEYS.authToken).then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    });
  }
  return Promise.reject(error);
};

export const setUnAuthorizedInterceptor = (navigation: any, setUnauthorized: (id: number) => void) => {
  const interceptorId = axios.interceptors.response.use(
    (value) => value,
    (error: AxiosError) => unauthorized(error, navigation),
  );
  setUnauthorized(interceptorId);
};

export const removeUnauthorizedInterceptor = (resetFn: () => void) => {
  resetFn();
};

export const unauthorizedEffect = (
  navigation: any,
  setUnauthorized: (id: number) => void,
  reset: () => void) => {
  setUnAuthorizedInterceptor(navigation, setUnauthorized);

  return () => {
    reset();
  };
};
