import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@app/db/db.config";
import asyncHandler from "@app/middlewares/asyncHandler";


// User Registration

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, email, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role_id]
    );
    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
// User Login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userQuery = await pool.query(
      "SELECT users.user_id, users.name, users.email, users.password, users.role_id, user_roles.role_name FROM users JOIN user_roles ON users.role_id = user_roles.role_id WHERE users.email = $1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userQuery.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create tokens
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("Token secrets not defined in environment variables");
    }

    const accessToken = jwt.sign(
      { userId: user.user_id, roleId: user.role_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Increased expiration time for better user experience
    );

    const refreshToken = jwt.sign(
      { userId: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    // Set tokens as cookies
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Log the tokens for debugging
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Send user data and tokens
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Refresh Token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    if (!process.env.REFRESH_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("Token secrets not defined in environment variables");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as { userId: string };

    // Get user from database
    const userQuery = await pool.query(
      "SELECT users.user_id, users.role_id FROM users WHERE users.user_id = $1",
      [decoded.userId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = userQuery.rows[0];

    // Create new access token
    const accessToken = jwt.sign(
      { userId: user.user_id, roleId: user.role_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Set new access token as cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Token refreshed",
      access_token: accessToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

// Logout
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.status(200).json({ message: "Logged out successfully" });
});