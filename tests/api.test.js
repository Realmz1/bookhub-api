import request from "supertest";
import { connectDB, getDB } from "../db/connect.js";
import app from "../server.js";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  const db = getDB();
  if (db) {
    const client = db.client || db.s?.client;
    if (client) await client.close();
  }
});

describe("BookHub API", () => {
  test("GET /api/books returns 200", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200);
  });
});
