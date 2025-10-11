import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";

// ======================= GET ALL AUTHORS =======================
export async function getAuthors(req, res) {
  try {
    const db = getDB();
    const authors = await db.collection("authors").find().toArray();
    res.status(200).json(authors);
  } catch (err) {
    console.error("❌ Error fetching authors:", err);
    res.status(500).json({ error: "Failed to retrieve authors." });
  }
}

// ======================= GET AUTHOR BY ID =======================
export async function getAuthorById(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid author ID format." });

    const author = await db
      .collection("authors")
      .findOne({ _id: new ObjectId(id) });

    if (!author)
      return res.status(404).json({ error: "Author not found." });

    res.status(200).json(author);
  } catch (err) {
    console.error("❌ Error fetching author:", err);
    res.status(500).json({ error: "Failed to retrieve author." });
  }
}

// ======================= CREATE AUTHOR =======================
export async function createAuthor(req, res) {
  try {
    const db = getDB();
    const { name, birthYear, nationality, alive, awards, bio, website } = req.body;

    // Validation
    if (!name || !nationality) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name and nationality." });
    }

    const newAuthor = {
      name,
      birthYear: birthYear || null,
      nationality,
      alive: alive ?? true,
      awards: awards || [],
      bio: bio || "",
      website: website || "",
      createdAt: new Date(),
    };

    const result = await db.collection("authors").insertOne(newAuthor);

    res.status(201).json({
      message: "Author created successfully.",
      authorId: result.insertedId,
    });
  } catch (err) {
    console.error("❌ Error creating author:", err);
    res.status(500).json({ error: "Failed to create author." });
  }
}

// ======================= UPDATE AUTHOR =======================
export async function updateAuthor(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid author ID format." });

    const updatedData = req.body;

    const result = await db
      .collection("authors")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Author not found." });

    res.status(200).json({ message: "Author updated successfully." });
  } catch (err) {
    console.error("❌ Error updating author:", err);
    res.status(500).json({ error: "Failed to update author." });
  }
}

// ======================= DELETE AUTHOR =======================
export async function deleteAuthor(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid author ID format." });

    const result = await db
      .collection("authors")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Author not found." });

    res.status(200).json({ message: "Author deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting author:", err);
    res.status(500).json({ error: "Failed to delete author." });
  }
}
