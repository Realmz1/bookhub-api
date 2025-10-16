import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";

// ======================= GET ALL REVIEWS =======================
export async function getReviews(req, res) {
    try {
        const db = getDB();
        const reviews = await db.collection("reviews").find().toArray();
        res.status(200).json(reviews);
    } catch (err) {
        console.error("❌ Error fetching reviews:", err);
        res.status(500).json({ error: "Failed to retrieve reviews." });
    }
}

// ======================= GET REVIEW BY ID =======================
export async function getReviewById(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;

        if (!ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid review ID format." });

        const review = await db.collection("reviews").findOne({ _id: new ObjectId(id) });
        if (!review) return res.status(404).json({ error: "Review not found." });

        res.status(200).json(review);
    } catch (err) {
        console.error("❌ Error fetching review:", err);
        res.status(500).json({ error: "Failed to retrieve review." });
    }
}

// ======================= CREATE REVIEW =======================
export async function createReview(req, res) {
    try {
        const db = getDB();
        const { bookTitle, reviewer, rating, comment } = req.body;

        if (!bookTitle || !reviewer || !rating)
            return res
                .status(400)
                .json({ error: "Missing required fields: bookTitle, reviewer, and rating." });

        if (rating < 1 || rating > 5)
            return res
                .status(400)
                .json({ error: "Rating must be between 1 and 5." });

        const newReview = {
            bookTitle,
            reviewer,
            rating: Number(rating),
            comment: comment || "",
            createdAt: new Date(),
        };

        const result = await db.collection("reviews").insertOne(newReview);

        res.status(201).json({
            message: "Review created successfully.",
            reviewId: result.insertedId,
        });
    } catch (err) {
        console.error("❌ Error creating review:", err);
        res.status(500).json({ error: "Failed to create review." });
    }
}

// ======================= UPDATE REVIEW =======================
export async function updateReview(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;

        if (!ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid review ID format." });

        const updatedData = req.body;

        // Validate rating if it's being updated
        if (updatedData.rating && (updatedData.rating < 1 || updatedData.rating > 5)) {
            return res.status(400).json({ error: "Rating must be between 1 and 5." });
        }

        const result = await db
            .collection("reviews")
            .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

        if (result.matchedCount === 0)
            return res.status(404).json({ error: "Review not found." });

        res.status(200).json({ message: "Review updated successfully." });
    } catch (err) {
        console.error("❌ Error updating review:", err);
        res.status(500).json({ error: "Failed to update review." });
    }
}

// ======================= DELETE REVIEW =======================
export async function deleteReview(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;

        if (!ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid review ID format." });

        const result = await db
            .collection("reviews")
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0)
            return res.status(404).json({ error: "Review not found." });

        res.status(200).json({ message: "Review deleted successfully." });
    } catch (err) {
        console.error("❌ Error deleting review:", err);
        res.status(500).json({ error: "Failed to delete review." });
    }
}


