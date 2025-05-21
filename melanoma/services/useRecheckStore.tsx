import { create } from 'zustand';

interface MoleState {
  moleId: string | null;
  photoUri: string | null;
  userId: string | null;
  bodyPartNameV2: string
  setMoleId: (id: string) => void;
  setPhotoUri: (uri: string) => void;
  setUserId: (id: string) => void;
  setBodyPartNameV2: (name: string) => void;
  setAll: (payload: { moleId: string; photoUri: string; userId: string }) => void;
  resetRecheck: () => void;
}

export const useRecheckMoleStore = create<MoleState>((set) => ({
  moleId: null,
  photoUri: null,
  userId: null,
  bodyPartNameV2: '',

  setMoleId: (id) => set({ moleId: id }),
  setPhotoUri: (uri) => set({ photoUri: uri }),
  setUserId: (id) => set({ userId: id }),

  setAll: ({ moleId, photoUri, userId }) => set({ moleId, photoUri, userId }),
  setBodyPartNameV2: (name: string) => set(() => ({ bodyPartNameV2: name })),

  resetRecheck: () => set({ moleId: null, photoUri: null, userId: null }),
}));
