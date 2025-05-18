import { create } from "zustand";

interface I_assessmentStore {
    uri: string;
    xCoordinate: number;
    yCoordinate: number;
    model_assessment: string;
    risk_assessment: number;
    risk_summary: string;
    body_part: string;
    createdAt: Date | string;
    setAssessmentData: (
        uri: string, 
        xCoordinate: number, 
        yCoordinate: number, 
        model_assessment: string, 
        risk_assessment: number,
        risk_summary: string,
        body_part: string,
        createdAt: Date
    ) => void;
    reset: () => void;
}

export const useAssessmentStore = create<I_assessmentStore>() ((set) => ({
    uri: '',
    xCoordinate: 0,
    yCoordinate: 0,
    model_assessment: '',
    risk_assessment: 0,
    risk_summary: '',
    body_part: '',
    createdAt: '',

    setAssessmentData: (
        uri: string, 
        xCoordinate: number, 
        yCoordinate: number, 
        model_assessment: string, 
        risk_assessment: number,
        risk_summary: string,
        body_part: string,
        createdAt: Date,
    ) => set(() => ({ 
        uri: uri,
        xCoordinate,
        yCoordinate,
        model_assessment,
        risk_assessment,
        risk_summary,
        body_part,
        createdAt
    })),

    reset: () => set({
       uri: '',
        xCoordinate: 0,
        yCoordinate: 0,
        model_assessment: '',
        risk_assessment: 0,
        risk_summary: '',
        body_part: '',
        createdAt: '' 
    })
}))