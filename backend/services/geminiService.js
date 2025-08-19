const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY not found in .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 🔹 Extract keywords (for Job Description or Resume)
async function extractKeywords(text) {
  try {
    const prompt = `
      Extract important keywords (skills, technologies, tools, soft skills) from the following text.
      Return them as a JSON array of strings without duplicates.
      
      Text: ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Try parsing JSON safely
    let keywords;
    try {
      keywords = JSON.parse(response);
    } catch (e) {
      // fallback: split by commas
      keywords = response.split(/,|\n|-/).map(k => k.trim()).filter(k => k.length > 1);
    }

    return keywords;
  } catch (err) {
    console.error("❌ extractKeywords error:", err);
    throw err;
  }
}

// 🔹 General content generator (if you need extra processing)
async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("❌ generateContent error:", err);
    throw err;
  }
}

module.exports = { extractKeywords, generateContent };
