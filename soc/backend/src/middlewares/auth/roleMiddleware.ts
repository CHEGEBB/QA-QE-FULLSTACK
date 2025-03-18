
import { Request, Response, NextFunction } from "express";
import { RoleRequest } from "@app/utils/types/userRoles"
import asyncHandler from "@app/middlewares/asyncHandler";


//ensure user has required roles 
export const roleGuard = (allowedRoles: string[]) =>
    asyncHandler(async (req:RoleRequest, res:Response, next:NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role_name)) {
            res.status(403).json({ message: "Access denied: Insufficient permissions" });
            return;
        }
        next();
    });



// Specific guards
export const adminGuard = roleGuard(["Admin"]);         // Full app control
export const librarianGuard = roleGuard(["Librarian"]); // Event creation & management
export const borrowerGuard = roleGuard(["borrower"]);   // Attendee-only actions
