import { Request, Response, NextFunction } from "express";

const ErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    // console.log(error)
    const status = error.statusCode || 500;
    const message = error.message || "Internal server error!";
    res.status(status).json({
        success: false,
        status,
        message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : {}
    })
}

export default ErrorHandler;