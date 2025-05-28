import { create } from 'zustand';

interface FitzpatrickState { 
  // Questions 1
  eyeColor: string;
  setEyeColor: (value: string) => void;
  hairColor: string;
  setHairColor: (value: string) => void;
  skinColor: string;
  setSkinColor: (value: string) => void;

  // Questions 2
  freckles: string;
  setFreckles: (value: string) => void;
  sunBurnReaction: string;
  setSunBurnReaction: (value: string) => void;
  tanReaction: string;
  setTanReaction: (value: string) => void;

  // Questions 3
  brownAfterSun: string;
  setBrownAfterSun: (value: string) => void;
  faceReactionToSun: string;
  setFaceReactionToSun: (value: string) => void;
  lastSunExposure: string;
  setLastSunExposure: (value: string) => void;

  // Questions 4
  faceSunExposure: string;
  setFaceSunExposure: (value: string) => void;

  familyHistoryMelanoma: string;
  setFamilyHistoryMelanoma: (value: string) => void;
  
  immuneHealth: string;
  setImmuneHealth: (value: string) => void;

  age: string;
  setAge: (value: string) => void;

  gender: string;
  setGender: (value: string) => void;

  weeklyHoursSun: string,
  setWeeklyHoursSun: (value: string) => void;

  reset: () => void;

}

export const useFitzpatrickStore = create<FitzpatrickState>((set) => ({
  // Questions 1 (Eye, Hair, Skin)
  eyeColor: '',
  setEyeColor: (value) => set({ eyeColor: value }),

  hairColor: '',
  setHairColor: (value) => set({ hairColor: value }),

  skinColor: '',
  setSkinColor: (value) => set({ skinColor: value }),

  // Questions 2 (Freckles, Sun Burn Reaction, Tan Reaction)
  freckles: '',
  setFreckles: (value) => set({ freckles: value }),

  sunBurnReaction: '',
  setSunBurnReaction: (value) => set({ sunBurnReaction: value }),

  tanReaction: '',
  setTanReaction: (value) => set({ tanReaction: value }),

  // Questions 3 (Brown after sun, Face reaction to sun, Last sun exposure)
  brownAfterSun: '',
  setBrownAfterSun: (value) => set({ brownAfterSun: value }),

  faceReactionToSun: '',
  setFaceReactionToSun: (value) => set({ faceReactionToSun: value }),

  lastSunExposure: '',
  setLastSunExposure: (value) => set({ lastSunExposure: value }),

  // Questions 4 (Face sun exposure)
  faceSunExposure: '',
  setFaceSunExposure: (value) => set({ faceSunExposure: value }),

  familyHistoryMelanoma: '',
  setFamilyHistoryMelanoma: (value) => set({ familyHistoryMelanoma: value }),
  
  immuneHealth: '',
  setImmuneHealth: (value) => set({ immuneHealth: value }),

  age: '',
  setAge: (value: string) => set({ age: value }),

  gender: '',
  setGender: (value: string) => set({ gender: value }),

  weeklyHoursSun: '',
  setWeeklyHoursSun: (value: string) => set({ weeklyHoursSun: value }),

  reset: () =>
  set({
    eyeColor: '',
    hairColor: '',
    skinColor: '',
    freckles: '',
    sunBurnReaction: '',
    tanReaction: '',
    brownAfterSun: '',
    faceReactionToSun: '',
    lastSunExposure: '',
    faceSunExposure: '',
    familyHistoryMelanoma: '',
    immuneHealth: '',
    age: '',
    gender: '',
    weeklyHoursSun: ''
  }),
}));
