import { create } from 'zustand';

interface I_ImageStore {
    x_coordinate: number;
    y_coordinate: number;
    uri: string;
    setCoordinates: (x: number, y: number) => void;
    setImageData: (uri: string) => void;
    reset: () => void;
}

export const useImageStore = create<I_ImageStore>() ((set) => ({
    x_coordinate: 0,
    y_coordinate: 0,
    moleOwner: '',
    uri: '',

    setCoordinates: (x: number, y: number) => set(() => ({ x_coordinate: x, y_coordinate: y })),
    setImageData: (uri: string) => set(() => ({ uri: uri })),

    reset: () =>
    set({
        x_coordinate: 0,
        y_coordinate: 0,
        uri: '',
    }),
}))