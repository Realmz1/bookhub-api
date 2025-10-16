import { body, param, validationResult } from "express-validator";

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// ======================= BOOK VALIDATORS =======================
export const validateCreateBook = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 1, max: 200 })
        .withMessage("Title must be between 1 and 200 characters"),
    body("author")
        .trim()
        .notEmpty()
        .withMessage("Author is required")
        .isLength({ min: 1, max: 100 })
        .withMessage("Author must be between 1 and 100 characters"),
    body("genre")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Genre must not exceed 50 characters"),
    body("year")
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
        .withMessage(`Year must be between 1000 and ${new Date().getFullYear() + 1}`),
    body("summary")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Summary must not exceed 1000 characters"),
    handleValidationErrors,
];

export const validateUpdateBook = [
    param("id").custom((value) => {
        if (!/^[0-9a-fA-F]{24}$/.test(value)) {
            throw new Error("Invalid book ID format");
        }
        return true;
    }),
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ min: 1, max: 200 })
        .withMessage("Title must be between 1 and 200 characters"),
    body("author")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Author cannot be empty")
        .isLength({ min: 1, max: 100 })
        .withMessage("Author must be between 1 and 100 characters"),
    body("genre")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Genre must not exceed 50 characters"),
    body("year")
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
        .withMessage(`Year must be between 1000 and ${new Date().getFullYear() + 1}`),
    body("summary")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Summary must not exceed 1000 characters"),
    handleValidationErrors,
];

// ======================= PUBLISHER VALIDATORS =======================
export const validateCreatePublisher = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 1, max: 200 })
        .withMessage("Name must be between 1 and 200 characters"),
    body("country")
        .trim()
        .notEmpty()
        .withMessage("Country is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Country must be between 2 and 100 characters"),
    body("founded")
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`Founded year must be between 1000 and ${new Date().getFullYear()}`),
    body("website")
        .optional()
        .trim()
        .isURL()
        .withMessage("Website must be a valid URL"),
    handleValidationErrors,
];

export const validateUpdatePublisher = [
    param("id").custom((value) => {
        if (!/^[0-9a-fA-F]{24}$/.test(value)) {
            throw new Error("Invalid publisher ID format");
        }
        return true;
    }),
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ min: 1, max: 200 })
        .withMessage("Name must be between 1 and 200 characters"),
    body("country")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Country cannot be empty")
        .isLength({ min: 2, max: 100 })
        .withMessage("Country must be between 2 and 100 characters"),
    body("founded")
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`Founded year must be between 1000 and ${new Date().getFullYear()}`),
    body("website")
        .optional()
        .trim()
        .isURL()
        .withMessage("Website must be a valid URL"),
    handleValidationErrors,
];

// ======================= AUTHOR VALIDATORS =======================
export const validateCreateAuthor = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 1, max: 200 })
        .withMessage("Name must be between 1 and 200 characters"),
    body("nationality")
        .trim()
        .notEmpty()
        .withMessage("Nationality is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Nationality must be between 2 and 100 characters"),
    body("birthYear")
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`Birth year must be between 1000 and ${new Date().getFullYear()}`),
    body("alive")
        .optional()
        .isBoolean()
        .withMessage("Alive must be a boolean value"),
    body("awards")
        .optional()
        .isArray()
        .withMessage("Awards must be an array"),
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Bio must not exceed 2000 characters"),
    body("website")
        .optional()
        .trim()
        .isURL()
        .withMessage("Website must be a valid URL"),
    handleValidationErrors,
];

export const validateUpdateAuthor = [
    param("id").custom((value) => {
        if (!/^[0-9a-fA-F]{24}$/.test(value)) {
            throw new Error("Invalid author ID format");
        }
        return true;
    }),
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ min: 1, max: 200 })
        .withMessage("Name must be between 1 and 200 characters"),
    body("nationality")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Nationality cannot be empty")
        .isLength({ min: 2, max: 100 })
        .withMessage("Nationality must be between 2 and 100 characters"),
    body("birthYear")
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`Birth year must be between 1000 and ${new Date().getFullYear()}`),
    body("alive")
        .optional()
        .isBoolean()
        .withMessage("Alive must be a boolean value"),
    body("awards")
        .optional()
        .isArray()
        .withMessage("Awards must be an array"),
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Bio must not exceed 2000 characters"),
    body("website")
        .optional()
        .trim()
        .isURL()
        .withMessage("Website must be a valid URL"),
    handleValidationErrors,
];

// ======================= REVIEW VALIDATORS =======================
export const validateCreateReview = [
    body("bookTitle")
        .trim()
        .notEmpty()
        .withMessage("Book title is required")
        .isLength({ min: 1, max: 200 })
        .withMessage("Book title must be between 1 and 200 characters"),
    body("reviewer")
        .trim()
        .notEmpty()
        .withMessage("Reviewer name is required")
        .isLength({ min: 1, max: 100 })
        .withMessage("Reviewer name must be between 1 and 100 characters"),
    body("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be an integer between 1 and 5"),
    body("comment")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Comment must not exceed 1000 characters"),
    handleValidationErrors,
];

export const validateUpdateReview = [
    param("id").custom((value) => {
        if (!/^[0-9a-fA-F]{24}$/.test(value)) {
            throw new Error("Invalid review ID format");
        }
        return true;
    }),
    body("bookTitle")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Book title cannot be empty")
        .isLength({ min: 1, max: 200 })
        .withMessage("Book title must be between 1 and 200 characters"),
    body("reviewer")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Reviewer name cannot be empty")
        .isLength({ min: 1, max: 100 })
        .withMessage("Reviewer name must be between 1 and 100 characters"),
    body("rating")
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be an integer between 1 and 5"),
    body("comment")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Comment must not exceed 1000 characters"),
    handleValidationErrors,
];

