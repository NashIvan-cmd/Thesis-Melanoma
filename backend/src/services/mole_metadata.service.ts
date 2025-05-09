import { Prisma, PrismaClient, BodyPart } from "@prisma/client"
import { NotFoundError, ValidationError } from "../middlewares/error.middleware";
import { cloudinaryUpload } from "../utils/cloudinary";
import { isBodyPart } from "../utils/mole_metadata.utils";

const prisma = new PrismaClient();

export const fetchMole = async(mole_Id: string) => {
    try {
        const fetchMole = await prisma.mole_MetaData.findUnique({
            where: { id: mole_Id }
        })

        if(!fetchMole) throw new NotFoundError('Id Present. But no mole found');

        return fetchMole;
    } catch (error) {
        throw error;
    }
}

export const createMoleMetadata = async(
    x_coordinate: number, 
    y_coordinate: number, 
    body_part: string,
    bodyOrientation: string,
    photoUri: string, 
    mole_owner: string, 
) => {
    try {
        console.log("Mole owner", mole_owner);        
        
        const cloudData = await cloudinaryUpload(photoUri, mole_owner);

        const isOrientationValid = isBodyPart(bodyOrientation);

        if (!isOrientationValid) {
            throw new ValidationError("Invalid value provided");
        }
        
        console.log("Cloud Url", cloudData.secureUrl);
        const newMole = await prisma.mole_MetaData.create({
            data: {
                x_coordinate,
                y_coordinate,
                body_part: "Test",
                body_orientation: bodyOrientation as BodyPart,
                mole_owner,
                cloudId: cloudData.secureUrl,
                publicId: cloudData.publicId
            }
        });
        
        if (!newMole) {
            throw new Error('Failed to create the object');
        }

        return newMole;
    } catch (error) {
        throw error;
    }
}

//create assessment
export const createAssessment = async() => {
    try {
        // Details here will come from the model.
        const createdAssessment = await prisma.mole_Assessment.create
    } catch (error) {
        
    }
}

export const moleFetchAllByUser = async(moleOwnerId: string) => {
    try {
        
        const allMoleByUser = await prisma.mole_MetaData.findMany({
            where: {
                mole_owner: moleOwnerId
            },
            orderBy: { createdAt: 'desc' }
        });

        return allMoleByUser;
    } catch (error) {
        throw error;
    }
}

export const getCloudinaryImageById = (moleId: string[]) => {
    try {
        
    } catch (error) {
        throw error;
    }
}

export const getAllMoleByUserId = async(userId: string): Promise<object[]> => {
    try {
        const result = await prisma.mole_MetaData.findMany({
            where: { mole_owner: userId },
            orderBy: { createdAt: 'desc' }
        })

        return result
    } catch (error) {
        throw error;
    }
}


export const getMoleById = async(moleId: string): Promise<object|null> => {
    try {
        const result = await prisma.mole_MetaData.findUnique({
            where: { id: moleId }
        })
        
        return result
    } catch (error) {
        throw error;
    }
}