import { accessTokenInterceptor } from "@/interceptor/accessToken.interceptor";
import { useImageStore } from "@/services/imageStore";
import { useAssessmentStore } from "@/services/useAssessmentStore";
import { useRecheckMoleStore } from "@/services/useRecheckStore";
import { parse } from "@babel/core";
import { API_URL } from "@env";
import mime from 'mime';

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
    const { moleId, userId: recheckUserId, resetRecheck, bodyPartNameV2 } = useRecheckMoleStore.getState();
    const {
        x_coordinate,
        y_coordinate,
        bodyOrientation,
        uri,
        bodyPartName
    } = useImageStore.getState();
    try {

        console.log("Trying the model");

        if (!uri) {
            console.log("No uri", uri);
            return;
        }

        let modelResponse;

        try {
            console.log("Model request starts here");

            const fileType = mime.getType(uri) || 'image/jpeg';
            const fileBlob = {
                uri: uri, // your `file://...` path
                name: uri.split('/').pop() || 'image.jpg',
                type: fileType
            };

            const formData = new FormData();
            formData.append('file', fileBlob as any);

            const res = await fetch("https://melanoma-api-xfxl.onrender.com/predict", {
                method: "POST",
                body: formData,
                headers: {
                    // Let fetch automatically set the correct Content-Type (multipart/form-data with boundary)
                    // Do NOT manually set 'Content-Type'
                },
            });

            console.log("Model response done");

            console.log({ res });
            if (!res.ok) {
                throw new Error(`Server responded with status: ${res.status}`);
            }
            
             modelResponse = await res.json();
            console.log({ modelResponse });
        } catch (error) {
            console.error("Error @  model req: ", error);
        }

        // ====Python Model Above ==== Typescript backend Below

        const modelProbability = modelResponse.probability
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
                    modelResponse: modelProbability,
                    bodyPartName
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
                modelResponse: modelProbability,
                bodyPartName: bodyPartNameV2
            }),
        });

        const data = await result.json();
        // handle data as needed
        if (!data) throw new Error("Parsed Result missing.");

        accessTokenInterceptor(data);
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

        const data = await result.json();
        console.log("Kei Data: ", data);
        accessTokenInterceptor(data);
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
        accessTokenInterceptor(data);
        return data
    } catch (error) {
        console.error("Error @ moles to display API", error);
    }
}


