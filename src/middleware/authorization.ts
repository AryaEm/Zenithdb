import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken";
import { SECRET } from "../global";

interface JwtPayload {
    id: string
    username: string
    email: string
    role: string
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const secretKey = SECRET || '';
        const decoded = verify(token, secretKey);

        // ✅ Simpan user di req.user, bukan di req.body
        (req as any).user = decoded as JwtPayload;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid Token'
        });
    }
};

export const verifyRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(403).json({
                message: 'No user information available.'
            });
        }

        // Simpan username (jika memang dibutuhkan) ke req.userTransaction
        (req as any).userTransaction = user.username;

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
            });
        }

        next();
    };
};

