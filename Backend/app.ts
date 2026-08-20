// <-- Imports -->
import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// <-- Configuration --> 
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(cors({ origin : '*' }));


const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Started at Port: http://localhost:" + PORT);
});