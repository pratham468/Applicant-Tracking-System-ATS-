import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUpload = ({ onKeywordsExtracted, onJobDescriptionProcessed }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [jobText, setJobText] = useState('');
  const [resumeKeywords, setResumeKeywords] = useState([]);
  const [jobKeywords, setJobKeywords] = useState([]);
  const navigate = useNavigate();

  // ✅ helper: always return array
  const normalizeKeywords = (keywords) => {
    if (!keywords) return [];
    if (Array.isArray(keywords)) return keywords;
    if (typeof keywords === 'string') {
      try {
        return JSON.parse(keywords);
      } catch {
        return keywords.split(',').map((k) => k.trim());
      }
    }
    return [];
  };

  // Upload Resume
  const handleResumeUpload = async () => {
    if (!resumeFile) return alert('Please select a resume file');

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const response = await axios.post('http://localhost:5001/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const extractedKeywords = normalizeKeywords(response.data.keywords);
      setResumeKeywords(extractedKeywords);
      onKeywordsExtracted(extractedKeywords);
    } catch (err) {
      console.error(err);
      alert('Failed to upload resume');
    }
  };

  // Upload Job Description (File)
  const handleJobUpload = async () => {
    if (!jobFile) return alert('Please select a job description file');

    const formData = new FormData();
    formData.append('jobDescription', jobFile);

    try {
      const response = await axios.post('http://localhost:5001/api/job/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const extractedKeywords = normalizeKeywords(response.data.keywords);
      setJobKeywords(extractedKeywords);
      onJobDescriptionProcessed(extractedKeywords);
    } catch (err) {
      console.error(err);
      alert('Failed to upload job description');
    }
  };

  // Process Job Description (Text)
  const handleJobTextProcess = async () => {
    if (!jobText.trim()) return alert('Please paste a job description');

    try {
      const response = await axios.post('http://localhost:5001/api/job/keywords', { text: jobText });
      const extractedKeywords = normalizeKeywords(response.data.keywords);
      setJobKeywords(extractedKeywords);
      onJobDescriptionProcessed(extractedKeywords);
    } catch (err) {
      console.error(err);
      alert('Failed to process job description text');
    }
  };

  // Navigate to Results
  const goToResults = () => {
    navigate('/results');
  };

  return (
    <div>
      <h1>ATS Resume Checker</h1>

      {/* Resume Upload Section */}
      <div>
        <h2>Upload Resume</h2>
        <input type="file" onChange={(e) => setResumeFile(e.target.files[0])} />
        <button onClick={handleResumeUpload}>Upload Resume</button>

        {resumeKeywords.length > 0 && (
          <div>
            <h3>Extracted Resume Keywords:</h3>
            <ul>
              {resumeKeywords.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Job Description Section */}
      <div>
        <h2>Upload Job Description</h2>
        <input type="file" onChange={(e) => setJobFile(e.target.files[0])} />
        <button onClick={handleJobUpload}>Upload JD</button>

        <h3>Or Paste Job Description</h3>
        <textarea
          rows="6"
          cols="50"
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
        ></textarea>
        <br />
        <button onClick={handleJobTextProcess}>Process JD</button>

        {jobKeywords.length > 0 && (
          <div>
            <h3>Extracted Job Keywords:</h3>
            <ul>
              {jobKeywords.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <br />
      <button onClick={goToResults}>Go to Results</button>
    </div>
  );
};

export default FileUpload;
