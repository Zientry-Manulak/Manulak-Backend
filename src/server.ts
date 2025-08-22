import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import baseRouter from './routes/baseRoute';

const app = express();

// database connection

// middleware
app.use(cors())
app.use(express.json())

// baseRoue
app.use("/api/v1", baseRouter)

app.listen(process.env.PORT, ()=>{
  console.log("Server is running on port:", process.env.PORT);
})
