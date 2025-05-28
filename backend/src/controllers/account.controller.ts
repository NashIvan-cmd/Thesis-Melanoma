import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
import { checkUserAgreement, findUser, findUserPassword, changePassword, deleteAccountService } from "../services/account.service";
import { emailVerificationLogic, generateSimpleVerificationCode, hashPassword, sendCredentialsToEmail } from "../utils/account.utils";
import { accessTokenGenerator, refreshTokenGenerator } from "../middlewares/auth.middleware";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { NotFoundError, ValidationError } from "../middlewares/error.middleware";
import { getAllMoleByUserId } from "../services/mole_metadata.service";
import { deleteUserMolesFolder } from "../utils/supabase";

const prisma = new PrismaClient();

interface IUser {
    username: string;
    password: string;
}

interface create_account {
    username: string;
    email: string;
    password: string;
}

interface I_Metadata {
    id: string
}

// req: Request ensures that we have property of req.body, params and etc.
// res: Response ensures that the methods used are json, status and etc
export const createAccount = async(req: Request, res: Response, next: NextFunction) => {
    console.log("Account creation request");
    const { username, password, email }: create_account = req.body;

    try {

        const hashedPassword = hashPassword(password);
        // Up to this point we can say that all of the provided credentials is correct
        if (!hashedPassword) {
            res.json({
                success: false,
                message: 'Failed to encrypt the password'
            })
        }

        const result = await prisma.user_Account.create({
            data: {
                username,
                password: hashedPassword,
                email
            }
        });

        if (!result) {
            res.status(408).json({
                success: false,
                message: 'Request Time Out'
            });
        }

        await sendCredentialsToEmail(result.email, result.username)
        res.status(201).json({
            success: true,
            message: 'Account created successfuly'
        })

    } catch (error) {
        console.error('Error @ create account controller', error);
        
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const generateCode = async(req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    console.log({ email });
    try {
        const code = generateSimpleVerificationCode();

        const response = await emailVerificationLogic(email, code);

        console.log(code);

        res.status(200).json({
            code,
            response
        })
    } catch (error) {
        console.error("Error @ generate code", error);
        res.status(500).json({ error: 'Email sending failed' });
    }
}

// @ComputerKing19
export const authenticateLogin = async(req: Request, res: Response, next: NextFunction) => {
    const refreshT = req.headers.cookie;
    console.log("Checking refresh T", refreshT);
    console.log("Client Request", req.body);
    const { username, password }: IUser = req.body;
    try {
        if (!username || !password) {
            res.status(201).json({
                message: 'Incomplete credentials'
            })
        }

        const user = await findUser(username, password);
        const userId = user.id;

       const accessToken = accessTokenGenerator(user.username);
    
       let refreshToken = refreshT;
       if (refreshT) {
        // Validate if not expired
        console.log("Refresh token value", refreshT);
       } else {
        refreshToken = refreshTokenGenerator(user.username);
       }
      

        // if (!user) {
        //     res.status(404).json({
        //         message: 'Not Found',
        //         success: false
        //     });
        // }

        res.status(202).json({
            accessToken,
            refreshToken,
            userId,
            username: user.username,
            email: user.email,
            message: 'Successful login',
            success: true
        });


    } catch (error) {
        console.error('Error @ authenticate login controller', error);
        next (error);
    }
}

// Generate a reset token and sen it via email
export const requestPasswordReset = async(req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
        const user = await prisma.user_Account.findFirst({ 
            where: { 
                 email
            }
        });

        console.log("User", user);
        if (!user) {
            res.status(404).json({ message: 'User does not exist', success: false });
            return;
        } 

        const code = generateSimpleVerificationCode();
        const response = await emailVerificationLogic(email, code);

        res.status(200).json({ code });
    } catch (error) {
        next (error);
    }
}

export const agreementToTerms = async(req: Request, res: Response, next: NextFunction) => {
    const { boolAns, id } = req.body;
    console.log("agreement to terms req", boolAns);
    try {
        
        if (boolAns == false) {
            res.status(200).json({
                success: false,
                message: "You must agree to the terms to use the app core features"
            })
            return;
        }

        await prisma.user_Account.update({
            where: { id },
            data: {
                policyAgreement: boolAns
            }
        })

        res.status(200).json({
            success: true,
            message: "You are now ready to use the app core features"
        })
    } catch (error) {
        next (error);
    }
}

export const checkAgreementController = async(req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query
    try {

        if (!userId) {
            throw new ValidationError("Missing user Id")
        } 

        const parsedId = userId.toString();
        const result = await checkUserAgreement(parsedId);

        res.status(200).json({
            result
        })
    } catch (error) {
        next (error);
    }
}

export const changePasswordController = async(req: Request, res: Response, next: NextFunction) => {
    const { userId, oldPassword, newPassword } = req.body;
    console.log("Change password", req.body);
    try {
        const getOldPassword = await findUserPassword(userId);

        if (!getOldPassword) throw new NotFoundError("User is not found");

        const hashedPassword = hashPassword(getOldPassword);
        if (oldPassword != hashedPassword) {
            res.status(406).json({ success: false, message: "Passwords does not match into database" });
            return;
        }

        const newHashedPassword = hashPassword(newPassword);
        const result = await changePassword(userId, newHashedPassword);

        if (result) {
            res.status(200).json({ success: true, message: "Password changed"})
        }
    } catch (error) {
        next (error);
    }
}

// @ComputerKing19
// This is for reset password and forgot password
export const resetPasswordController = async(req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    try {
        const { email, newPassword } = req.body

        const hashedPassword = hashPassword(newPassword);

        const result = await prisma.user_Account.update({
            where: { email }, 
            data: { password: hashedPassword },
            select: { email: true }
        });

        if (!result) {
            res.status(500).json({ message: "Internal server error "});
        }

        console.log({ result });
        res.status(200).json({ 
            result,
            success: true 
        });
    } catch (error) {
        next (error);
    }
} 


export const deleteAccountController = async(req: Request, res: Response, next: NextFunction) => {
    const { id: accountId } = req.params
    try {
        // First check if account exists
        const userAccount = await prisma.user_Account.findUnique({
            where: { id: accountId }
        });
        
        if (!userAccount) {
             res.status(404).json({ 
                success: false,
                message: 'Account not found' 
            });
            return;
        }

        // Get all moles associated with this user
        const allMoles: any = await getAllMoleByUserId(accountId);
        
        // Track each operation's success or failure
        const results = {
            molesAndAssessments: true,
            storageFiles: true,
            accountDeletion: true
        };
        
        // Delete moles and assessments with error tracking
        try {
            await deleteAccountService(allMoles);
        } catch (error) {
            console.error('Error deleting moles and assessments:', error);
            results.molesAndAssessments = false;
            // Continue with other operations
        }
        
        // Delete user files with error tracking
        try {
            await deleteUserMolesFolder(accountId);
        } catch (error) {
            console.error('Error deleting user files from storage:', error);
            results.storageFiles = false;
            // Continue with other operations
        }
        
        // Delete the account itself last
        try {
            await prisma.user_Account.delete({ 
                where: { id: accountId }
            });
        } catch (error) {
            console.error('Error deleting user account:', error);
            results.accountDeletion = false;
        }
        
        // Determine overall status based on operation results
        if (results.molesAndAssessments && results.storageFiles && results.accountDeletion) {
             res.status(200).json({ 
                success: true,
                message: 'Account and associated data deleted successfully' 
            });
            return;
        } else {
            // Partial deletion occurred - report what succeeded and what failed
            let message = 'Account deletion partially completed: ';
            const failures = [];
            
            if (!results.molesAndAssessments) failures.push('health data');
            if (!results.storageFiles) failures.push('stored images');
            if (!results.accountDeletion) failures.push('account information');
            
            message += failures.join(', ') + ' could not be completely removed.';
            
             res.status(207).json({  // 207 Multi-Status
                success: false,
                message,
                details: results
            });
            return;
        }
    } catch (error) {
        console.error('Unhandled error in account deletion:', error);
         res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while processing your request',
            error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
        });
        return;
    }
}