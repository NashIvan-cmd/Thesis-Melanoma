import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { createMoleMetadata, fetchMole, getAllMoleByUserId, moleFetchAllByUser } from "../services/mole_metadata.service";
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
        const thisUserMole = id ? await fetchMole(id) : 
        await createMoleMetadata(
            parsedX, 
            parsedY, 
            body_part,
            parsedBodyOrientation,
            photoUri, 
            moleOwner
        );
        
        if (!thisUserMole) {
            res.status(417).json({
                success: false,
                message: 'Expectation Failed'
            });
            return;
        }

        // Do I return the mole back to frontend?
        // The image needs to be returned

        res.status(201).json({ message: "Successful" });

    } catch (error) {
        next (error);
    }
}

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

        const manipulatedMoles = await signedUrlGenerator(fetchedAllMoles);

        res.status(200).json({
            manipulatedMoles
        })
    } catch (error) {
        next (error);
    }
}