import { showNotification } from '@mantine/notifications';
import { LoginDto } from '@projetweb-b3/dto';
import axios from 'axios';
import { useState } from 'react';

export default function useLogin() {
  const [token, setToken] = useState<null | string>(null);
  const login = async (payload: LoginDto) => {
    try {
      const { data } = await axios.post<{ accessToken: string }>(
        `/auth/login`,
        payload
      );
      setToken(data.accessToken);
      showNotification({
        message: 'Connexion réussie',
      });
      return null;
    } catch (e) {
      setToken(null);
      throw e;
    }
  };
  return { login, token };
}
