import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
import { findUser } from "../services/account.service";
import { hashPassword } from "../utils/account.utils";
import { accessTokenGenerator, refreshTokenGenerator } from "../middlewares/auth.middleware";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";

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

// req: Request ensures that we have property of req.body, params and etc.
// res: Response ensures that the methods used are json, status and etc
export const createAccount = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, email }: create_account = req.body;

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

export const authenticateLogin = async(req: Request, res: Response, next: NextFunction) => {
    const { username, password }: IUser = req.body;
    try {
        if (!username || !password) {
            res.status(201).json({
                message: 'Incomplete credentials'
            })
        }

        const user = await findUser(username, password);

       const accessToken = accessTokenGenerator(user.username);
       const refreshToken = refreshTokenGenerator(user.username);

        if (!user) {
            res.status(404).json({
                message: 'Not Found',
                success: false
            });
        }

        res.status(202).json({
            message: 'Successful login',
            success: true
        });


    } catch (error) {
        console.error('Error @ authenticate login controller', error);
        next (error);
    }
}

// Generate a reset token and sen it via email
// export const requestPasswordReset = async(req: Request, res: Response) => {
//     const { email } = req.body;
//     try {
//         const user = await prisma.user_Account.findUnique(email);
//         if (!user) return res.status(404).json({ message: 'User does not exist', success: false });

//         const secret = process.env.JWT_SECRET + user.password;
//         const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' })

//     } catch (error) {
        
//     }
// }