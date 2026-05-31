import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbCon = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://Admin:G-jNizYvkjdk28F@cluster0.jgcnv63.mongodb.net/Egas';
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

export default dbCon;
