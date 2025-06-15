const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js'); // .js
const authRoutes = require('./routes/auth.routes.js'); // .js
const folderRoutes = require('./routes/folder.routes.js'); // .js
const uploadRoutes = require('./routes/upload.routes.js'); // .js
const jobRoutes = require('./routes/job.routes.js'); // .js
const resultRoutes = require('./routes/result.routes.js'); // .js
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
