import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from 'antd';
import axios from 'axios';

const Results = ({ resumeKeywords = [], jobDescriptionKeywords = [], missingKeywords = [] }) => {
  const navigate = useNavigate();

  // State to store sorted keywords
  const [sortedResumeKeywords, setSortedResumeKeywords] = useState([]);
  const [sortedJobKeywords, setSortedJobKeywords] = useState([]);

  // State to store matching and soft matches
  const [matchingKeywords, setMatchingKeywords] = useState([]);
  const [softMatches, setSoftMatches] = useState([]);

  // Loading state for progress bar
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Sort keywords alphabetically
    setSortedResumeKeywords([...resumeKeywords].sort((a, b) => a.localeCompare(b)));
    setSortedJobKeywords([...jobDescriptionKeywords].sort((a, b) => a.localeCompare(b)));

    // Find exact matches
    const matching = resumeKeywords.filter((keyword) => jobDescriptionKeywords.includes(keyword));
    setMatchingKeywords(matching);

    // Fetch soft matches if both sets exist
    if (resumeKeywords.length > 0 && jobDescriptionKeywords.length > 0) {
      fetchSoftMatches(resumeKeywords, jobDescriptionKeywords);
    }
  }, [resumeKeywords, jobDescriptionKeywords]);

  const fetchSoftMatches = async (resumeKeywords, jobKeywords) => {
    setIsLoading(true);
    setLoadingProgress(0);

    try {
      // Simulate incremental progress
      setTimeout(() => setLoadingProgress(25), 500);
      setTimeout(() => setLoadingProgress(50), 1000);
      setTimeout(() => setLoadingProgress(75), 1500);

      const response = await axios.post('http://localhost:5001/api/documents/match', {
        resumeKeywords,
        jobKeywords,
      });

      setLoadingProgress(100);
      setSoftMatches(response.data.softMatches || []);
    } catch (error) {
      console.error('Error fetching soft matches:', error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  return (
    <div>
      <h1>Document Processing Results</h1>
      <button onClick={() => navigate('/')}>Back to Upload</button>

      {/* Progress Bar */}
      {isLoading && (
        <div style={{ margin: '20px auto', width: '50%' }}>
          <Progress percent={loadingProgress} status="active" />
          <p style={{ textAlign: 'center' }}>
            Fetching soft matches... ({loadingProgress}%)
          </p>
        </div>
      )}

      <h2>Soft Matches:</h2>
      <ul>
        {softMatches.length > 0 ? (
          softMatches.map((match, index) => (
            <li key={index}>
              {match.resumeKeyword} ↔ {match.jobKeyword} (Confidence: {match.confidence.toFixed(2)})
            </li>
          ))
        ) : !isLoading ? (
          <p>No soft matches found.</p>
        ) : null}
      </ul>

      <h2>Resume Keywords (Alphabetical):</h2>
      <ul>
        {sortedResumeKeywords.length > 0 ? (
          sortedResumeKeywords.map((keyword, index) => <li key={index}>{keyword}</li>)
        ) : (
          <p>No keywords extracted from resume.</p>
        )}
      </ul>

      <h2>Job Description Keywords (Alphabetical):</h2>
      <ul>
        {sortedJobKeywords.length > 0 ? (
          sortedJobKeywords.map((keyword, index) => <li key={index}>{keyword}</li>)
        ) : (
          <p>No keywords extracted from job description.</p>
        )}
      </ul>

      <h2>Matching Keywords (Alphabetical):</h2>
      <ul>
        {matchingKeywords.length > 0 ? (
          matchingKeywords.map((keyword, index) => <li key={index}>{keyword}</li>)
        ) : (
          <p>No matching keywords found.</p>
        )}
      </ul>

      <h2>Missing Keywords (Alphabetical):</h2>
      <ul>
        {missingKeywords.length > 0 ? (
          missingKeywords.map((keyword, index) => <li key={index} style={{ color: 'red' }}>{keyword}</li>)
        ) : (
          <p style={{ color: 'green' }}>All keywords from job description are present in the resume.</p>
        )}
      </ul>
    </div>
  );
};

export default Results;
