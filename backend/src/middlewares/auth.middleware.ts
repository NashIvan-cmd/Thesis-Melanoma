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

export const authenticateRefreshToken = (refreshToken: string): boolean | undefined =>  {
        console.log({ refreshToken });
    try {   
        if (!refreshToken) {
            return false;
        }

        const splittedRefreshToken = refreshToken.split(" ")[1]
        console.log( {splittedRefreshToken });

        if (!splittedRefreshToken) {
            return false;
        }

        const secret = process.env.JWT_SECRET as string;

        const refreshTokenDecode = jwt.verify(splittedRefreshToken, secret);

        if (refreshTokenDecode) {
            console.log("Seems like logic is correct");
            accessTokenGenerator("test");
        }
        
        return true;
        
    } catch (error) {
        console.log("Error @ authenticate refresh token", error);
        throw error;
    }
}

export const accessTokenGenerator  = (username: string) => {
    try {
        
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error;
        }

        const accessToken = jwt.sign({ username: username }, secret, { expiresIn: '30m' });

        console.log({ accessToken });

        return accessToken;
    } catch (error) {
        throw error;
    }
}
