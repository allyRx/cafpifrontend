import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import folderRoutes from './routes/folder.routes';
import uploadRoutes from './routes/upload.routes';
import jobRoutes from './routes/job.routes';
import resultRoutes from './routes/result.routes';
import { errorHandler } from './middleware/error.middleware';
// Note: Placeholder auth middleware is used within each route file directly for now.
// If a global auth middleware for all /api routes (except auth) is needed, it can be added here.

// Load environment variables from Backend/.env
// Ensure this path is correct relative to where the script is run, or use an absolute path.
// If index.ts is run from Backend/src, then .env is one level up.
// However, ts-node-dev might run from the Backend directory itself.
// Let's assume it runs from Backend/ for now.
dotenv.config({ path: './.env' });

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Used to parse JSON bodies

// Define Routes
app.get('/', (req, res) => res.send('API Running!'));
app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/results', resultRoutes);

// Error Handling Middleware - Should be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
