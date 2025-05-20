import { BodyPart, Prisma, PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { createAssessment, createMoleMetadata, fetchMole, getAllMoleByUserId, getAllMoleByUserIdWithOrientation, getMoleById, modelApi, moleFetchAllByUser, recheckMole, updateMole, findMoleAssessment, updateAssessment } from "../services/mole_metadata.service";
import { bodyOrientationParser } from "../utils/mole_metadata.utils";
import { ValidationError } from "../middlewares/error.middleware";
import { MoleData, signedUrlGenerator } from "../utils/cloudinary";
import { computationalModel } from "../utils/fitzpatrick.utils";

const prisma = new PrismaClient();

interface Imole_metadata {
    x_coordinate: string;
    y_coordinate: string;
    body_part: string; // Expecting a name
    bodyOrientation: string; // Either front or back
    moleOwner: string;
    photoUri: string;
    id: string;
    modelAssessment: string;
}

interface Imole_metadataReponse {
    x_coordinate: number;
    y_coordinate: number;
    body_part: string;
    id: string;
    body_orientation: string;
    mole_owner: string;
    cloudId: string;
    publicId: string;
    createdAt: Date;
}

export interface I_Asessment {
    id: string;
    risk_assessment: number;
    model_assessment: string;
    risk_summary: string;
    createdAt: Date;
    mole_id: string;
}

// Processing the image
// Automatic?

export const moleMetadataController = async(req: Request, res: Response, next: NextFunction) => { 
        console.log("Client Request: ", req.body);
        const { 
            x_coordinate, 
            y_coordinate,
            body_part,
            bodyOrientation,
            moleOwner,
            photoUri,
            id,
            modelAssessment
        }: Imole_metadata = req.body;
    try {
    
        const parsedX = parseInt(x_coordinate);
        const parsedY = parseInt(y_coordinate);
        const model_assessment = parseFloat(modelAssessment);

        const parsedBodyOrientation = bodyOrientationParser(bodyOrientation);
        // I am not satisfied with this logic.
        const thisUserMole = id ? await fetchMole(id) : '';
        let assessment: I_Asessment;
        let responseResult: Imole_metadataReponse;

        // const modelResult = await modelApi(photoUri);

        // console.log({ modelResult });
        // if (!thisUserMole) {
        //     const result = await createMoleMetadata(
        //     parsedX, 
        //     parsedY, 
        //     body_part,
        //     parsedBodyOrientation,
        //     photoUri, 
        //     moleOwner
        //     );

        //     responseResult = result;
        //     const fitzData = await computationalModel(moleOwner, model_assessment);
        //     assessment = await createAssessment(id, fitzData.riskAssessment, fitzData.nlpResponse);
        // } else {
        //     // Update the picture for that mole and the response
        //     const date = new Date(Date.now());
        //     assessment = { 
        //         id: 'sadasd', 
        //         risk_assessment: 10, 
        //         risk_summary: 'Wash', 
        //         createdAt: date, 
        //         mole_id: 'asdasd',
        //         model_assessment: 'sadasdas'
        //     }
        // }

        const result = await createMoleMetadata(
            parsedX, 
            parsedY, 
            body_part,
            parsedBodyOrientation,
            photoUri, 
            moleOwner
        );

        responseResult = result;
        const compModelResponse = await computationalModel(moleOwner, model_assessment);
        assessment = await createAssessment(result.id, compModelResponse.riskAssessment, compModelResponse.nlpResponse, compModelResponse.stringValueOfProbability);

        // Do I return the mole back to frontend?
        // The image needs to be returned

        res.status(201).json({ 
            message: "Successful", 
            assessment,
            moleData: responseResult 
        });

    } catch (error) {
        next (error);
    }
}

// All moles are being fetched
export const moleFetchAllController = async(req: Request, res: Response, next: NextFunction) => {
    const { moleOwnerId } = req.body
    try {
        
        if (!moleOwnerId || typeof moleOwnerId == "string") {
            throw new Error("moleOwnerId must be a non-empty string");
        }
        const allUserMole = await moleFetchAllByUser(moleOwnerId);
        
        res.status(200).json({
            allUserMole
        });
    } catch (error) {
        next (error);
    }
}

// This needs to be POST method
// Regardless of orientation
export const getAllLatestMoleController = async(req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    console.log({ userId });
    try {
        
        if (!userId) {
            throw new ValidationError("Missing user id");
        }
        const fetchedAllMoles = await getAllMoleByUserId(userId) as MoleData[];

        // const manipulatedMoles = await (fetchedAllMoles);

        res.status(200).json({
            fetchedAllMoles
        })
    } catch (error) {
        next (error);
    }
}

// Must have orientation
export const getAllMolesWithOrientationController = async(req: Request, res: Response, next: NextFunction) => {
    const { userId, orientation } = req.body;
    console.log(`Fetch mole with orientation ${userId} and ${orientation}`);
    try {
        
        if (!userId) {
            throw new ValidationError("Missing user id");
        }

        const parsedOrientation = bodyOrientationParser(orientation);
        const fetchedAllMoles = await getAllMoleByUserIdWithOrientation(userId, parsedOrientation as BodyPart) as MoleData[];

        // No longer needed since we store URL on database
        // const manipulatedMoles = await (fetchedAllMoles);

        res.status(200).json({
            fetchedAllMoles
        })
    } catch (error) {
        next (error);
    }
}

export const fetchMoleById = async(req: Request, res: Response, next: NextFunction) => {
    const { moleId } = req.body;
    try {
        if (!moleId) throw new ValidationError("Missing mole Id");

        const moleData = await getMoleById(moleId);

        if (!moleData) {
            res.status(404).json({
                success: false,
                message: "Mole not found"
            });

            return;
        }

        res.status(200).json({
            moleData
        })
    } catch (error) {
        next (error);
    }
}


// This one is for changing the name
export const updateMoleController = async(req: Request, res: Response, next: NextFunction) => {
    const { moleId, bodyPart } = req.body
    console.log(req.body);
    try {
        const result = await updateMole(moleId, bodyPart);

        if (!result) {
            res.status(500).json({ message: "Internal server error" });
            return
        }

        res.status(200).json({ result });
    } catch (error) {
        next (error);
    }
}

export const recheckMoleController = async(req: Request, res: Response, next: NextFunction) => {
        const { moleId, photoUri, userId, modelAssessment } = req.body
        console.log('MoleId', moleId);
    try {

        if (!userId) throw new ValidationError("Missing user id");
        if (!modelAssessment) throw new ValidationError("Missing model assessment");

        const moleData = await recheckMole(moleId, photoUri, userId);
        const moleAssessment = await findMoleAssessment(moleId);
        const model_assessment = parseFloat(modelAssessment);
        const compModelResponse = await computationalModel(userId, model_assessment);
        const assessmentResult = await updateAssessment(moleAssessment,  compModelResponse.nlpResponse, compModelResponse.riskAssessment, compModelResponse.stringValueOfProbability);

        res.status(200).json({ 
            message: "Successful", 
            assessment: assessmentResult,
            moleData: moleData 
        });
    } catch (error) {
        next (error);
    }
}