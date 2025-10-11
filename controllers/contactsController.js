import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";

// ======================= GET ALL CONTACTS =======================
export async function getContacts(req, res) {
  try {
    const db = getDB();
    const contacts = await db.collection("contacts").find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error("❌ Error fetching contacts:", err);
    res.status(500).json({ error: "Failed to retrieve contacts." });
  }
}

// ======================= GET CONTACT BY ID =======================
export async function getContactById(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid contact ID format." });

    const contact = await db
      .collection("contacts")
      .findOne({ _id: new ObjectId(id) });

    if (!contact)
      return res.status(404).json({ error: "Contact not found." });

    res.status(200).json(contact);
  } catch (err) {
    console.error("❌ Error fetching contact:", err);
    res.status(500).json({ error: "Failed to retrieve contact." });
  }
}

// ======================= CREATE CONTACT =======================
export async function createContact(req, res) {
  try {
    const db = getDB();
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        error:
          "Missing required fields. Required: firstName, lastName, email, favoriteColor, birthday.",
      });
    }

    const newContact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday,
      createdAt: new Date(),
    };

    const result = await db.collection("contacts").insertOne(newContact);

    res.status(201).json({
      message: "Contact created successfully.",
      contactId: result.insertedId,
    });
  } catch (err) {
    console.error("❌ Error creating contact:", err);
    res.status(500).json({ error: "Failed to create contact." });
  }
}

// ======================= UPDATE CONTACT =======================
export async function updateContact(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid contact ID format." });

    const updateFields = req.body;
    if (Object.keys(updateFields).length === 0)
      return res.status(400).json({ error: "No fields provided for update." });

    const result = await db
      .collection("contacts")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Contact not found." });

    res.status(200).json({ message: "Contact updated successfully." });
  } catch (err) {
    console.error("❌ Error updating contact:", err);
    res.status(500).json({ error: "Failed to update contact." });
  }
}

// ======================= DELETE CONTACT =======================
export async function deleteContact(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid contact ID format." });

    const result = await db
      .collection("contacts")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Contact not found." });

    res.status(200).json({ message: "Contact deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting contact:", err);
    res.status(500).json({ error: "Failed to delete contact." });
  }
}
