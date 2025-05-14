import { Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "../middlewares/error.middleware";

const prisma = new PrismaClient();

interface FitzpatrickData {
    eyeColor: string;
    hairColor: string;
    skinColor: string;
    freckles: string;
    sunBurnReaction: string;
    tanReaction: string;
    brownAfterSun: string;
    lastSunExposure: string;
    faceReactionToSun: string;
    faceSunExposure: string;
    familyHistoryMelanoma: string;
    immuneHealth: string;
    age: string;
    gender: string;
    userId: string;
    weeklyHoursSun: string;
  }

  const assessSkinType = (
    hairColor: number,
    eyeColor: number,
    skinColor: number,
    freckles: number,
    sunBurnReaction: number,
    tanReaction: number,
    brownAfterSun: number,
    lastSunExposure: number,
    faceReactionToSun: number,
    faceSunExposure: number,
) => {
    const totalPoints = 
        hairColor + 
        eyeColor + 
        skinColor + 
        freckles +
        sunBurnReaction +
        tanReaction +
        brownAfterSun +
        lastSunExposure +
        faceReactionToSun +
        faceSunExposure;

    console.log({ totalPoints });

    let skinTypeAssessment: string;

    if (totalPoints >= 0 && totalPoints <= 7) {
        skinTypeAssessment = "Type 1";
    } else if (totalPoints >= 8 && totalPoints <= 16) {
        skinTypeAssessment = "Type 2";
    } else if (totalPoints >= 17 && totalPoints <= 25) {
        skinTypeAssessment = "Type 3";
    } else if (totalPoints >= 26 && totalPoints <= 30) {
        skinTypeAssessment = "Type 4";
    } else {
        skinTypeAssessment = "Type 5 or 6";
    }

    return skinTypeAssessment;
};


export const createFitzPatrick = async(data: FitzpatrickData) => {
    try {
        
        const hair_color = parseInt(data.hairColor, 10);
        const eye_color = parseInt(data.eyeColor, 10);
        const age = parseInt(data.age, 10);
        const skin_tone = parseInt(data.skinColor, 10);
        const freckles = parseInt(data.freckles, 10);
        const skinSunReaction = parseInt(data.sunBurnReaction, 10);
        const turnBrownDegree = parseInt(data.brownAfterSun, 10);
        const sunExposureTurnBrown = parseInt(data.tanReaction, 10);
        const faceReaction = parseInt(data.faceReactionToSun, 10);
        const bodyLastSunExposure = parseInt(data.lastSunExposure, 10);
        const exposedFaceToSun = parseInt(data.faceSunExposure, 10);


        const skinTypeAssessment = assessSkinType(
            hair_color,
            eye_color,
            skin_tone,
            freckles,
            skinSunReaction,
            sunExposureTurnBrown,
            turnBrownDegree,
            bodyLastSunExposure,
            faceReaction,
            exposedFaceToSun
        );

        const result = await prisma.user_FitzPatrick.create({
            data: {
                hair_color,
                eye_color,
                age,
                skin_tone,
                freckles,
                skinSunReaction,
                turnBrownDegree,
                sunExposureTurnBrown,
                faceReaction,
                bodyLastSunExposure,
                exposedFaceToSun,
                immune_health: data.immuneHealth,
                gender: data.gender,
                genetics: data.familyHistoryMelanoma,
                skinType: skinTypeAssessment,
                user_account_foreignkey: data.userId,
                averageSunExposure: data.weeklyHoursSun
            }
        })

        if (result) {
            return skinTypeAssessment;
        } else {
            return "false";
        }
    } catch (error) {
        throw error;
    }
}

export const updateFitzPatrick = async (data: FitzpatrickData, id: string) => {
    try {
        const hair_color = parseInt(data.hairColor, 10);
        const eye_color = parseInt(data.eyeColor, 10);
        const age = parseInt(data.age, 10);
        const skin_tone = parseInt(data.skinColor, 10);
        const freckles = parseInt(data.freckles, 10);
        const skinSunReaction = parseInt(data.sunBurnReaction, 10);
        const turnBrownDegree = parseInt(data.brownAfterSun, 10);
        const sunExposureTurnBrown = parseInt(data.tanReaction, 10);
        const faceReaction = parseInt(data.faceReactionToSun, 10);
        const bodyLastSunExposure = parseInt(data.lastSunExposure, 10);
        const exposedFaceToSun = parseInt(data.faceSunExposure, 10);

        const skinTypeAssessment = assessSkinType(
            hair_color,
            eye_color,
            skin_tone,
            freckles,
            skinSunReaction,
            sunExposureTurnBrown,
            turnBrownDegree,
            bodyLastSunExposure,
            faceReaction,
            exposedFaceToSun
        );

        const result = await prisma.user_FitzPatrick.update({
            where: { id },
            data: {
                hair_color,
                eye_color,
                age,
                skin_tone,
                freckles,
                skinSunReaction,
                turnBrownDegree,
                sunExposureTurnBrown,
                faceReaction,
                bodyLastSunExposure,
                exposedFaceToSun,
                immune_health: data.immuneHealth,
                gender: data.gender,
                genetics: data.familyHistoryMelanoma,
                skinType: skinTypeAssessment,
                user_account_foreignkey: data.userId,
                averageSunExposure: data.weeklyHoursSun
            }
        });

        if (result) {
            return skinTypeAssessment;
        } else {
            return "false";
        }
    } catch (error) {
        throw error;
    }
};


export const checkExistingFitzPatrickRecord = async(userId: string): Promise<string | null> => {
    try {
        const result = await prisma.user_FitzPatrick.findUnique({
            where: { user_account_foreignkey: userId }
        })

        if (!result) return null;
        
        return result.id
    } catch (error) {
        throw error;
    }
}