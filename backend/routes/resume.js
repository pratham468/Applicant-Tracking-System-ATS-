const fs = require('fs');
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const geminiService = require('../services/geminiService');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    let fileText = '';

    // 1. Extract text from PDF
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      fileText = data.text;
    } else {
      fileText = 'Plain text/DOC parsing not yet implemented.';
    }

    if (!fileText || fileText.trim().length === 0) {
      return res.status(400).json({ error: 'No text extracted from resume' });
    }

    // 2. Ask Gemini to extract keywords
    const prompt = `
      Extract important technical skills and keywords from this resume text.
      Return only a comma-separated list of skills.

      Resume Text:
      ${fileText}
    `;

    const geminiResponse = await geminiService.generateContent(prompt);
    let keywords = geminiResponse.split(',').map(k => k.trim());

    // 3. Return keywords in array format
    res.json({ keywords });

  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

module.exports = router;
