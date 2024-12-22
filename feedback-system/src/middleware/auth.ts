import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: number;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};