import express from "express"
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../controllers/bookController"

const router = express.Router()

//create the routs
router.post("/", createBook)
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router