import { UserRequest } from "./userTypes";

/**
 * Book type defining structure of a book record in PostgreSQL
 */
export interface Book {
  book_id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  publisher: string;
  description: string;
  image: string;
  price: number;
  total_copies: number;
  available_copies: number;
  borrower_id?: number; // Foreign key from users table
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Custom Express Request Type for book-related middleware
 * This extends `UserRequest` so that `req.user` is available
 */
export interface BookRequest extends UserRequest {
  params: {
    book_id: string; // Ensures `req.params.id` always exists
  };
  book?: Book;
}