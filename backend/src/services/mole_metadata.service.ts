import { Prisma, PrismaClient } from "@prisma/client"
import { NotFoundError } from "../middlewares/error.middleware";

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
    mole_owner:string, 
) => {
    try {
        const newMole = await prisma.mole_MetaData.create({
            data: {
                x_coordinate,
                y_coordinate,
                body_part,
                mole_owner,
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