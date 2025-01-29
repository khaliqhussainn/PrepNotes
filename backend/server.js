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
    const uploadDir = "/tmp"; // ✅ Vercel allows `/tmp` for file uploads
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

app.get("/api/files", async (req, res) => {
  try {
    const { year } = req.query;
    const dbFiles = await prisma.note.findMany({ where: { year } });

    const cloudinaryFiles = await cloudinary.api.resources({
      type: "upload",
      max_results: 500,
      resource_type: "raw",
    });

    const combinedFiles = dbFiles.map(dbFile => {
      const cloudinaryFile = cloudinaryFiles.resources.find(
        cf => cf.secure_url === dbFile.fileUrl
      );
      return {
        ...dbFile,
        cloudinaryData: cloudinaryFile || {},
      };
    });

    res.json(combinedFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/files", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, year, subject, course, type, folder } = req.body;
    console.log("Uploading file to Cloudinary:", req.file.path);

    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: folder || "uploads",
    });

    console.log("Cloudinary upload result:", cloudinaryResult);

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
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ✅ Required for Vercel's serverless function
module.exports = app;
