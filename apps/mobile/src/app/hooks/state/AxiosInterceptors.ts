import create from 'zustand';
import axios from 'axios';

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
      get().interceptors.forEach(interceptorId => {
        axios.interceptors.request.eject(interceptorId);
      });
      get().interceptors.forEach(interceptorId => {
        axios.interceptors.response.eject(interceptorId);
      });
    },
  };
});
