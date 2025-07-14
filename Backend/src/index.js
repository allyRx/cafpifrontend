const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js'); // .js

console.log("Requiring route module: ./routes/auth.routes.js");
const authRoutes = require('./routes/auth.routes.js');
console.log("Successfully required ./routes/auth.routes.js:", authRoutes);

console.log("Requiring route module: ./routes/folder.routes.js");
const folderRoutes = require('./routes/folder.routes.js');
console.log("Successfully required ./routes/folder.routes.js:", folderRoutes);

console.log("Requiring route module: ./routes/upload.routes.js");
const uploadRoutes = require('./routes/upload.routes.js');
console.log("Successfully required ./routes/upload.routes.js:", uploadRoutes);

console.log("Requiring route module: ./routes/job.routes.js");
const jobRoutes = require('./routes/job.routes.js');
console.log("Successfully required ./routes/job.routes.js:", jobRoutes);

console.log("Requiring route module: ./routes/result.routes.js");
const resultRoutes = require('./routes/result.routes.js');
console.log("Successfully required ./routes/result.routes.js:", resultRoutes);

console.log("Requiring route module: ./routes/webhook.routes.js");
const webhookRoutes = require('./routes/webhook.routes.js');
console.log("Successfully required ./routes/webhook.routes.js:", webhookRoutes);

console.log("Requiring route module: ./routes/analysis.routes.js");
const analysisRoutes = require('./routes/analysis.routes.js');
console.log("Successfully required ./routes/analysis.routes.js:", analysisRoutes);

const { errorHandler } = require('./middleware/error.middleware.js'); // .js

// Load environment variables from Backend/.env
// Path should be correct if 'node src/index.js' is run from 'Backend/' directory.
dotenv.config({ path: './.env' });

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes


app.options('*', cors()); // Enable pre-flight requests for all routes
// Body parser avec une limite augmentée
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Define Routes
app.get('/', (req, res) => res.send('API Running!')); // This simple route remains

console.log("Attempting app.use for /api/auth");
app.use('/api/auth', authRoutes);
console.log("Completed app.use for /api/auth");

console.log("Attempting app.use for /api/folders");
app.use('/api/folders', folderRoutes);
console.log("Completed app.use for /api/folders");

console.log("Attempting app.use for /api/upload");
app.use('/api/upload', uploadRoutes);
console.log("Completed app.use for /api/upload");

console.log("Attempting app.use for /api/jobs");
app.use('/api/jobs', jobRoutes);
console.log("Completed app.use for /api/jobs");

console.log("Attempting app.use for /api/results");
app.use('/api/results', resultRoutes);
console.log("Completed app.use for /api/results");

console.log("Attempting app.use for /api/webhook");
app.use('/api/webhook', webhookRoutes);
console.log("Completed app.use for /api/webhook");

console.log("Attempting app.use for /api/analysis");
app.use('/api/analysis', analysisRoutes);
console.log("Completed app.use for /api/analysis");


//Error Handling Middleware - Should be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
