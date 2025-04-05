import { Prisma, PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/account.utils";
import { ValidationError } from "../middlewares/error.middleware";

const prisma = new PrismaClient();

export const findUser = async(username: string, password: string) => {
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