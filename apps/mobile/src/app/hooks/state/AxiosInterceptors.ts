import create from 'zustand';
import axios from 'axios';
import { JwtHeaderInterceptor } from '../../interceptors/jwt-header.interceptor';

type AxiosInterceptorsState = {
  interceptors: number[];
  addInterceptor: (interceptorId: number) => void;
  clearInterceptors: () => void;
};

export const useAxiosInterceptors = create<AxiosInterceptorsState>((set, get) => {
  const array: number[] = [];
  return {
    interceptors: array,
    addInterceptor: (interceptorId: number) => set({ interceptors: [...get().interceptors, interceptorId] }),
    clearInterceptors: () => {
      console.log(`clearing interceptors (requests: ${ axios.interceptors.request })`);
      get().interceptors.forEach(interceptorId => {
        axios.interceptors.request.eject(interceptorId);
      });
      get().interceptors.forEach(interceptorId => {
        axios.interceptors.response.eject(interceptorId);
      });
      JwtHeaderInterceptor();
    },
  };
});
