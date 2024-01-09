import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51OVwzoCFatgs8xMTSlKgFctaXzc1VprYWxE7T9CeMT5yDC4FlN9TtLg3q4aUCJIPXfTixC95eQs1u0GvcJQ0XKLj00SI15YVCH'; // to be replaced by the API key from strip account

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfsdf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
}, 5000);

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWt payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  // Create the Jwt!
  const token = jwt.sign(payload, process.env.JWt_key!);
  // Build session object. { jwt: MY_JWT }
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a strin thats the cookie with the encoded data
  return [`session=${base64}`];
};
