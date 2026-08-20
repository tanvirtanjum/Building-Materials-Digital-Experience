// <-- Imports -->
import mysql, { Pool } from 'mysql2';
import dotenv from 'dotenv';

// <-- Configuration -->
dotenv.config();

const pool: Pool = mysql.createPool({
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT), 
    user: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME as string,
    waitForConnections: true,
    connectionLimit: 10
});

console.log("DB CONFIG:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

// <-- Exports -->
export default pool;