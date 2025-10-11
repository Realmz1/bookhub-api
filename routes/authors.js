import express from "express";
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/authorsController.js";
import { authMiddleware } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Manage authors collection
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - name
 *         - nationality
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Full name of the author
 *         birthYear:
 *           type: integer
 *           description: Year the author was born
 *         nationality:
 *           type: string
 *           description: Author's country of origin
 *         alive:
 *           type: boolean
 *           description: Whether the author is currently living
 *         awards:
 *           type: array
 *           items:
 *             type: string
 *           description: List of awards received
 *         bio:
 *           type: string
 *           description: Short biography
 *         website:
 *           type: string
 *           description: Author's official website
 *       example:
 *         name: "Sofia Delgado"
 *         birthYear: 1984
 *         nationality: "Mexican"
 *         alive: true
 *         awards: ["Latin American Literary Prize"]
 *         bio: "Contemporary Latin American author known for blending magical realism with modern social issues."
 *         website: "https://sofiadelgado.example.net"
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Retrieve all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of all authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         description: Server error
 */
router.get("/", getAuthors);

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Get a single author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The author ID
 *     responses:
 *       200:
 *         description: Author found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getAuthorById);

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Create a new author (requires login)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, createAuthor);

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Update an author by ID (requires login)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       400:
 *         description: Invalid input or ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, updateAuthor);

/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Delete an author by ID (requires login)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The author ID
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, deleteAuthor);

export default router;
