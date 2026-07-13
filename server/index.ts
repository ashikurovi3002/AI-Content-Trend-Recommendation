import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import userRoutes from './routes/userRoutes';
import contentRoutes from './routes/contentRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import sourceRoutes from './routes/sourceRoutes';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/sources', sourceRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('TrendPilot AI API is running...');
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected');
    } else {
      console.log('MONGODB_URI not found in .env');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
