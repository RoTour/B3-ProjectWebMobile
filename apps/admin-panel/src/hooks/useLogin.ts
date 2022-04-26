import { showNotification } from '@mantine/notifications';
import { LoginDto } from '@projetweb-b3/dto';
import axios from 'axios';
import create from 'zustand';

interface LoginState {
  token: string | null;
  login: (loginDto: LoginDto) => Promise<void>;
}

export default create<LoginState>((set) => ({
  token: null,
  login: async (loginDto: LoginDto) => {
    try {
      const { data } = await axios.post<{ accessToken: string }>(
        `/auth/login?admin=true`,
        loginDto
      );
      set({ token: data.accessToken });
      console.log(data.accessToken);
      showNotification({
        message: 'Connexion réussie',
      });
    } catch (e) {
      set({ token: null });
      showNotification({
        title: 'Login failed',
        message: e instanceof Error ? e.message : 'Unexpected Error',
        color: 'red',
      });
      throw e;
    }
  },
}));
