const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
require('dotenv').config({ path: './.env.local' });

console.log("Loaded API Key:", process.env.OPENAI_API_KEY); 
console.log("Loaded Gemini API Key:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing");

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const resumeRoutes = require('./routes/resume');
const documentRoutes = require('./routes/documents');
const jobRoutes = require('./routes/job');
const jobDescriptionRoutes = require("./routes/jobDescription");

app.use("/api/jobdescription", require('./routes/jobDescription'));
app.use('/api/resume', require('./routes/resume'));   // Resume upload + process
app.use('/api/job', require('./routes/job'));         // Job description upload/text
app.use('/api/documents', require('./routes/documents')); // Matching


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
