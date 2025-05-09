import { Prisma, PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/account.utils";
import { ValidationError } from "../middlewares/error.middleware";

const prisma = new PrismaClient();

export const findUser = async(username: string, password: string) => {
    console.log(`Passed username ${username} password ${password}`);
    try {
        const user = await prisma.user_Account.findFirst({
            where: { 
                OR: [
                    { username: username }, 
                    { email: username }
                ]
            }
        });

        if (!user) {
            throw new Error('Username not found');
        }

        console.log('User password', user.password);

        const hashedPassword = hashPassword(password);
        const isValidPassword = password === user.password ? true : false;

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