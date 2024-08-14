import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URL = process.env.DB_URL

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL)
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
  }
};