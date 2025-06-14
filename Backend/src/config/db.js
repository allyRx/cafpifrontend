const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from Backend/.env
// The path './.env' assumes that the script is run from the 'Backend' directory.
// If running `node src/index.js` from within the `Backend` directory, this path should be correct.
dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in your .env file');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
