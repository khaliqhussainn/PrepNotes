const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage (no need for disk storage on Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

router.get("/files", async (req, res) => {
  try {
    const { year } = req.query;
    const dbFiles = await prisma.note.findMany({ where: { year } });

    res.json(dbFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/files", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, year, subject, course, type, folder } = req.body;
    const fileBuffer = req.file.buffer.toString("base64");

    console.log("Uploading file to Cloudinary...");
    const cloudinaryResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${fileBuffer}`,
      { resource_type: "raw", folder: folder || "uploads" }
    );

    console.log("Cloudinary upload success:", cloudinaryResult.secure_url);

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

// Vercel serverless export
app.use("/api", router);
module.exports = app;
