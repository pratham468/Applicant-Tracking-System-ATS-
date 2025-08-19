const express = require('express');
const geminiService = require('../services/geminiService');

const router = express.Router();

// Match keywords
router.post('/match', async (req, res) => {
  try {
    const { resumeKeywords, jobKeywords } = req.body;
    const softMatches = await geminiService.findSoftMatches(resumeKeywords, jobKeywords);
    res.json({ softMatches });
  } catch (err) {
    console.error('Soft match error:', err);
    res.status(500).json({ error: 'Failed to fetch soft matches' });
  }
});

module.exports = router;
