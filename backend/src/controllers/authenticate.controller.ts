import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authenticateRefreshToken } from "../middlewares/auth.middleware";

interface IauthRequest extends Request {
    user?: any;
}

export const validateToken = (req: IauthRequest, res: Response, next: NextFunction): void  => {
    console.log("Client Request Header: ", req.headers);
    const authHeader = req.headers.authorization;
    const refreshToken = req.headers.refreshauth;
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
           console.log("Error is just expired maybe try refresh token");
           authenticateRefreshToken(refreshToken as string);
        //    res.status(403).json({ message: "Forbidden: Token expired"});
        } else {
            res.status(403).json({ message: "Forbidden: Invalid" })
        }
    }
}