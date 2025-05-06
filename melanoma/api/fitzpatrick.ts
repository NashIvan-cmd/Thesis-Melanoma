import { useFitzpatrickStore } from "@/services/fitzPatrickStore";
import { API_URL } from "@env";

export const fitzpatrickData = async(userId: string, accessToken: string) => {
    const { 
        eyeColor, 
        hairColor, 
        skinColor, 
        freckles, 
        sunBurnReaction, 
        tanReaction, 
        brownAfterSun,
        lastSunExposure,
        faceReactionToSun,
        faceSunExposure,
        familyHistoryMelanoma,
        immuneHealth,
        age,
        gender,
    } = useFitzpatrickStore.getState();
    
    try {
        const result = await fetch(`${API_URL}/v1/fitzpatrick`, {
            method: "POST",
            headers: {
                "Content-Type":  "application/json",
                "authorization": accessToken ? `Bearer ${accessToken}` : ''
            },
            body: JSON.stringify({
                eyeColor, 
                hairColor, 
                skinColor, 
                freckles, 
                sunBurnReaction, 
                tanReaction, 
                brownAfterSun,
                lastSunExposure,
                faceReactionToSun,
                faceSunExposure,
                familyHistoryMelanoma,
                immuneHealth,
                age,
                gender,
                userId
            })
        });

        return result;
    } catch (error) {
        console.error("Error @ fitzPatrick API", error);
    }
}