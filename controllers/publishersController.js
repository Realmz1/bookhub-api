import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";

// ======================= GET ALL PUBLISHERS =======================
export async function getPublishers(req, res) {
    try {
        const db = getDB();
        const publishers = await db.collection("publishers").find().toArray();
        res.status(200).json(publishers);
    } catch (err) {
        console.error("❌ Error fetching publishers:", err);
        res.status(500).json({ error: "Failed to retrieve publishers." });
    }
}

// ======================= GET PUBLISHER BY ID =======================
export async function getPublisherById(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;

        if (!ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid publisher ID format." });

        const publisher = await db.collection("publishers").findOne({ _id: new ObjectId(id) });
        if (!publisher) return res.status(404).json({ error: "Publisher not found." });

        res.status(200).json(publisher);
    } catch (err) {
        console.error("❌ Error fetching publisher:", err);
        res.status(500).json({ error: "Failed to retrieve publisher." });
    }
}

// ======================= CREATE PUBLISHER =======================
export async function createPublisher(req, res) {
    try {
        const db = getDB();
        const { name, country, founded, website } = req.body;

        if (!name || !country)
            return res
                .status(400)
                .json({ error: "Missing required fields: name and country." });

        const newPublisher = {
            name,
            country,
            founded: founded ? Number(founded) : null,
            website: website || "",
            createdAt: new Date(),
        };

        const result = await db.collection("publishers").insertOne(newPublisher);

        res.status(201).json({
            message: "Publisher created successfully.",
            publisherId: result.insertedId,
        });
    } catch (err) {
        console.error("❌ Error creating publisher:", err);
        res.status(500).json({ error: "Failed to create publisher." });
    }
}

// ======================= UPDATE PUBLISHER =======================
export async function updatePublisher(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;

        if (!ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid publisher ID format." });

        const updatedData = req.body;
        const result = await db
            .collection("publishers")
            .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

        if (result.matchedCount === 0)
            return res.status(404).json({ error: "Publisher not found." });

        res.status(200).json({ message: "Publisher updated successfully." });
    } catch (err) {
        console.error("❌ Error updating publisher:", err);
        res.status(500).json({ error: "Failed to update publisher." });
    }
}

// ======================= DELETE PUBLISHER =======================
export async function deletePublisher(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;

        if (!ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid publisher ID format." });

        const result = await db
            .collection("publishers")
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0)
            return res.status(404).json({ error: "Publisher not found." });

        res.status(200).json({ message: "Publisher deleted successfully." });
    } catch (err) {
        console.error("❌ Error deleting publisher:", err);
        res.status(500).json({ error: "Failed to delete publisher." });
    }
}


