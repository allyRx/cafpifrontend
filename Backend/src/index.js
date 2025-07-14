const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/auth.routes.js');
const folderRoutes = require('./routes/folder.routes.js');
const uploadRoutes = require('./routes/upload.routes.js');
const jobRoutes = require('./routes/job.routes.js');
const resultRoutes = require('./routes/result.routes.js');
const webhookRoutes = require('./routes/webhook.routes.js');
const analysisRoutes = require('./routes/analysis.routes.js');
const { errorHandler } = require('./middleware/error.middleware.js');

dotenv.config({ path: './.env' });

const app = express();

connectDB();

app.use(cors());
app.options('*', cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API Running!'));

app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/analysis', analysisRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
