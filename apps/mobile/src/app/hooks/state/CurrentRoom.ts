import create from 'zustand';

type CurrentRoomState = {
  roomId: string | number,
  setRoomId: (roomId: string | number) => void,
};

export const useCurrentRoom = create<CurrentRoomState>((set) => ({
  roomId: '',
  setRoomId: (roomId: string | number) => set({ roomId }),
}));
