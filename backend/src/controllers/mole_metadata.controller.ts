import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { computationalModel, createAssessment, createMoleMetadata, fetchMole, getAllMoleByUserId, getMoleById, modelApi, moleFetchAllByUser, updateMole } from "../services/mole_metadata.service";
import { bodyOrientationParser } from "../utils/mole_metadata.utils";
import { ValidationError } from "../middlewares/error.middleware";
import { MoleData, signedUrlGenerator } from "../utils/cloudinary";

const prisma = new PrismaClient();

interface Imole_metadata {
    x_coordinate: string;
    y_coordinate: string;
    body_part: string; // Expecting a name
    bodyOrientation: string; // Either front or back
    moleOwner: string;
    photoUri: string;
    id: string;
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
            id 
        }: Imole_metadata = req.body;
    try {
    
        const parsedX = parseInt(x_coordinate);
        const parsedY = parseInt(y_coordinate);

        const parsedBodyOrientation = bodyOrientationParser(bodyOrientation);
        // I am not satisfied with this logic.
        const thisUserMole = id ? await fetchMole(id) : '';
        let assessment: I_Asessment;

        // const modelResult = await modelApi(photoUri);

        // console.log({ modelResult });
        if (!thisUserMole) {
            const result = await createMoleMetadata(
            parsedX, 
            parsedY, 
            body_part,
            parsedBodyOrientation,
            photoUri, 
            moleOwner
            );

            // const fitzData = await computationalModel(moleOwner, "Benign");
            // assessment = await createAssessment(id, fitzData.riskAssessment, fitzData.nlpResponse);
        } else {
            
        }

        // Do I return the mole back to frontend?
        // The image needs to be returned

        res.status(201).json({ message: "Successful" });

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