import { accessTokenInterceptor } from "@/interceptor/accessToken.interceptor";
import { useFitzpatrickStore } from "@/services/fitzPatrickStore";
import { API_URL } from "@env";

export const fitzpatrickData = async(userId: string, accessToken: string, session: string) => {
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
        weeklyHoursSun
    } = useFitzpatrickStore.getState();
    
    try {
        const result = await fetch(`${API_URL}/v1/fitzpatrick`, {
            method: "POST",
            headers: {
                "Content-Type":  "application/json",
                "authorization": accessToken ? `Bearer ${accessToken}` : '',
                "session": session ? `Bearer ${session}` : '',
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
                weeklyHoursSun,
                userId
            })
        });

        const data = await result.json();
        console.log("Test refresher", data);
        await accessTokenInterceptor(data);
        return result;
    } catch (error) {
        console.error("Error @ fitzPatrick API", error);
    }
}