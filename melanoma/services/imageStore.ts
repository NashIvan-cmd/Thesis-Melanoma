import { create } from 'zustand';

interface I_ImageStore {
    x_coordinate: number;
    y_coordinate: number;
    uri: string | null;
    bodyOrientation: string;
    bodyPartName: string;
    setCoordinates: (x: number, y: number, bodyOrientation: string) => void;
    setImageData: (uri: string) => void;
    setBodyPartName: (name: string) => void;
    resetUri: () => void;
    reset: () => void;
}

export const useImageStore = create<I_ImageStore>() ((set) => ({
    x_coordinate: 0,
    y_coordinate: 0,
    bodyOrientation: '',
    uri: '',
    bodyPartName: '',

    setCoordinates: (x: number, y: number, bodyOrientation: string) => set(() => ({ 
        x_coordinate: x, 
        y_coordinate: y, 
        bodyOrientation: bodyOrientation 
    })),
    setImageData: (uri: string) => set(() => ({ uri: uri })),
    setBodyPartName: (name: string) => set(() => ({ bodyPartName: name })),

    resetUri: () => set({ uri: null }),
    reset: () =>
    set({
        x_coordinate: 0,
        y_coordinate: 0,
        bodyOrientation: '',
        uri: '',
        bodyPartName: '',
    }),
}))