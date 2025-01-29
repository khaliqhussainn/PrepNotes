const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();

// Configure CORS for Expo app
app.use(cors({
  origin: '*',  // Allow all origins for mobile app
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for Vercel serverless environment
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// Enhanced error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware to handle Multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", environment: process.env.NODE_ENV });
});

// Get all files with combined data from Cloudinary and database
app.get(
  "/api/files",
  asyncHandler(async (req, res) => {
    const { year } = req.query;

    try {
      // Fetch files from database
      const dbFiles = await prisma.note.findMany({
        where: {
          year: year ? year : undefined,
        },
        orderBy: { createdAt: "desc" },
      });

      // Fetch files from Cloudinary
      const cloudinaryFiles = await cloudinary.api.resources({
        type: "upload",
        max_results: 500,
        resource_type: "raw",
      });

      // Combine and organize the data
      const combinedFiles = dbFiles.map(dbFile => {
        const cloudinaryFile = cloudinaryFiles.resources.find(
          cf => cf.secure_url === dbFile.fileUrl
        );

        return {
          ...dbFile,
          cloudinaryData: cloudinaryFile || {},
          extension: dbFile.fileUrl.split('.').pop().toUpperCase(),
        };
      });

      // Group files by type (notes/questions) and folder
      const organizedFiles = {
        notes: {},
        questions: {}
      };

      combinedFiles.forEach(file => {
        const section = file.type.toLowerCase().includes('question') ? 'questions' : 'notes';
        const folder = file.folder || 'Uncategorized';

        if (!organizedFiles[section][folder]) {
          organizedFiles[section][folder] = [];
        }

        organizedFiles[section][folder].push({
          id: file.id,
          title: file.title,
          url: file.fileUrl,
          extension: file.extension,
          subject: file.subject,
          course: file.course,
          year: file.year,
          createdAt: file.createdAt,
        });
      });

      res.json(organizedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      throw new Error("Failed to fetch files: " + error.message);
    }
  })
);

// Upload endpoint with enhanced error handling
app.post(
  "/api/files",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const { title, year, subject, course, type, folder } = req.body;

    try {
      // Upload buffer to Cloudinary
      const cloudinaryResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: folder || "uploads",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        // Create buffer from file
        const buffer = req.file.buffer;
        uploadStream.end(buffer);
      });

      // Save to database
      const note = await prisma.note.create({
        data: {
          title: title || req.file.originalname,
          fileUrl: cloudinaryResult.secure_url,
          year,
          subject,
          course,
          type: type || "notes",
          folder: folder || "Uncategorized",
        },
      });

      res.json(note);
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      throw new Error("Failed to upload file to Cloudinary: " + error.message);
    }
  })
);

// Delete endpoint
app.delete(
  "/api/files/:id",
  asyncHandler(async (req, res) => {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!note) {
      throw new Error("File not found");
    }

    try {
      // Delete from Cloudinary
      const publicId = note.fileUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

      // Delete from database
      await prisma.note.delete({
        where: { id: parseInt(req.params.id) },
      });

      res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file: " + error.message);
    }
  })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// Error handling for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
