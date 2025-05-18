import { useImageStore } from "@/services/imageStore";
import { useAssessmentStore } from "@/services/useAssessmentStore";
import { useRecheckMoleStore } from "@/services/useRecheckStore";
import { parse } from "@babel/core";
import { API_URL } from "@env";

interface assessmentResponse {
    id: string;
    risk_assessment: number;
    model_assessment: string;
    risk_summary: string;
    createdAt: Date;
    mole_id: string;
} 

export interface I_Assessment {
    moleData: {
        cloudId: string,
        x_coordinate: number,
        y_coordinate: number,
        body_part: string
    };
    assessment: {
        model_assessment: string,
        risk_assessment: number,
        risk_summary: string,
        createdAt: Date,
    };
}

interface molesArr {
    id: string;
    x_coordinate: number;
    y_coordinate: number;
}

interface MoleResponse {
    fetchedAllMoles: molesArr[];
}

export const moleData = async(accessToken: string, userId: string): Promise<I_Assessment | undefined> => {
    const { moleId, userId: recheckUserId, resetRecheck } = useRecheckMoleStore.getState();
    const {
        x_coordinate,
        y_coordinate,
        bodyOrientation,
        uri,
    } = useImageStore.getState();
    try {

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

        if (moleId) {
        // If moleId exists, call the update or recheck endpoint
        console.log('with Mole Id');
        const result = await fetch(`${API_URL}/v1/recheck/mole`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            authorization: accessToken ? `Bearer ${accessToken}` : '',
            },
            body: JSON.stringify({
                moleId,
                photoUri: uri,
                userId,
            }),
        });

        const data = await result.json();
        // handle data as needed
        if (!data) throw new Error("Parsed Result missing.");
        return data;
        } else {
        // Default new mole metadata endpoint
        console.log("No mole Id");
        const result = await fetch(`${API_URL}/v1/metadata/mole`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            authorization: accessToken ? `Bearer ${accessToken}` : '',
            },
            body: JSON.stringify({
            x_coordinate,
            y_coordinate,
            bodyOrientation,
            moleOwner: userId,
            photoUri: uri,
            }),
        });

        const data = await result.json();
        // handle data as needed
        if (!data) throw new Error("Parsed Result missing.");
        return data;
        }
        
    } catch (error) {
        console.error("Error @ mole data API", error);
    } finally {
        resetRecheck();
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

export const molesToDisplayWithOrientation = async(
    userId: string, 
    accessToken: string, 
    orientation: string
): Promise<MoleResponse | undefined> => {
    try {
        console.log(`${userId} -- ${accessToken} -- ${orientation}`);
        const result = await fetch(`${API_URL}/v1/details/orientation/mole`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": accessToken ? `Bearer ${accessToken}` : ''
            },
            body: JSON.stringify({
                userId,
                orientation
            })
        });

        const data = await result.json();

        console.log("Mole data with orientation", data);

        return data
    } catch (error) {
        console.error("Error @ moles to display API", error);
    }
}


