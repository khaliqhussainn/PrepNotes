const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Enhanced error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all files with combined data from Cloudinary and database
app.get(
  "/api/files",
  asyncHandler(async (req, res) => {
    // Fetch files from database
    const dbFiles = await prisma.note.findMany({
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

    // Upload to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: folder || "uploads",
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

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json(note);
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

    // Delete from Cloudinary
    const publicId = note.fileUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

    // Delete from database
    await prisma.note.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "File deleted successfully" });
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));