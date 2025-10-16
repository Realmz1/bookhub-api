import express from "express";
import {
    getPublishers,
    getPublisherById,
    createPublisher,
    updatePublisher,
    deletePublisher,
} from "../controllers/publishersController.js";
import { validateCreatePublisher, validateUpdatePublisher } from "../middleware/validators.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Publishers
 *   description: Publishing house management endpoints
 */

/**
 * @swagger
 * /api/publishers:
 *   get:
 *     summary: Get all publishers
 *     tags: [Publishers]
 *     responses:
 *       200:
 *         description: List of all publishers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publisher'
 *       500:
 *         description: Server error
 */
router.get("/", getPublishers);

/**
 * @swagger
 * /api/publishers/{id}:
 *   get:
 *     summary: Get a publisher by ID
 *     tags: [Publishers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the publisher
 *     responses:
 *       200:
 *         description: A single publisher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publisher'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Publisher not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getPublisherById);

/**
 * @swagger
 * /api/publishers:
 *   post:
 *     summary: Create a new publisher
 *     tags: [Publishers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Publisher'
 *     responses:
 *       201:
 *         description: Publisher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 publisherId:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/", validateCreatePublisher, createPublisher);

/**
 * @swagger
 * /api/publishers/{id}:
 *   put:
 *     summary: Update an existing publisher
 *     tags: [Publishers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the publisher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Publisher'
 *     responses:
 *       200:
 *         description: Publisher updated successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Publisher not found
 *       500:
 *         description: Server error
 */
router.put("/:id", validateUpdatePublisher, updatePublisher);

/**
 * @swagger
 * /api/publishers/{id}:
 *   delete:
 *     summary: Delete a publisher
 *     tags: [Publishers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the publisher
 *     responses:
 *       200:
 *         description: Publisher deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Publisher not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deletePublisher);

export default router;


