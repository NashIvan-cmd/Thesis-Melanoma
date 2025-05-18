import { create } from 'zustand';

interface MoleState {
  moleId: string | null;
  photoUri: string | null;
  userId: string | null;

  setMoleId: (id: string) => void;
  setPhotoUri: (uri: string) => void;
  setUserId: (id: string) => void;

  setAll: (payload: { moleId: string; photoUri: string; userId: string }) => void;
  resetRecheck: () => void;
}

export const useRecheckMoleStore = create<MoleState>((set) => ({
  moleId: null,
  photoUri: null,
  userId: null,

  setMoleId: (id) => set({ moleId: id }),
  setPhotoUri: (uri) => set({ photoUri: uri }),
  setUserId: (id) => set({ userId: id }),

  setAll: ({ moleId, photoUri, userId }) => set({ moleId, photoUri, userId }),

  resetRecheck: () => set({ moleId: null, photoUri: null, userId: null }),
}));
