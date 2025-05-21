import { Prisma, PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/account.utils";
import { ValidationError } from "../middlewares/error.middleware";
import { deleteAssessmentByMoleRef, deleteMoleById } from "./mole_metadata.service";

const prisma = new PrismaClient();

export const findUser = async(username: string, password: string) => {
    console.log(`Passed username ${username} password ${password}`);
    try {

        const cleanUsername = username.trim();
        const user = await prisma.user_Account.findFirst({
            where: { 
                OR: [
                    { username: cleanUsername }, 
                    { email: username }
                ]
            }
        });

        if (!user) {
            throw new Error('Username not found');
        }

        console.log('User password', user.password);

        const userPass = user.password;
        const hashedPassword = hashPassword(password);
        console.log({ hashedPassword });
        console.log({ userPass });
        const isValidPassword = hashedPassword === user.password ? true : false;

        if (!isValidPassword) {
            throw new ValidationError('Invalid password');
        }

        return user;
    } catch (error) {
         console.error('Error finding user', error);
        throw error;
    }
}


export const checkUserAgreement = async(userId: string) => {
    try {
        if (!userId) {
            throw new ValidationError("User Id missing");
        }

        const userAgreement = await prisma.user_Account.findUnique({
            where: { id: userId },
            select: { policyAgreement: true }
        })

        console.log("User agreement", userAgreement);
        return userAgreement;
    } catch (error) {
        throw error;
    }
}

export const findUserPassword = async(id: string) => {
    try {
        const userPass = await prisma.user_Account.findUnique({
            where: { id: id },
            select: { password: true }
        })

        const password = userPass?.password;
        console.log("Pass", password);
        
        return password;
    } catch (error) {
        throw error;
    }
}

export const changePassword = async(id: string, newPassword: string) => {
    try {
        const result = await prisma.user_Account.update({
            where: { id },
            data: { password: newPassword },
        })

        return result;
    } catch (error) {
        throw error;
    }
}

export const deleteAccountService = async(molesArr: any) => {
    try {
        if (!molesArr || molesArr.length === 0) {
            return; // No moles to delete
        }
        
        // Track any failures during the operation
        const failures: string[] = [];
        
        // Delete assessments first
        await Promise.allSettled(
            molesArr.map(async(mole: any) => {
                try {
                    await deleteAssessmentByMoleRef(mole.id);
                } catch (error) {
                    console.error(`Failed to delete assessments for mole ${mole.id}:`, error);
                    failures.push(`assessment-${mole.id}`);
                    // Continue with other moles
                }
            })       
        );

        // Then delete the moles
        await Promise.allSettled(
            molesArr.map(async(mole: any) => {
                try {
                    await deleteMoleById(mole.id);
                } catch (error) {
                    console.error(`Failed to delete mole ${mole.id}:`, error);
                    failures.push(`mole-${mole.id}`);
                    // Continue with other moles
                }
            })
        );

        // If there were any failures, throw an error with details
        if (failures.length > 0) {
            const error = new Error(`Failed to delete ${failures.length} items`);
            error.name = 'PartialDeletionError';
            throw error;
        }

        return;
    } catch (error) {
        throw error;
    }
}
