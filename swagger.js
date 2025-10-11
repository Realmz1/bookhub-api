import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookHub API",
      version: "1.0.0",
      description:
        "BookHub is a full CRUD + Auth API built with Node.js, Express, and MongoDB. It provides secure routes for managing books, authors, contacts, and users with JWT authentication, validation, and error handling.",
    },
    servers: [
      {
        url: "https://bookhub-api-k0cq.onrender.com/",
        description: "Production",
      },
      {
        url: "http://localhost:8080",
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
              description: "User's email address (must be unique)",
            },
            password: {
              type: "string",
              description: "User's password (hashed on storage)",
            },
            role: {
              type: "string",
              description:
                "User role (e.g., 'user' or 'admin'). Determines access permissions.",
            },
            token: {
              type: "string",
              description: "JWT token assigned upon login",
            },
          },
          example: {
            name: "Jane Smith",
            email: "jane@example.com",
            password: "securePassword123",
            role: "user",
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              description: "User's email address",
            },
            password: {
              type: "string",
              description: "User's plain text password",
            },
          },
          example: {
            email: "john@example.com",
            password: "securePassword123",
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
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger Docs available at /api-docs");
}
