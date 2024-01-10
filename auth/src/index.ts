import mongoose, { mongo } from 'mongoose';
import { app } from './app';
import { textChangeRangeNewSpan } from 'typescript';

const start = async () => {
  console.log('Starting up!...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be define');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('listening on port 3000.');
  });
};

start();
