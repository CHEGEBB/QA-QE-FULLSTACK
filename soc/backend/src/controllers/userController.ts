import { Request, Response } from "express"
import pool from "../db/db.config"
import asyncHandler from "../middlewares/asyncHandler"

//This will handle all user-related operations 
export const createUser = asyncHandler(  async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        //check if email exists
        const emailCheck = await pool.query("SELECT user_id FROM users WHERE email = $1", [email])

        if (emailCheck.rows.length > 0) {
            res.status(400).json({
                message: "User already exists"
            })
            return
        }
        //insert the user 
        const userResult = await pool.query(
            "INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *", [name, email, password]
        )
        res.status(201).json({
            message: "User successfully created",
            user: userResult.rows[0]
        })
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

//Get All users 
export const getUsers = asyncHandler(  async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM public.users ORDER BY user_id ASC ")
        res.status(200).json(result.rows)
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})


//Get single user
export const getUserById = asyncHandler(  async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params
        const result = await pool.query("SELECT * FROM public.users WHERE id = $1", [user_id])
        if (result.rows.length === 0) {
            res.status(400).json({ message: "User not found" });
            return
        }
        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

//update user 
export const updateUser = asyncHandler(   async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params
        const { name, email, password } = req.body

        const checkUser = await pool.query("SELECT * FROM public.users WHERE id = $1", [user_id])
        if (checkUser.rows.length === 0) {
            res.status(400).json({ message: "User not found" });
            return
        }
        const result = await pool.query(
            "UPDATE users SET name=$1, email=$2, password=$3, updated_at=NOW() WHERE id=$4 RETURNING *",
            [name, email, password, user_id]
        );
        res.json({ message: "User updated", user: result.rows[0] });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

//delete user  
export const deleteUser = asyncHandler(  async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params

        const checkUser = await pool.query("SELECT * FROM public.users WHERE id = $1", [user_id])
        if (checkUser.rows.length === 0) {
            res.status(400).json({ message: "User not found" });
            return
        }
        await pool.query("DELETE FROM public.users WHERE id = $1", [user_id]);
        res.json({ message: "User deleted successful" });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})