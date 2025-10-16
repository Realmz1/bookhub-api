import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  authMiddleware,
  googleAuthCallback,
} from "../controllers/authController.js";
import passport from "../config/passport.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (will be hashed)
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *           description: User role (defaults to 'user')
 *       example:
 *         name: "John Doe"
 *         email: "john@example.com"
 *         password: "securePassword123"
 *         role: "user"
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *       example:
 *         email: "john@example.com"
 *         password: "securePassword123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful."
 *         token:
 *           type: string
 *           description: JWT token for authentication
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               example: "john@example.com"
 *             role:
 *               type: string
 *               example: "user"
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User registered successfully."
 *         userId:
 *           type: string
 *           description: ID of the newly created user
 *           example: "507f1f77bcf86cd799439011"
 *     UserProfile:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         role:
 *           type: string
 *           example: "user"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T08:30:00.000Z"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Invalid email or password."
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with hashed password. Role defaults to 'user' if not specified.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 value:
 *                   error: "All fields are required."
 *               userExists:
 *                 value:
 *                   error: "User already exists."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user and receive a JWT token
 *     description: Authenticates user credentials and returns a JWT token valid for 1 hour along with user information.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and user info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 value:
 *                   error: "Email and password are required."
 *               invalidCredentials:
 *                 value:
 *                   error: "Invalid email or password."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user (client-side token invalidation)
 *     description: Signals logout intent. Since JWTs are stateless, actual token invalidation happens client-side by removing the token.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully."
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/logout", authMiddleware, logoutUser);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     description: Returns the profile information of the authenticated user. Requires valid JWT token in Authorization header.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user profile information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingHeader:
 *                 value:
 *                   error: "Authorization header missing."
 *               missingToken:
 *                 value:
 *                   error: "Token not provided."
 *               invalidToken:
 *                 value:
 *                   error: "Invalid or expired token."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "User not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects user to Google's OAuth consent screen. After successful authentication, user will be redirected to the callback URL.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth consent screen
 *       500:
 *         description: OAuth configuration error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback endpoint
 *     description: |
 *       Handles the callback from Google OAuth. This endpoint processes the OAuth response and returns a JWT token.
 *       
 *       **Using Swagger UI "Authorize" button:**
 *       1. Click the "Authorize" button at the top of Swagger UI
 *       2. Select the "googleOAuth" option
 *       3. Click "Authorize" - you'll be redirected to Google login
 *       4. After successful login, you'll be redirected back with authentication
 *       
 *       **For API/Swagger testing:** Add `?mode=api` to the callback URL to receive JSON response instead of redirect.
 *       
 *       **For web applications:** Without the mode parameter, users will be redirected to the frontend with the token.
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from Google (automatically provided by Google)
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [api]
 *         description: Set to 'api' to receive JSON response instead of redirect (useful for testing)
 *     responses:
 *       200:
 *         description: Google authentication successful (when mode=api)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       302:
 *         description: Redirects to frontend with token (default behavior)
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false
  }),
  googleAuthCallback
);

/**
 * @swagger
 * /api/auth/google/failure:
 *   get:
 *     summary: Google OAuth failure endpoint
 *     description: Endpoint hit when Google OAuth authentication fails
 *     tags: [Auth]
 *     responses:
 *       401:
 *         description: Google authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Google authentication failed."
 */
router.get("/google/failure", (req, res) => {
  res.status(401).json({ error: "Google authentication failed." });
});

export default router;
