import { Prisma, PrismaClient } from "@prisma/client"
import { NotFoundError, ValidationError } from "../middlewares/error.middleware";
import { googleGenAi } from "./googleGenAi.util";

const prisma = new PrismaClient();

interface fitzDictionary<T> {
    [key: string]: T
}

export const familyHistoryDictionary: fitzDictionary<number> = {
    "Yes, immediate family (parent, sibling)" : 1,
    "Yes, extended family (aunt, uncle, grandparent)" : .50,
    "No family history of melanoma": .30
} 

export const immuneSystemDictionary: fitzDictionary<number> = {
    "Yes, due to an autoimmune disease": 1,
    "Yes, due to immunosuppressive treatment (e.g., chemotherapy, steroids)": .50,
    "No, I do not have a weakened immune system": .30
}

export const skinTypeDictionary: fitzDictionary<number> = {
    "Type 1": 1,
    "Type 2": .95,
    "Type 3": .85,
    "Type 4": .75,
    "Type 5 or 6": .50,
}

export const sunExposureDictionary: fitzDictionary<number> = {
    "Less than 1 hour": .15,       // Minimal risk
    "1-3 hours": .25,              // Low-moderate risk
    "4-7 hours": .50,              // Moderate risk
    "8-14 hours": .75,             // High risk
    "More than 14 hours": .90     // Very high risk
};


export const computationalModel = async(userId: string, modelAssessment: number) => {
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

        console.log({ modelAssessment });
        const probabilityMalignancy = modelAssessmentRiskScore(modelAssessment);
        const stringValueOfProbability = modelAssessmentThreshold(probabilityMalignancy);

        if (!fitzData) throw new NotFoundError("Fitzpatrick not found");

        console.log({ fitzData });

        if (fitzData.immune_health == undefined ) throw new ValidationError("Immune health undefined")
         
        if (fitzData.genetics == undefined) throw new ValidationError("Genetics undefined")

        if (fitzData.averageSunExposure == undefined) throw new ValidationError("Sun exposure undefined")

        // console.log("🔍 Debugging Dictionary Lookup Values:");
        // console.log("fitzData.skinType:", fitzData.skinType);
        // console.log("skinTypeValue:", skinTypeDictionary[fitzData.skinType]);

        // console.log("fitzData.immune_health:", fitzData.immune_health);
        // console.log("geneticsValue:", immuneSystemDictionary[fitzData.immune_health]);

        // console.log("fitzData.genetics:", fitzData.genetics);
        // console.log("familyHistoryValue:", familyHistoryDictionary[fitzData.genetics]);

        // console.log("fitzData.averageSunExposure:", fitzData.averageSunExposure);
        // console.log("sunExposureValue:", sunExposureDictionary[fitzData.averageSunExposure]);

        // Perform weighted calculations
        const skinTypeValue = skinTypeDictionary[fitzData.skinType];
        const geneticsValue = immuneSystemDictionary[fitzData.immune_health];
        const familyHistoryValue = familyHistoryDictionary[fitzData.genetics];
        const sunExposureValue = sunExposureDictionary[fitzData.averageSunExposure];

        // console.log("✅ Raw values for weighting:");
        // console.log({ skinTypeValue, geneticsValue, familyHistoryValue, sunExposureValue });

        // Log the weighted values
        console.log({ probabilityMalignancy });
        const modelAssessmentWeighted = getWeightedValue(modelAssessment, 0.5);
        const skinTypeWeighted = getWeightedValue(skinTypeValue, 0.2);
        const geneticsWeighted = getWeightedValue(geneticsValue, 0.05);
        const familyHistoryWeighted = getWeightedValue(familyHistoryValue, 0.05);
        const sunExposureWeighted = getWeightedValue(sunExposureValue, 0.2);

        console.log("✅ Weighted Values:");
        console.log({ skinTypeWeighted, geneticsWeighted, familyHistoryWeighted, sunExposureWeighted, modelAssessmentWeighted });

        const weightedSum = modelAssessmentWeighted + skinTypeWeighted + geneticsWeighted + familyHistoryWeighted + sunExposureWeighted;

        console.log("🧮 overallValue:", weightedSum);

        const normalized = weightedSum * 100;
        const riskScoreAssessment = normalized; 


        const nlpResponse = await googleGenAi(stringValueOfProbability, fitzData.skinType, fitzData.averageSunExposure, fitzData.immune_health, fitzData.genetics);
        
        console.log({ riskScoreAssessment });
        console.log({ nlpResponse });
        const data = {
            riskAssessment: riskScoreAssessment,
            nlpResponse,
            stringValueOfProbability: probabilityMalignancy.toString()
        }

        return data
    } catch (error) {
        throw error;
    }
}

const getWeightedValue = (value: number, weight: number) => {
    return value * weight;
}

export const modelAssessmentThreshold = (modelVal: number) => {
  if (modelVal < 30) {
    return "Likely Benign";
  } else if (modelVal >= 30 && modelVal < 60) {
    return "Possibly Benign";
  } else if (modelVal >= 60 && modelVal < 80) {
    return "Possibly Malignant";
  } else {
    return "Likely Malignant";
  }
};


export const modelAssessmentRiskScore = (val: number) => {
    if (val == 0) return 10;

    return val * 100;
}