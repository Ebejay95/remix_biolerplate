import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be defined');
  }

  try {
    const uri = process.env.MONGODB_URI.includes('remix_boilerplate')
      ? process.env.MONGODB_URI
      : `${process.env.MONGODB_URI}/remix_boilerplate`;

    await mongoose.connect(uri);
    isConnected = true;
    console.log('Connected to MongoDB database:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}