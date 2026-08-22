import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Route Imports
import productRoutes from './routes/product.route';
import categoryRoutes from './routes/category.route';

// Initialize Environment Variables
dotenv.config();

const app: Application = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server Started at: http://localhost:${PORT}`);
});