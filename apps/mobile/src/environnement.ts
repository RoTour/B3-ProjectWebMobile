import { Platform } from 'react-native';

export const environnement = {
  apiBaseUrl: Platform.OS === 'android' ? 'http://10.0.2.2:3333/api' : 'http://localhost:3333/api',
};
