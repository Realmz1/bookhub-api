import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";

// ======================= GET ALL BOOKS =======================
export async function getBooks(req, res) {
  try {
    const db = getDB();
    const books = await db.collection("books").find().toArray();
    res.status(200).json(books);
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.status(500).json({ error: "Failed to retrieve books." });
  }
}

// ======================= GET BOOK BY ID =======================
export async function getBookById(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid book ID format." });

    const book = await db.collection("books").findOne({ _id: new ObjectId(id) });
    if (!book) return res.status(404).json({ error: "Book not found." });

    res.status(200).json(book);
  } catch (err) {
    console.error("❌ Error fetching book:", err);
    res.status(500).json({ error: "Failed to retrieve book." });
  }
}

// ======================= CREATE BOOK =======================
export async function createBook(req, res) {
  try {
    const db = getDB();
    const { title, author, genre, year, summary } = req.body;

    if (!title || !author)
      return res
        .status(400)
        .json({ error: "Missing required fields: title and author." });

    const newBook = {
      title,
      author,
      genre: genre || "Unknown",
      year: year ? Number(year) : null,
      summary: summary || "",
      createdAt: new Date(),
    };

    const result = await db.collection("books").insertOne(newBook);

    res.status(201).json({
      message: "Book created successfully.",
      bookId: result.insertedId,
    });
  } catch (err) {
    console.error("❌ Error creating book:", err);
    res.status(500).json({ error: "Failed to create book." });
  }
}

// ======================= UPDATE BOOK =======================
export async function updateBook(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid book ID format." });

    const updatedData = req.body;
    const result = await db
      .collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Book not found." });

    res.status(200).json({ message: "Book updated successfully." });
  } catch (err) {
    console.error("❌ Error updating book:", err);
    res.status(500).json({ error: "Failed to update book." });
  }
}

// ======================= DELETE BOOK =======================
export async function deleteBook(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid book ID format." });

    const result = await db
      .collection("books")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Book not found." });

    res.status(200).json({ message: "Book deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting book:", err);
    res.status(500).json({ error: "Failed to delete book." });
  }
}
