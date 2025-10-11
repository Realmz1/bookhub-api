import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDB } from "../db/connect.js";

const JWT_SECRET = process.env.JWT_SECRET;

// ======================= REGISTER =======================
export async function registerUser(req, res) {
  try {
    const db = getDB();
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required." });

    const existing = await db.collection("users").findOne({ email });
    if (existing)
      return res.status(400).json({ error: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "User registered successfully.",
      userId: result.insertedId,
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
}

// ======================= LOGIN =======================
export async function loginUser(req, res) {
  try {
    const db = getDB();
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const user = await db.collection("users").findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid email or password." });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
}

// ======================= LOGOUT =======================
export async function logoutUser(req, res) {
  try {
    // For stateless JWTs, logout is client-side (token invalidation on client)
    // You can still respond success to signal logout intent
    res.status(200).json({ message: "User logged out successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to log out." });
  }
}

// ======================= GET PROFILE =======================
export async function getProfile(req, res) {
  try {
    const db = getDB();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.user.id) });

    if (!user) return res.status(404).json({ error: "User not found." });

    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("❌ Profile Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
}

// ======================= MIDDLEWARE =======================
export function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Authorization header missing." });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token not provided." });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err);
    res.status(401).json({ error: "Invalid or expired token." });
  }
}
