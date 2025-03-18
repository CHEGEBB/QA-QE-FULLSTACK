import { Request } from "express";

/**
 * User Role type defining structure of roles in PostgreSQL
 * Optional timestamps as they are mostly used for tracking
 */
export interface UserRole {
  id: number;
  role_name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}


/**
 * Custom Express Request Type to include `user` with role information
 */
export interface RoleRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role_id: number;
    role_name: string;
    created_at?: Date;
    updated_at?: Date;
  };
}