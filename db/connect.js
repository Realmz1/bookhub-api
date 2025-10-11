import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let db;

export async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log("✅ Connected to MongoDB:", process.env.DB_NAME);
}

export function getDB() {
  if (!db) throw new Error("Database not initialized");
  return db;
}
