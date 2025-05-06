import { create } from "zustand";
import { Mole } from "@/app/(app)/(tabs)/(photo)";
import { selectionAsync } from "expo-haptics";

interface ImoleDataStore {
    selectedMole: Mole | null; 
    setSelectedMole: (mole: Mole) => void;
    setSelectedMoleToNull: () => void;
}


export const useMoleDataStore = create<ImoleDataStore>((set) => ({
    selectedMole: null,
    setSelectedMole: (mole) => set({ selectedMole: mole }),
    setSelectedMoleToNull: () => ({ selectedMole: null })

}))