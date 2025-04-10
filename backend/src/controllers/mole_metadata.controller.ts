import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { createMoleMetadata, fetchMole } from "../services/mole_metadata.service";

const prisma = new PrismaClient();

interface Imole_metadata {
    x_coordinate: string;
    y_coordinate: string;
    body_part: string; // Expecting a name
    moleOwner: string;
    photoUri: string;
    id: string;
}

// Processing the image
// Automatic?

export const mole_metadata_controller = async(req: Request, res: Response, next: NextFunction) => { 
        console.log("Client Request: ", req.body);
        const { 
            x_coordinate, 
            y_coordinate,
            body_part,
            moleOwner,
            photoUri,
            id 
        }: Imole_metadata = req.body;
    try {
    
        const parsedX = parseInt(x_coordinate);
        const parsedY = parseInt(y_coordinate);
        // I am not satisfied with this logic.
        const thisUserMole = id ? await fetchMole(id) : 
        await createMoleMetadata(
            parsedX, 
            parsedY, 
            body_part,
            photoUri, 
            moleOwner
        );
        
        if (!thisUserMole) {
            res.status(417).json({
                success: false,
                message: 'Expectation Failed'
            });
        }

        // Do I return the mole back to frontend?

        res.status(201).json({ message: "Successful" });

    } catch (error) {
        next (error);
    }
}

