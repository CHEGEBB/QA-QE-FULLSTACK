import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "@app/db/db.config";
import { UserRequest } from "../../utils/types/userTypes";
import asyncHandler from "../../middlewares/asyncHandler";

// Auth middleware to protect routes
export const protect = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
    
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        console.log("Token from header:", token);
    }
    
    // Check for token in cookies
    if (!token && req.cookies?.access_token) {
        token = req.cookies.access_token;
        console.log("Token from cookie:", token);
    }
    
    // If no token found
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    
    try {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
        }
        
        // Verify token - make sure to use the correct property names
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as { userId: string; roleId: number };
        
        // Get user from database using userId
        const userQuery = await pool.query(
            "SELECT users.user_id, users.name, users.email, users.role_id, user_roles.role_name FROM users JOIN user_roles ON users.role_id = user_roles.role_id WHERE users.user_id = $1",
            [decoded.userId]
        );
        
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }
        
        // Attach user to request
        req.user = userQuery.rows[0];
        
        next();
    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
});