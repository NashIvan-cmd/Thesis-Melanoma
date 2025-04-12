import { useImageStore } from "@/services/imageStore";
import { API_URL } from "@env";

export const moleData = async(accessToken: string, userId: string) => {
    try {
        const {
            x_coordinate,
            y_coordinate,
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
            moleOwner: userId,
            photoUri: uri,

        })
    });
    } catch (error) {
        console.error("Error @ mole data API", error);
    }
}