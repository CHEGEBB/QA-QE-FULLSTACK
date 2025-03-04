import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for frontend on port 5173
app.use(cors({
  origin: 'http://localhost:5173'
}));

const _dirname = path.resolve();

// Read books data
const bookData = readFileSync(
  path.join(_dirname, "src", "db", "data.json"),
  "utf-8"
);

// Parse the JSON and directly extract the Books array
const books = JSON.parse(bookData).Books;

// Main books endpoint with comprehensive filtering
app.get('/api/books', (req: Request, res: Response) => {
  try {
    const { 
      search, 
      genre, 
      yearRange, 
      sortBy 
    } = req.query;

    // Start with all books
    let filteredBooks = [...books];

    // Search filter (across title, author, description)
    if (search) {
      const searchTerm = (search as string).toLowerCase().trim();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
      );
    }

    // Genre filter
    if (genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre.toLowerCase() === (genre as string).toLowerCase()
      );
    }

    // Year Range filter
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

    // Sorting 
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

    // Calculate additional stats for the frontend
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

    res.json({
      books: filteredBooks,
      stats
    });

  } catch (error) {
    console.error("Error filtering books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Default route
app.get('/', (req: Request, res: Response) => {
  res.json(books);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});