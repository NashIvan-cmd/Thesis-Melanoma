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

        if (!uri) {
            return;
        }

        // const response = await fetch(uri);
        // const blob = await response.blob();
    
        // // Create FormData and append the file
        // const formData = new FormData();
        // formData.append("file", {
        // uri: uri,
        // name: "image.jpg",
        // type: "image/jpeg"
        // } as any);

        // const res = await fetch("https://melanoma-api-1.onrender.com/predict", {
        // method: "POST",
        // body: formData,
        // });

        
        // if (!res.ok) {
        // throw new Error(`Server responded with status: ${res.status}`);
        // }
        
        // const parsedRes = await res.json();

        // console.log({ parsedRes });

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