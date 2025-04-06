import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinica-dental';

if (!MONGODB_URI) {
  throw new Error('Por favor define MONGODB_URI en las variables de entorno');
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
      console.log('Conectado a MongoDB');
    }
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
} 