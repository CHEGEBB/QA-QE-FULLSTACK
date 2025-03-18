import express from "express";
import { 
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from "@app/controllers/bookController";
import { protect } from "@app/middlewares/auth/protect";

const router = express.Router();

// Add a console.log to confirm this file is executed
console.log("BookRoutes initialized");

// Book routes
router.post("/", protect, createBook);
router.get("/", getBooks);
router.get("/:book_id", getBookById);
router.put("/:book_id", protect, updateBook);
router.delete("/:book_id", protect, deleteBook);

export default router;