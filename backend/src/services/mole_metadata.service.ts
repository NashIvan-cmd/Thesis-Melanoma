import { Prisma, PrismaClient, BodyPart } from "@prisma/client"
import { DatabaseError, NotFoundError, ValidationError } from "../middlewares/error.middleware";
import { cloudinaryUpload } from "../utils/cloudinary";
import { isBodyPart } from "../utils/mole_metadata.utils";
import { I_Asessment } from "../controllers/mole_metadata.controller";

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

// id               String        @id @default(dbgenerated("gen_random_uuid()"))
//   risk_assessment  Int         // This will be for the assessment score
//   risk_summary     String      // For the NLP output
//   model_assessment String      // benign or malignant
//   createdAt        DateTime      @default(now())
//   mole_id          String
//   mole_ref         Mole_MetaData @relation(fields: [mole_id], references: [id])

export const computationalModel = async(userId: string, modelAssessment: string) => {
    // 50% Model Assessment CNN
    // 20% Sun Exposure
    // 5% Family History
    // 5% Immune Health
    // 20% Skin Type
    try {
        const fitzData = await prisma.user_FitzPatrick.findUnique({
            where: { user_account_foreignkey: userId },
            select: { immune_health: true, genetics: true, skinType: true }
        });

        let immuneHealth, genetics = false;
        
        // Need to compute the risk assessment
        let riskAssessment = 0;


        const nlpResponse = "Call an API to structure the response";
        
        const data = {
            riskAssessment,
            nlpResponse
        }

        return data
    } catch (error) {
        throw error;
    }
}

//create assessment
export const createAssessment = async(
    moleId: string, 
    riskAssessment: number, 
    nlpResponse: string 
): Promise<I_Asessment> => {
    try {
        // Model assessment
        // Risk assessment -> Fitzpatrick
        // Risk Summary -> Contact some NLP
        const result = await prisma.mole_Assessment.create({
            data: {
                risk_assessment: riskAssessment,
                model_assessment: "Benign",
                risk_summary: nlpResponse,
                mole_id: moleId
            }
        })

        if (!result) throw new DatabaseError("Failure to fetch data");

        return result;
    } catch (error) {
        throw error;
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