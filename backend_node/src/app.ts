import express from "express";
import corsMiddleware from "./middlewares/corsMiddleware";
import cookieParser from 'cookie-parser';
import errorHandler from "./middlewares/errorHandler";
import moduleRoutes from './modules';

const app = express();

// defined middlewares
app.use(corsMiddleware);
app.use(cookieParser());

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main Routes
app.use('/api', moduleRoutes)

// Error handler
app.use(errorHandler);

export default app;
