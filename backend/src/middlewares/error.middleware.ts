import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Can be used for distinguishing known errors
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class DatabaseError extends AppError {
    constructor(message: string) {
        super(message, 500);
    }
}

// Global middleware -> This will apply to every route that we will use by using the next();
export const errorHandler: ErrorRequestHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }

    console.error(err)
    res.status(500).json({
        message: 'Internal server error',
        success: false
    });
}