import { Request, Response } from "express"
import pool from "../db/db.config"
import asyncHandler from "../middlewares/asyncHandler"


export const createBook = asyncHandler(  async (req: Request, res: Response) => {
    try {
        const  {id} = req.params
        const { title, author, genre, year, pages, publisher, description, image, price } = req.body

        const bookCheck = await pool.query("SELECT id FROM books WHERE id = $1", [id])

        if (bookCheck.rows.length > 0) {
            res.status(400).json({
                message: "Book already exists"
            })
            return
        }
        const bookResult = await pool.query(
            `INSERT INTO books (title, author, genre, year, pages, publisher, description, image, price) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [title, author, genre, year, pages, publisher, description, image, price]
          );
      
          res.status(201).json({
            message: "Book created successfully",
            book: bookResult.rows[0]
          });
        } catch (error) {   
          console.error("Error creating book:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      });


      
async function fetchBooks(req: Request, res: Response) {
    try {
      const result = await pool.query("SELECT * FROM public.books ORDER BY id ASC");
      const books = result.rows; 
      const { 
        search, 
        genre, 
        yearRange, 
        sortBy 
      } = req.query;
  
      let filteredBooks = [...books];
  
      if (search) {
        const searchTerm = (search as string).toLowerCase().trim();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.description.toLowerCase().includes(searchTerm)
        );
      }
  
      if (genre) {
        filteredBooks = filteredBooks.filter(book => 
          book.genre.toLowerCase() === (genre as string).toLowerCase()
        );
      }
  
      if (yearRange) {
        switch(yearRange) {
          case 'pre-1900':
            filteredBooks = filteredBooks.filter(book => parseInt(book.year) < 1900);
            break;
          case '1900-1950':
            filteredBooks = filteredBooks.filter(book => 
              parseInt(book.year) >= 1900 && parseInt(book.year) <= 1950
            );
            break;
          case 'post-1950':
            filteredBooks = filteredBooks.filter(book => parseInt(book.year) > 1950);
            break;
        }
      }
  
      if (sortBy) {
        switch(sortBy) {
          case 'title-asc':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'title-desc':
            filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
            break;
          case 'year-asc':
            filteredBooks.sort((a, b) => parseInt(a.year) - parseInt(b.year));
            break;
          case 'year-desc':
            filteredBooks.sort((a, b) => parseInt(b.year) - parseInt(a.year));
            break;
          case 'pages-asc':
            filteredBooks.sort((a, b) => parseInt(a.pages) - parseInt(b.pages));
            break;
          case 'pages-desc':
            filteredBooks.sort((a, b) => parseInt(b.pages) - parseInt(a.pages));
            break;
        }
      }
  
      const stats = {
        totalBooks: filteredBooks.length,
        avgPages: filteredBooks.length 
          ? Math.round(filteredBooks.reduce((sum, book) => sum + parseInt(book.pages), 0) / filteredBooks.length)
          : 0,
        oldestBook: filteredBooks.length 
          ? Math.min(...filteredBooks.map(book => parseInt(book.year)))
          : null,
        uniqueGenres: new Set(filteredBooks.map(book => book.genre)).size
      };
  
      res.json(filteredBooks);
  
      return filteredBooks;
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Internal server error" });
      return [];
    }
  }

export const getBooks = asyncHandler(  async (req: Request, res: Response) => {
    try {
        await fetchBooks(req, res);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export const getBookById = asyncHandler(  async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await pool.query("SELECT * FROM public.books WHERE id = $1", [id])
        if (result.rows.length === 0) {
            res.status(400).json({ message: "Book not found" });
            return
        }
        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error("Error Getting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export const updateBook = asyncHandler(   async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { title, author, genre, year, pages, publisher, description, image, price} = req.body

        const bookUser = await pool.query("SELECT * FROM public.books WHERE id = $1", [id])
        if (bookUser.rows.length === 0) {
            res.status(400).json({ message: "Book not found" });
            return
        }
        const result = await pool.query(
            "UPDATE books SET title=$1, author=$2, genre=$3, year=$4, pages=$5, publisher=$6, description=$7, image=$8, price=$9, updated_at=NOW() WHERE id=$10 RETURNING *",
            [title, author, genre, year, pages, publisher, description, image, price, id]
          );
          res.json({ message: "Book updated successfully", book: result.rows[0] });
        } catch (error) {
          console.error("Error updating book:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      })

//delete book 
export const deleteBook = asyncHandler(  async (req: Request, res: Response) => {
    try {
        const {id} = req.params
    
        const checkBook = await pool.query("SELECT * FROM public.books WHERE id = $1", [id])
        if (checkBook.rows.length === 0) {
          res.status(404).json({ message: "Book not found" });
          return;
        } 
        await pool.query("DELETE FROM public.books WHERE id = $1", [id]);
        res.json({ message: "Book deleted successfully" });
      } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    })