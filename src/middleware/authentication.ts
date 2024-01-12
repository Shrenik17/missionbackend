import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { db } from '../database/dbConnection';

// Define a custom interface to extend the Request object type
interface CustomRequest extends Request {
    userId?: number;
};

export const authentication = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        console.log("authentication initiated!");
        next();
    } catch (error) {
        next(error)
    }
}

export default CustomRequest;