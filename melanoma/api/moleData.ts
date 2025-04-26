import { useImageStore } from "@/services/imageStore";
import { API_URL } from "@env";

export const moleData = async(accessToken: string, userId: string): Promise<object | undefined> => {
    try {
        const {
            x_coordinate,
            y_coordinate,
            bodyOrientation,
            uri,
        } = useImageStore.getState();

        const result = await fetch(`${API_URL}/v1/metadata/mole`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": accessToken ? `Bearer ${accessToken}` : ''
            },
            body: JSON.stringify({
                x_coordinate,
                y_coordinate,
                bodyOrientation,
                moleOwner: userId,
                photoUri: uri,

            })
         });
        
        const parsedResult = await result.json();
        
        return parsedResult;
    } catch (error) {
        console.error("Error @ mole data API", error);
    }
}

export const molesToDisplay = async(userId: string, accessToken: string) => {
    try {
        const result = await fetch(`${API_URL}/v1/details/mole`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": accessToken ? `Bearer ${accessToken}` : ''
            },
            body: JSON.stringify({
                userId
            })
        });

        return result
    } catch (error) {
        console.error("Error @ moles to display API", error);
    }
}