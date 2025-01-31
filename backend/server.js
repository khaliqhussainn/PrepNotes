const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const prisma = require('./db');
require("dotenv").config();

const app = express();

// Modified CORS for Expo app
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({
        message: 'An error occurred',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    });
};

// Modified API endpoints to handle Expo specific requirements
app.get("/api/files", asyncHandler(async (req, res) => {
  const { year } = req.query;

  try {
    const dbFiles = await prisma.note.findMany({
      where: {
        year: year ? year : undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const cloudinaryFiles = await cloudinary.api.resources({
      type: "upload",
      max_results: 500,
      resource_type: "raw",
    });

    const organizedFiles = {
      notes: {},
      questions: {}
    };

    dbFiles.forEach(file => {
      const cloudinaryFile = cloudinaryFiles.resources.find(
        cf => cf.secure_url === file.fileUrl
      );

      const section = file.type.toLowerCase().includes('question') ? 'questions' : 'notes';
      const folder = file.folder || 'Uncategorized';

      if (!organizedFiles[section][folder]) {
        organizedFiles[section][folder] = [];
      }

      organizedFiles[section][folder].push({
        id: file.id,
        title: file.title,
        url: file.fileUrl,
        extension: file.fileUrl.split('.').pop().toUpperCase(),
        subject: file.subject,
        course: file.course,
        year: file.year,
        createdAt: file.createdAt,
        cloudinaryData: cloudinaryFile || {},
      });
    });

    res.json(organizedFiles);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}));

// Modified file upload to handle Expo file structure
app.post("/api/files", upload.single("file"), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new Error("No file uploaded");
  }

  const { title, year, subject, course, type, folder } = req.body;

  try {
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: folder || "uploads",
    });

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

    fs.unlinkSync(req.file.path);

    res.json(note);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    throw error;
  }
}));

app.delete("/api/files/:id", asyncHandler(async (req, res) => {
  const note = await prisma.note.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!note) {
    return res.status(404).json({ message: "File not found" });
  }

  try {
    const publicId = note.fileUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

    await prisma.note.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error('Delete operation failed:', error);
    throw error;
  }
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
