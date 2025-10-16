import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookHub API",
      version: "1.0.0",
      description:
        "BookHub is a full CRUD + Auth API built with Node.js, Express, and MongoDB. It provides secure routes for managing books, authors, contacts, and users with JWT authentication (including Google OAuth), validation, and error handling.",
    },
    servers: [
      {
        url: "https://bookhub-api-k0cq.onrender.com/",
        description: "Production",
      },
      {
        url: "http://localhost:5500",
        description: "Local Development",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT token in the format: **Bearer &lt;token&gt;**",
        },
        googleOAuth: {
          type: "oauth2",
          description: "Google OAuth 2.0 authentication",
          flows: {
            authorizationCode: {
              authorizationUrl: "/api/auth/google",
              tokenUrl: "/api/auth/google/callback",
              scopes: {
                "profile": "Access your basic profile information",
                "email": "Access your email address",
              },
            },
          },
        },
      },
      schemas: {
        Book: {
          type: "object",
          required: ["title", "author"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated MongoDB ID",
            },
            title: {
              type: "string",
              description: "Title of the book",
            },
            author: {
              type: "string",
              description: "Author of the book",
            },
            genre: {
              type: "string",
              description: "Genre or category of the book",
            },
            year: {
              type: "integer",
              description: "Year of publication",
            },
            summary: {
              type: "string",
              description: "Brief summary or synopsis of the book",
            },
          },
          example: {
            title: "Atomic Habits",
            author: "James Clear",
            genre: "Self-help",
            year: 2018,
            summary:
              "A proven framework for building good habits and breaking bad ones.",
          },
        },
        Author: {
          type: "object",
          required: ["name", "nationality"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated MongoDB ID",
            },
            name: {
              type: "string",
              description: "Full name of the author",
            },
            birthYear: {
              type: "integer",
              description: "Year the author was born",
            },
            nationality: {
              type: "string",
              description: "Author's country of origin",
            },
            alive: {
              type: "boolean",
              description: "Whether the author is currently living",
            },
            awards: {
              type: "array",
              items: { type: "string" },
              description: "List of awards received",
            },
            bio: {
              type: "string",
              description: "Short biography of the author",
            },
            website: {
              type: "string",
              description: "Author's official website",
            },
          },
          example: {
            name: "Sofia Delgado",
            birthYear: 1984,
            nationality: "Mexican",
            alive: true,
            awards: ["Latin American Literary Prize"],
            bio: "Contemporary Latin American author known for blending magical realism with modern social issues.",
            website: "https://sofiadelgado.example.net",
          },
        },
        Contact: {
          type: "object",
          required: [
            "firstName",
            "lastName",
            "email",
            "favoriteColor",
            "birthday",
          ],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated MongoDB ID",
            },
            firstName: {
              type: "string",
              description: "Contact's first name",
            },
            lastName: {
              type: "string",
              description: "Contact's last name",
            },
            email: {
              type: "string",
              description: "Contact's email address",
            },
            favoriteColor: {
              type: "string",
              description: "Contact's favorite color",
            },
            birthday: {
              type: "string",
              format: "date",
              description: "Contact's date of birth",
            },
          },
          example: {
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice.johnson@example.com",
            favoriteColor: "Blue",
            birthday: "1992-07-15",
          },
        },
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated MongoDB ID",
            },
            name: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address (must be unique)",
            },
            password: {
              type: "string",
              description: "User's hashed password (stored securely)",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              default: "user",
              description:
                "User role (e.g., 'user' or 'admin'). Determines access permissions.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
          },
          example: {
            _id: "507f1f77bcf86cd799439011",
            name: "Jane Smith",
            email: "jane@example.com",
            password: "$2b$10$abcdefghijklmnopqrstuvwxyz",
            role: "user",
            createdAt: "2024-01-15T08:30:00.000Z",
          },
        },
        Review: {
          type: "object",
          required: ["bookTitle", "reviewer", "rating"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated MongoDB ID",
            },
            bookTitle: {
              type: "string",
              description: "Title of the book being reviewed",
            },
            reviewer: {
              type: "string",
              description: "Name of the person reviewing the book",
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              description: "Rating from 1 to 5 stars",
            },
            comment: {
              type: "string",
              description: "Written review or comment about the book",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date when the review was created",
            },
          },
          example: {
            bookTitle: "Atomic Habits",
            reviewer: "John Doe",
            rating: 5,
            comment: "An excellent guide to building better habits. Highly recommend!",
          },
        },
        Publisher: {
          type: "object",
          required: ["name", "country"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated MongoDB ID",
            },
            name: {
              type: "string",
              description: "Name of the publishing house",
            },
            country: {
              type: "string",
              description: "Country where the publisher is based",
            },
            founded: {
              type: "integer",
              description: "Year the publisher was founded",
            },
            website: {
              type: "string",
              description: "Official website URL of the publisher",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date when the record was created",
            },
          },
          example: {
            name: "Penguin Random House",
            country: "United States",
            founded: 2013,
            website: "https://www.penguinrandomhouse.com",
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Includes Books, Authors, Contacts, Users, and Auth routes
};

const swaggerSpec = swaggerJSDoc(options);

export function swaggerDocs(app) {
  // Swagger UI configuration with OAuth2 support
  const swaggerUiOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: `${process.env.NODE_ENV === 'production'
        ? 'https://bookhub-api-k0cq.onrender.com'
        : 'http://localhost:5500'}/api-docs/oauth2-redirect.html`,
      initOAuth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        scopes: ["profile", "email"],
        usePkceWithAuthorizationCodeGrant: true,
      },
    },
  };

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  console.log("📘 Swagger Docs available at /api-docs");
}
