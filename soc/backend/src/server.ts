import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import pool from './db/db.config'
import path from 'path'
import userRoutes from './routes/userRoutes'
import bookRoutes from './routes/bookRoutes'



dotenv.config();

const app = express()

app.use(cors(
    { origin: 'http://localhost:5173' }  
))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const _dirname = path.resolve()

const port = process.env.PORT;

//create the routes 
app.use("/api/users", userRoutes )
app.use("/api/books", bookRoutes )

app.listen(port, () => {
  console.log(`Server is running on port ${port}😊😊`)
})