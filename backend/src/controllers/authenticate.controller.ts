import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { accessTokenGenerator, authenticateRefreshToken } from "../middlewares/auth.middleware";

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IauthRequest extends Request {
    user?: any;
}

export const validateToken = async(req: IauthRequest, res: Response, next: NextFunction): Promise<any>  => {
    console.log("Client Request Header: ", req.headers);
    const authHeader = req.headers.authorization;
    // const refreshToken = req.headers.session;
    const { userId } = req.body;
    console.log("Authheader", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
         res.status(401).json({ message: "Unauthorized: No token provided" });
         return;
    }

    const token = authHeader.split(" ")[1];
    console.log({ token });
    
    if (!token) {
       res.status(401).json({ message: "Unauthorized: Token is missing" });
       return;
    }

    const secret = process.env.JWT_SECRET as string;

    try {
        const decoded = jwt.verify(token, secret);
        console.log("Token is valid")
        console.log({ decoded });
        (req as any).user = decoded;
        next();

    } catch (error: any) {
        console.error('Error verifying token:', error);
        if (error.name == "TokenExpiredError") {
            // Send another access token if refresh token is good
           console.log("Access token expired, check for refresh token");
           const user = await prisma.user_Account.findUnique({
                where: {
                    id: userId, // adjust key to match your actual primary key field
                },

            });

            if (!user?.refreshToken) {
                console.log("This user does not exist");
                return;
            }

           console.log("Check Refresh 1", user.refreshToken);

           const bool = authenticateRefreshToken(user.refreshToken);
              
           console.log("BOOL!", bool);
           if (bool) {

            // Need a way to send the newAccessToken and replace the accessToken on secure storage
            const newAccessToken = accessTokenGenerator(user.username);
             
            console.log("New value of accessToken", newAccessToken);
            // res.locals makes the variable live until the actual response happens
            res.locals.accessToken = newAccessToken;
            // Request will go through
            next();
           }
        //    res.status(403).json({ message: "Forbidden: Token expired"});
        } else {
            res.status(403).json({ message: "Forbidden: Invalid" })
        }
    }
}

// BlackList tokens
// Invalidate Token or Rotate tokens
// Do not expose Refresh token to frontend