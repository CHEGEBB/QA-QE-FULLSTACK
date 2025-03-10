import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import pool from './db/db.config'
import path from 'path'
import chalk from 'chalk'




dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const _dirname = path.resolve()

const port = process.env.PORT;


  

async function fetchBooks() {
  try {
    const result = await pool.query("SELECT * FROM public.books ORDER BY id ASC");
    const books = result.rows;
    console.log("Books loaded:", books.length);
    books.filter((book: { title: string; author: string; year: number; description: string }) => {
        if(book.title && book.author && book.year && book.description){
            console.log(
                chalk.green(`${book.title}`) + 
                chalk.blue(' - ') + 
                chalk.yellow(`${book.author}`) + 
                chalk.blue(' --- ') + 
                chalk.magenta(`${book.year}`) + 
                chalk.blue(' -- ') + 
                chalk.cyan(`[${book.description}]`)
            );
        }
    })

    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

fetchBooks();

app.get('/api/books', async(req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM public.books ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

app.get('/api/books/:id', async(req:Request, res:Response)=>{
    try {
        const {id} = req.params
        const result = await pool.query("SELECT * FROM books WHERE id =$1" ,[id])
        if(result.rows.length === 0) {
            res.status(404).json({ message: "Book not found" })
        }
        res.status(200).json(result.rows)
    } catch (error) {
        console.error("Error getting book:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}😊😊`)
})



