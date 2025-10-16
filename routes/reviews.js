import express from "express";
import {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
} from "../controllers/reviewsController.js";
import { validateCreateReview, validateUpdateReview } from "../middleware/validators.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Book review management endpoints
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 */
router.get("/", getReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the review
 *     responses:
 *       200:
 *         description: A single review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getReviewById);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reviewId:
 *                   type: string
 *       400:
 *         description: Missing required fields or invalid rating
 *       500:
 *         description: Server error
 */
router.post("/", validateCreateReview, createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update an existing review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid ID format or rating
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put("/:id", validateUpdateReview, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the review
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteReview);

export default router;


