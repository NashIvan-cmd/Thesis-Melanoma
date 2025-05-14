import { Prisma, PrismaClient } from "@prisma/client"
import { NotFoundError, ValidationError } from "../middlewares/error.middleware";
import { googleGenAi } from "./googleGenAi.util";

const prisma = new PrismaClient();

interface fitzDictionary<T> {
    [key: string]: T
}

export const familyHistoryDictionary: fitzDictionary<number> = {
    "Yes, immediate family (parent, sibling)" : 100,
    "Yes, extended family (aunt, uncle, grandparent)" : 50,
    "No, I do not have a weakened immune system": 0
} 

export const immuneSystemDictionary: fitzDictionary<number> = {
    "Yes, due to an autoimmune disease": 100,
    "Yes, due to immunosuppressive treatment (e.g., chemotherapy, steroids)": 50,
    "No, I do not have a weakened immune system": 0
}

export const skinTypeDictionary: fitzDictionary<number> = {
    "Type 1": 90,
    "Type 2": 75,
    "Type 3": 50,
    "Type 4": 25,
    "Type 5 or 6": 10,
}

export const sunExposureDictionary: fitzDictionary<number> = {
    "Less than 1 hour": 10,       // Minimal risk
    "1-3 hours": 25,              // Low-moderate risk
    "4-7 hours": 50,              // Moderate risk
    "8-14 hours": 75,             // High risk
    "More than 14 hours": 90     // Very high risk
};


export const computationalModel = async(userId: string, modelAssessment: string) => {
    // 50% Model Assessment CNN
    // 20% Sun Exposure
    // 5% Family History
    // 5% Immune Health
    // 20% Skin Type
    try {
        const fitzData = await prisma.user_FitzPatrick.findUnique({
            where: { user_account_foreignkey: userId },
            select: { 
                immune_health: true, 
                genetics: true, 
                skinType: true,
                averageSunExposure: true  
            }
        });

        if (!fitzData) throw new NotFoundError("Fitzpatrick not found");

        console.log({ fitzData });

        if (fitzData.immune_health == undefined ) throw new ValidationError("Immune health undefined")
         

        if (fitzData.genetics == undefined) throw new ValidationError("Genetics undefined")

        if (fitzData.averageSunExposure == undefined) throw new ValidationError("Sun exposure undefined")

        const skinTypeValue = skinTypeDictionary[fitzData.skinType];
        const geneticsValue = immuneSystemDictionary[fitzData.immune_health ];
        const familyHistoryValue = familyHistoryDictionary[fitzData.genetics];
        const sunExposureValue = sunExposureDictionary[fitzData.averageSunExposure];
        // Need to compute the risk assessment
        
        const skinTypeWeighted = getWeightedValue(skinTypeValue, 0.2);
        const geneticsWeighted = getWeightedValue(geneticsValue, 0.05);
        const familyHistoryWeighted = getWeightedValue(familyHistoryValue, 0.05);
        const sunExposureWeighted = getWeightedValue(sunExposureValue, 0.2);
        
        const overallValue = skinTypeWeighted + geneticsWeighted + familyHistoryWeighted + sunExposureWeighted;
        
        const riskScoreAssessment = overallValue / 4; 


        const nlpResponse = await googleGenAi(fitzData.skinType, fitzData.averageSunExposure, fitzData.immune_health, fitzData.genetics);
        
        console.log({ nlpResponse });
        const data = {
            riskAssessment: riskScoreAssessment,
            nlpResponse
        }

        return data
    } catch (error) {
        throw error;
    }
}

const getWeightedValue = (value: number, weight: number) => {
    return value * weight;
}