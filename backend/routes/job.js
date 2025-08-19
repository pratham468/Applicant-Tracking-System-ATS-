const fs = require('fs');
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const geminiService = require('../services/geminiService');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Upload JD file
router.post('/upload', upload.single('jobDescription'), async (req, res) => {
  try {
    let fileText = '';

    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      fileText = data.text;
    } else {
      fileText = 'Plain text/DOC parsing to be added...';
    }

    if (!fileText || fileText.trim().length === 0) {
      return res.status(400).json({ error: 'No text extracted from job description' });
    }

    // Build Gemini prompt
    const prompt = `
      Extract important technical skills and keywords from this job description text.
      Return only a comma-separated list of skills.

      Job Description Text:
      ${fileText}
    `;

    const geminiResponse = await geminiService.generateContent(prompt);
    let keywords = geminiResponse.split(',').map(k => k.trim());

    res.json({ keywords });
  } catch (err) {
    console.error('Job upload error:', err);
    res.status(500).json({ error: 'Failed to process job description' });
  }
});

// Paste JD text
router.post('/keywords', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const prompt = `
      Extract important technical skills and keywords from this job description text.
      Return only a comma-separated list of skills.

      Job Description Text:
      ${text}
    `;

    const geminiResponse = await geminiService.generateContent(prompt);
    let keywords = geminiResponse.split(',').map(k => k.trim());

    res.json({ keywords });
  } catch (err) {
    console.error('Job text error:', err);
    res.status(500).json({ error: 'Failed to process job description text' });
  }
});

module.exports = router;
