import { Request, Response, NextFunction } from "express";
import jwt  from "jsonwebtoken"

interface IauthRequest extends Request {
    user?: any;
}

export const refreshTokenGenerator = (username: string): string => {
    try {
        const secret = process.env.JWT_SECRET;

        if (!secret){
            throw new Error;
        }

        const refreshToken = jwt.sign({ username: username }, secret, { expiresIn: '7d' });

        console.log({ refreshToken });

        return refreshToken;
    } catch (error) {
        throw error;
    }
}

export const authenticateRefreshToken = (refreshToken: string): boolean => {
    try {
        if (!refreshToken) return false;
        console.log("RT", refreshToken);

        // const tokenPart = refreshToken.split(" ")[1];
        // if (!tokenPart) return false;
        
        // console.log("TP", tokenPart);
        const secret = process.env.JWT_SECRET as string;
        
        console.log("Before verify")
        jwt.verify(refreshToken, secret); // will throw if expired
         
        console.log("After verify")
        return true;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.log("Refresh token expired.");
            // This is where force log out should happen and tell them session expired
            return false; // don't throw
        }

        console.log("Invalid refresh token:", error);
        return false; // don't throw for bad tokens either
    }
};

export const accessTokenGenerator  = (username: string) => {
    try {
        
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error;
        }

        const accessToken = jwt.sign({ username: username }, secret, { expiresIn: '3m' });

        console.log({ accessToken });

        return accessToken;
    } catch (error) {
        throw error;
    }
}
