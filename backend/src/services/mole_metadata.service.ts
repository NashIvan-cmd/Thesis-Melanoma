import { Prisma, PrismaClient, BodyPart } from "@prisma/client"
import { DatabaseError, NotFoundError, ValidationError } from "../middlewares/error.middleware";
import { cloudinaryUpload } from "../utils/cloudinary";
import { isBodyPart } from "../utils/mole_metadata.utils";
import { I_Asessment } from "../controllers/mole_metadata.controller";
import { FormData } from 'formdata-node';
import { fileFromPath } from 'formdata-node/file-from-path';
import { uploadBase64ImageToSupabase } from "../utils/supabase";

const prisma = new PrismaClient();


export const fetchMole = async(mole_Id: string) => {
    try {
        const fetchMole = await prisma.mole_MetaData.findUnique({
            where: { id: mole_Id }
        })

        // if(!fetchMole) throw new NotFoundError('Id Present. But no mole found');

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
    bodyPartName: string
) => {
    try {
        console.log("Mole owner", mole_owner);        
        
        // Enabled supabase for now
        const cloudData = await uploadBase64ImageToSupabase(photoUri, mole_owner);

        // const cloudData = {
        //     signedUrl: 'WashingMachine.ts',
        //     publicUrl: 'WashmeNaeNae'
        // }
        
        const isOrientationValid = isBodyPart(bodyOrientation);

        if (!isOrientationValid) {
            throw new ValidationError("Invalid value provided");
        }
        
        console.log("Cloud Url", cloudData.signedUrl);
        const newMole = await prisma.mole_MetaData.create({
            data: {
                x_coordinate,
                y_coordinate,
                body_part: bodyPartName,
                body_orientation: bodyOrientation as BodyPart,
                mole_owner,
                cloudId: cloudData.signedUrl,
                publicId: cloudData.publicUrl
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

export const modelApi = async(photoUri: string) => {
    try {
        console.log("Running this");
        const imageFile = photoUri;
        const formData = new FormData();
        formData.append("file", imageFile);

        console.log(formData);

        fetch("https://melanoma-api-1.onrender.com/predict", {
        method: "POST",
        body: formData as any,
        })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
            } catch (error) {
                console.error("Error @ model API", error);
                throw error;
            }
}

//create assessment
export const createAssessment = async(
    moleId: string, 
    riskAssessment: number, 
    nlpResponse: string,
    stringValueOfModelAssessment: string
): Promise<I_Asessment> => {
    try {
        // Model assessment
        // Risk assessment -> Fitzpatrick
        // Risk Summary -> Contact some NLP
        console.log(`Mole id: ${moleId}, RA: ${riskAssessment}, nlp: ${nlpResponse}, assessment: ${stringValueOfModelAssessment}`);
        const result = await prisma.mole_Assessment.create({
            data: {
                risk_assessment: riskAssessment,
                model_assessment: stringValueOfModelAssessment,
                risk_summary: nlpResponse,
                mole_ref: {
                    connect: { id: moleId }, // ✅ connect relation manually
                }
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

// Fetch all of the moles of a user
// Regardless of orientation
export const getAllMoleByUserId = async(userId: string): Promise<object[]> => {
    try {
        const result = await prisma.mole_MetaData.findMany({
            where: { mole_owner: userId },
            select: {
                id: true,
                body_orientation: true,
                body_part: true,
                mole_owner: true,
                x_coordinate: true,
                y_coordinate: true,
                cloudId: true,
                publicId: true,
                createdAt: true,
                overall_assessment: {
                    select: {
                        model_assessment: true,
                        risk_assessment: true,
                        risk_summary: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
            })

        return result
    } catch (error) {
        throw error;
    }
}

export const getAllMoleByUserIdWithOrientation = async(userId: string, orientation: BodyPart): Promise<object[]> => {
    try {
        const result = await prisma.mole_MetaData.findMany({
            where: { mole_owner: userId, body_orientation: orientation },
            orderBy: { createdAt: 'desc' },
            select: { id: true, x_coordinate: true, y_coordinate: true }
        })

        console.log("Result retrieved", result);

        return result
    } catch (error) {
        throw error;
    }
}

// Single Mole
export const getMoleById = async(moleId: string): Promise<object|null> => {
    try {
        const result = await prisma.mole_MetaData.findUnique({
            where: { id: moleId },
            select: {
                id: true,
                body_orientation: true,
                body_part: true,
                mole_owner: true,
                x_coordinate: true,
                y_coordinate: true,
                cloudId: true,
                publicId: true,
                createdAt: true,
                overall_assessment: {
                    select: {
                        model_assessment: true,
                        risk_assessment: true,
                        risk_summary: true,
                    }
                }
            },
        })
        
        return result
    } catch (error) {
        throw error;
    }
}

export const updateMole = async(id: string, bodyPart: string) => {
    try {
        if (bodyPart == '' ) {
            throw new ValidationError("Body part cannot be empty");
        }
        console.log("Checking body part", bodyPart);
        
        const result = await prisma.mole_MetaData.update({
            where: { id: id },
            data: { body_part: bodyPart },
            select: { body_part: true, id: true }
        })
        
        console.log({ result });
        if (!result) throw new NotFoundError("Item not found");

        return result;
    } catch (error) {
        throw error
    }
}

export const getAssessmentById = async(moleId: string) => {
    try {
        const result = await prisma.mole_Assessment.findFirst({
            where: { mole_id: moleId },
            select: { id: true }
        })

        if (!result) return;

        return result;
    } catch (error) {
        throw error;
    }
}

export const deleteAssessmentByMoleRef = async(moleId: string) => {
    try {
        await prisma.mole_Assessment.deleteMany({
            where: { mole_id: moleId}
        })
    } catch (error) {
        throw error;
    }
}

export const deleteMoleById = async (moleId: string) => {
    try {
        const deletedRow = await prisma.mole_MetaData.delete({
            where: { id: moleId }
        });

        console.log({ deletedRow });

        return;
    } catch (error) {
        throw error;
    }
}

export const recheckMole = async(moleId: string, photoUri: string, userId: string, bodyPartName: string) => {
    try {
        if (!moleId) throw new ValidationError("Mole is missing");

        // This lacks the actual upload right

        const cloudData = await uploadBase64ImageToSupabase(photoUri, userId);
        const result = await prisma.mole_MetaData.update({
            where: { id: moleId },
            data: { 
                cloudId: cloudData.signedUrl,
                publicId: cloudData.publicUrl,
                body_part: bodyPartName
             }
        })

        return result;
    } catch (error) {
        throw error;
    }
}

export const updateAssessment = async(
    id: string, 
    nlpResponse: string, 
    riskAssessment: number, 
    stringValueOfModelAssessment: string
) => {
    try {
        if (!id) throw new ValidationError("Mole id is missing");

        const result = await prisma.mole_Assessment.update({
            where: { id: id },
            data: { 
                risk_assessment: riskAssessment,
                risk_summary: nlpResponse,
                model_assessment: stringValueOfModelAssessment
            }
        })

        return result;
    } catch (error) {
        throw error;
    }
}

export const findMoleAssessment = async(moleId: string) => {
    try {
        if (!moleId) throw new ValidationError("Mole id is missing");

         const result = await prisma.mole_Assessment.findFirst({
            where: { mole_id: moleId },
            select: { id: true }
         })

         if (!result) throw new NotFoundError('No assessment found');
         
         return result.id;
    } catch (error) {
        throw error;
    }
}