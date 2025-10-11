import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";
import bcrypt from "bcrypt";

// ======================= GET ALL USERS =======================
export async function getUsers(req, res) {
  try {
    const db = getDB();
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } }) // Hide passwords
      .toArray();

    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Failed to retrieve users." });
  }
}

// ======================= GET USER BY ID =======================
export async function getUserById(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid user ID format." });

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

    if (!user) return res.status(404).json({ error: "User not found." });

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ error: "Failed to retrieve user." });
  }
}

// ======================= CREATE USER =======================
export async function createUser(req, res) {
  try {
    const db = getDB();
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({
        error: "Missing required fields: name, email, and password.",
      });

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({
      message: "User created successfully.",
      userId: result.insertedId,
    });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: "Failed to create user." });
  }
}

// ======================= UPDATE USER =======================
export async function updateUser(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid user ID format." });

    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (password) updates.password = await bcrypt.hash(password, 10);

    if (Object.keys(updates).length === 0)
      return res.status(400).json({ error: "No valid fields provided." });

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: "User not found." });

    res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ error: "Failed to update user." });
  }
}

// ======================= DELETE USER =======================
export async function deleteUser(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid user ID format." });

    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "User not found." });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user." });
  }
}
