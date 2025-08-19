const fs = require("fs");
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const geminiService = require("../services/geminiService");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload Job Description
router.post("/upload", upload.single("jobDescription"), async (req, res) => {
  try {
    let fileText = "";

    if (req.file) {
      // Handle PDF uploads
      if (req.file.mimetype === "application/pdf") {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        fileText = data.text;
      } else {
        fileText = "Plain text/DOC parsing to be added...";
      }
    } else if (req.body.text) {
      // Handle pasted JD text
      fileText = req.body.text;
    }

    // ✅ Ask Gemini to extract keywords
    const prompt = `
      Extract important skills, technologies, and roles as keywords from the following job description.
      Return them as a JSON array of strings.

      Job Description:
      ${fileText}
    `;

    const keywordResponse = await geminiService.generateContent(prompt);

    let keywords = [];
    try {
      keywords = JSON.parse(keywordResponse); // if Gemini returns valid JSON
    } catch {
      // fallback: split by commas or newlines
      keywords = keywordResponse
        .split(/\n|,/)
        .map(k => k.trim())
        .filter(Boolean);
    }

    res.json({ keywords });
  } catch (err) {
    console.error("Job description upload error:", err);
    res.status(500).json({ error: "Failed to process job description" });
  }
});

module.exports = router;
