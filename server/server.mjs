import { config } from "dotenv";
config(); // Load environment variables

import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
app.use(express.json());
app.use(cors());

const GITHUB_TOKEN = "process.env.TOKEN" ;
const OWNER = "process.env.OWNER";
const REPO = "process.env.REPO";
const PORT = process.env.PORT || 5000;

/**
 * Swagger API Documentation Setup
 */
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GitHub File Upload API",
            version: "1.0.0",
            description: "API for uploading and listing files from a GitHub repository.",
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ["./server.mjs"], // Reference this file for documentation
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file to GitHub repository.
 *     description: Uploads a file as Base64 encoded content to a specified repository.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fileName, fileContent]
 *             properties:
 *               fileName:
 *                 type: string
 *                 example: "example.txt"
 *               fileContent:
 *                 type: string
 *                 example: "SGVsbG8gd29ybGQ="  # Base64-encoded content
 *     responses:
 *       201:
 *         description: File uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully!"
 *                 fileUrl:
 *                   type: string
 *                   example: "https://github.com/OWNER/REPO/blob/main/uploads/example.txt"
 *       400:
 *         description: Bad Request - Missing fileName or fileContent.
 *       401:
 *         description: Unauthorized - Invalid GitHub credentials.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       409:
 *         description: Conflict - File already exists.
 *       500:
 *         description: Internal server error.
 */
app.post("/upload", async (req, res) => {
    try {
        const { fileName, fileContent } = req.body;

        if (!fileName || !fileContent) {
            return res.status(400).json({ error: "Missing fileName or fileContent" });
        }

        const path = `uploads/${fileName}`;
        const githubApiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;

        const response = await fetch(githubApiUrl, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Upload ${fileName}`,
                content: fileContent,
            }),
        });

        const responseData = await response.json();

        if (response.status === 201) {
            return res.status(201).json({
                message: "File uploaded successfully!",
                fileUrl: responseData.content.html_url,
            });
        }

        if (response.status === 401) {
            return res.status(401).json({ error: "Unauthorized - Invalid GitHub credentials" });
        }

        if (response.status === 403) {
            return res.status(403).json({ error: "Forbidden - Insufficient permissions" });
        }

        if (response.status === 409) {
            return res.status(409).json({ error: "Conflict - File already exists" });
        }

        return res.status(response.status).json({ error: "Upload failed", details: responseData });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /files:
 *   get:
 *     summary: Get list of uploaded files from GitHub repository.
 *     description: Retrieves a list of uploaded files stored in the GitHub repository under "uploads".
 *     responses:
 *       200:
 *         description: Successfully retrieved file list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "example.txt"
 *                   downloadUrl:
 *                     type: string
 *                     example: "https://github.com/OWNER/REPO/blob/main/uploads/example.txt"
 *       401:
 *         description: Unauthorized - Invalid GitHub credentials.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       404:
 *         description: Not Found - No files uploaded yet.
 *       500:
 *         description: Internal server error.
 */
app.get("/files", async (req, res) => {
    try {
        const githubApiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/uploads`;

        const response = await fetch(githubApiUrl, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` },
        });

        if (response.status === 401) {
            return res.status(401).json({ error: "Unauthorized - Invalid GitHub credentials" });
        }

        if (response.status === 403) {
            return res.status(403).json({ error: "Forbidden - Insufficient permissions" });
        }

        if (response.status === 404) {
            return res.status(404).json({ error: "Not Found - No files uploaded yet" });
        }

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: "Failed to fetch files", details: errorData });
        }

        const files = await response.json();
        const fileList = files.map(file => ({
            name: file.name,
            downloadUrl: file.html_url,
        }));

        res.status(200).json(fileList);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
