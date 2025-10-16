import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
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

// ======================= GOOGLE OAUTH CALLBACK =======================
export async function googleAuthCallback(req, res) {
  try {
    // User is authenticated via passport, generate JWT token
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Check if this is coming from Swagger UI OAuth flow
    const referer = req.get('Referer') || '';
    const isSwaggerUI = referer.includes('/api-docs');

    // For Swagger UI OAuth2 flow - return HTML that will handle the token
    if (isSwaggerUI || req.query.mode === "swagger") {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              max-width: 500px;
              text-align: center;
            }
            .success-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            h1 { color: #333; margin-bottom: 20px; }
            .token-container {
              background: #f5f5f5;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
              word-break: break-all;
              font-family: monospace;
              font-size: 12px;
              max-height: 150px;
              overflow-y: auto;
            }
            .user-info {
              background: #e3f2fd;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              text-align: left;
            }
            .copy-btn {
              background: #667eea;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              margin: 10px 5px;
            }
            .copy-btn:hover { background: #5568d3; }
            .back-btn {
              background: #4caf50;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              margin: 10px 5px;
              text-decoration: none;
              display: inline-block;
            }
            .back-btn:hover { background: #45a049; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            <h1>Authentication Successful!</h1>
            <div class="user-info">
              <strong>Name:</strong> ${user.name}<br>
              <strong>Email:</strong> ${user.email}<br>
              <strong>Role:</strong> ${user.role}
            </div>
            <p><strong>Your JWT Token:</strong></p>
            <div class="token-container" id="token">${token}</div>
            <button class="copy-btn" onclick="copyToken()">📋 Copy Token</button>
            <a href="/api-docs" class="back-btn">← Back to Swagger</a>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              To use this token in Swagger:<br>
              1. Click the "Authorize" button<br>
              2. Paste the token in the "bearerAuth" field<br>
              3. Click "Authorize"
            </p>
          </div>
          <script>
            function copyToken() {
              const token = document.getElementById('token').textContent;
              navigator.clipboard.writeText(token).then(() => {
                alert('Token copied to clipboard!');
              });
            }
          </script>
        </body>
        </html>
      `);
    }

    // For API testing, return JSON
    if (req.query.mode === "api") {
      return res.status(200).json({
        message: "Google authentication successful.",
        token,
        user: { name: user.name, email: user.email, role: user.role },
      });
    }

    // For web app flow, redirect to frontend with token in query
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl) {
      return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    }

    // Default: return JSON if no frontend URL is configured
    return res.status(200).json({
      message: "Google authentication successful.",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Google Auth Callback Error:", err);
    res.status(500).json({ error: "Authentication failed." });
  }
}

// ======================= MIDDLEWARE =======================
export function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "Authorization header missing." });
    }

    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not provided." });
    }

    // ✅ FIXED: use process.env.JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err.message);
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

