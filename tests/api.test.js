import request from "supertest";
import { connectDB, getDB } from "../db/connect.js";
import app from "../server.js";
import { ObjectId } from "mongodb";

let testBookId;
let testPublisherId;
let testAuthorId;
let testReviewId;

beforeAll(async () => {
  await connectDB();

  // Seed test data
  const db = getDB();

  // Insert a test book
  const bookResult = await db.collection("books").insertOne({
    title: "Test Book",
    author: "Test Author",
    genre: "Fiction",
    year: 2023,
    summary: "A test book summary",
    createdAt: new Date(),
  });
  testBookId = bookResult.insertedId.toString();

  // Insert a test publisher
  const publisherResult = await db.collection("publishers").insertOne({
    name: "Test Publisher",
    country: "USA",
    founded: 2000,
    website: "https://testpublisher.com",
    createdAt: new Date(),
  });
  testPublisherId = publisherResult.insertedId.toString();

  // Insert a test author
  const authorResult = await db.collection("authors").insertOne({
    name: "Jane Doe",
    birthYear: 1980,
    nationality: "American",
    alive: true,
    awards: ["Test Award"],
    bio: "A test author bio",
    website: "https://janedoe.com",
    createdAt: new Date(),
  });
  testAuthorId = authorResult.insertedId.toString();

  // Insert a test review
  const reviewResult = await db.collection("reviews").insertOne({
    bookTitle: "Test Book",
    reviewer: "Test Reviewer",
    rating: 5,
    comment: "Great book!",
    createdAt: new Date(),
  });
  testReviewId = reviewResult.insertedId.toString();
});

afterAll(async () => {
  const db = getDB();

  // Clean up test data
  if (testBookId) {
    await db.collection("books").deleteOne({ _id: new ObjectId(testBookId) });
  }
  if (testPublisherId) {
    await db.collection("publishers").deleteOne({ _id: new ObjectId(testPublisherId) });
  }
  if (testAuthorId) {
    await db.collection("authors").deleteOne({ _id: new ObjectId(testAuthorId) });
  }
  if (testReviewId) {
    await db.collection("reviews").deleteOne({ _id: new ObjectId(testReviewId) });
  }

  // Close database connection
  if (db) {
    const client = db.client || db.s?.client;
    if (client) await client.close();
  }
});

// ======================= BOOKS GET ENDPOINTS TESTS =======================
describe("Books GET Endpoints", () => {
  test("GET /api/books should return 200 and an array", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/books should return books with correct properties", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("author");
    }
  });

  test("GET /api/books/:id should return 200 and a single book with valid ID", async () => {
    const res = await request(app).get(`/api/books/${testBookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Test Book");
    expect(res.body).toHaveProperty("author", "Test Author");
  });

  test("GET /api/books/:id should return 404 with non-existent valid ID", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/api/books/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Book not found.");
  });

  test("GET /api/books/:id should return 400 with invalid ID format", async () => {
    const res = await request(app).get("/api/books/invalid-id-format");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid book ID format.");
  });
});

// ======================= PUBLISHERS GET ENDPOINTS TESTS =======================
describe("Publishers GET Endpoints", () => {
  test("GET /api/publishers should return 200 and an array", async () => {
    const res = await request(app).get("/api/publishers");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/publishers should return publishers with correct properties", async () => {
    const res = await request(app).get("/api/publishers");
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("country");
    }
  });

  test("GET /api/publishers/:id should return 200 and a single publisher with valid ID", async () => {
    const res = await request(app).get(`/api/publishers/${testPublisherId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Test Publisher");
    expect(res.body).toHaveProperty("country", "USA");
  });

  test("GET /api/publishers/:id should return 404 with non-existent valid ID", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/api/publishers/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Publisher not found.");
  });

  test("GET /api/publishers/:id should return 400 with invalid ID format", async () => {
    const res = await request(app).get("/api/publishers/invalid-id-format");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid publisher ID format.");
  });
});

// ======================= AUTHORS GET ENDPOINTS TESTS =======================
describe("Authors GET Endpoints", () => {
  test("GET /api/authors should return 200 and an array", async () => {
    const res = await request(app).get("/api/authors");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/authors should return authors with correct properties", async () => {
    const res = await request(app).get("/api/authors");
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("nationality");
    }
  });

  test("GET /api/authors/:id should return 200 and a single author with valid ID", async () => {
    const res = await request(app).get(`/api/authors/${testAuthorId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Jane Doe");
    expect(res.body).toHaveProperty("nationality", "American");
  });

  test("GET /api/authors/:id should return 404 with non-existent valid ID", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/api/authors/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Author not found.");
  });

  test("GET /api/authors/:id should return 400 with invalid ID format", async () => {
    const res = await request(app).get("/api/authors/invalid-id-format");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid author ID format.");
  });
});

// ======================= REVIEWS GET ENDPOINTS TESTS =======================
describe("Reviews GET Endpoints", () => {
  test("GET /api/reviews should return 200 and an array", async () => {
    const res = await request(app).get("/api/reviews");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/reviews should return reviews with correct properties", async () => {
    const res = await request(app).get("/api/reviews");
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("bookTitle");
      expect(res.body[0]).toHaveProperty("reviewer");
      expect(res.body[0]).toHaveProperty("rating");
    }
  });

  test("GET /api/reviews/:id should return 200 and a single review with valid ID", async () => {
    const res = await request(app).get(`/api/reviews/${testReviewId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("bookTitle", "Test Book");
    expect(res.body).toHaveProperty("reviewer", "Test Reviewer");
    expect(res.body).toHaveProperty("rating", 5);
  });

  test("GET /api/reviews/:id should return 404 with non-existent valid ID", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/api/reviews/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Review not found.");
  });

  test("GET /api/reviews/:id should return 400 with invalid ID format", async () => {
    const res = await request(app).get("/api/reviews/invalid-id-format");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid review ID format.");
  });
});
