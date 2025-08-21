import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Results.css'; // We'll create this CSS file

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
  
  // Analysis states
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Sort keywords alphabetically
    setSortedResumeKeywords([...resumeKeywords].sort((a, b) => a.localeCompare(b)));
    setSortedJobKeywords([...jobDescriptionKeywords].sort((a, b) => a.localeCompare(b)));

    // Find exact matches
    const matching = resumeKeywords.filter((keyword) => jobDescriptionKeywords.includes(keyword));
    setMatchingKeywords(matching);

    // Calculate initial match score
    if (jobDescriptionKeywords.length > 0) {
      const score = Math.round((matching.length / jobDescriptionKeywords.length) * 100);
      setMatchScore(score);
    }

    // Generate recommendations
    generateRecommendations(matching.length, jobDescriptionKeywords.length, missingKeywords);

    // Fetch soft matches if both sets exist
    if (resumeKeywords.length > 0 && jobDescriptionKeywords.length > 0) {
      fetchSoftMatches(resumeKeywords, jobDescriptionKeywords);
    }
  }, [resumeKeywords, jobDescriptionKeywords, missingKeywords]);

  const fetchSoftMatches = async (resumeKeywords, jobKeywords) => {
    setIsLoading(true);
    setLoadingProgress(0);

    try {
      // Simulate incremental progress with more realistic timing
      const progressSteps = [15, 35, 55, 75, 90, 100];
      const delays = [300, 500, 700, 400, 300, 200];

      progressSteps.forEach((step, index) => {
        setTimeout(() => {
          setLoadingProgress(step);
        }, delays.slice(0, index + 1).reduce((a, b) => a + b, 0));
      });

      const response = await axios.post('http://localhost:5001/api/documents/match', {
        resumeKeywords,
        jobKeywords,
      });

      setSoftMatches(response.data.softMatches || []);
      
      // Update match score with soft matches
      const softMatchBonus = (response.data.softMatches?.length || 0) * 2;
      setMatchScore(prev => Math.min(prev + softMatchBonus, 100));
      
      setAnalysisComplete(true);
      
    } catch (error) {
      console.error('Error fetching soft matches:', error.message);
      setAnalysisComplete(true);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const generateRecommendations = (matchCount, totalJobKeywords, missing) => {
    const recommendations = [];
    
    if (matchCount / totalJobKeywords < 0.3) {
      recommendations.push({
        type: 'critical',
        icon: '🚨',
        title: 'Low Keyword Match',
        description: 'Consider adding more relevant keywords from the job description to your resume.'
      });
    }
    
    if (missing.length > 0) {
      recommendations.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Missing Key Skills',
        description: `${missing.length} important keywords are missing from your resume.`
      });
    }
    
    if (matchCount / totalJobKeywords > 0.7) {
      recommendations.push({
        type: 'success',
        icon: '✅',
        title: 'Strong Match',
        description: 'Your resume shows excellent alignment with the job requirements.'
      });
    } else {
      recommendations.push({
        type: 'info',
        icon: '💡',
        title: 'Optimization Opportunity',
        description: 'Incorporate more industry-specific terms and technical skills.'
      });
    }

    setRecommendations(recommendations);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  return (
    <div className="results-container">
      {/* Animated Background */}
      <div className="bg-animation"></div>
      
      <div className="results-content">
        {/* Header */}
        <div className="results-header">
          <button onClick={() => navigate('/')} className="back-btn">
            <span className="back-icon">←</span>
            Back to Upload
          </button>
          
          <div className="header-content">
            <h1 className="results-title">ATS Analysis Results</h1>
            <p className="results-subtitle">Comprehensive keyword matching and resume optimization insights</p>
          </div>
        </div>

        {/* Score Dashboard */}
        <div className="score-dashboard">
          <div className="score-card main-score">
            <div className="score-circle" style={{'--score': matchScore, '--color': getScoreColor(matchScore)}}>
              <div className="score-value">{matchScore}%</div>
              <div className="score-label">{getScoreLabel(matchScore)}</div>
            </div>
          </div>
          
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">📄</div>
              <div className="metric-value">{sortedResumeKeywords.length}</div>
              <div className="metric-label">Resume Keywords</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">💼</div>
              <div className="metric-value">{sortedJobKeywords.length}</div>
              <div className="metric-label">Job Keywords</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">✅</div>
              <div className="metric-value">{matchingKeywords.length}</div>
              <div className="metric-label">Exact Matches</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">🔗</div>
              <div className="metric-value">{softMatches.length}</div>
              <div className="metric-label">Soft Matches</div>
            </div>
          </div>
        </div>

        {/* Loading Section */}
        {isLoading && (
          <div className="loading-section">
            <div className="loading-card">
              <div className="loading-animation">
                <div className="loading-spinner"></div>
              </div>
              <h3>Analyzing Keywords...</h3>
              <p>Processing semantic matches and calculating compatibility scores</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${loadingProgress}%`}}></div>
                <span className="progress-text">{loadingProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysisComplete && recommendations.length > 0 && (
          <div className="recommendations-section">
            <h2 className="section-title">
              <span className="title-icon">🎯</span>
              Recommendations
            </h2>
            <div className="recommendations-grid">
              {recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-card ${rec.type}`}>
                  <div className="rec-icon">{rec.icon}</div>
                  <div className="rec-content">
                    <h4>{rec.title}</h4>
                    <p>{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Results Grid */}
        <div className="analysis-grid">
          {/* Soft Matches */}
          <div className="analysis-card">
            <div className="card-header">
              <h2>
                <span className="header-icon">🔗</span>
                Semantic Matches
              </h2>
              <div className="card-badge">{softMatches.length}</div>
            </div>
            
            <div className="card-content">
              {softMatches.length > 0 ? (
                <div className="matches-list">
                  {softMatches.slice(0, 10).map((match, index) => (
                    <div key={index} className="match-item">
                      <div className="match-pair">
                        <span className="resume-keyword">{match.resumeKeyword}</span>
                        <span className="match-arrow">↔</span>
                        <span className="job-keyword">{match.jobKeyword}</span>
                      </div>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill" 
                          style={{width: `${match.confidence * 100}%`}}
                        ></div>
                        <span className="confidence-text">{(match.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                  {softMatches.length > 10 && (
                    <div className="show-more">
                      +{softMatches.length - 10} more matches
                    </div>
                  )}
                </div>
              ) : !isLoading ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <p>No semantic matches found. Consider using more varied terminology.</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Exact Matches */}
          <div className="analysis-card">
            <div className="card-header">
              <h2>
                <span className="header-icon">✅</span>
                Exact Matches
              </h2>
              <div className="card-badge success">{matchingKeywords.length}</div>
            </div>
            
            <div className="card-content">
              {matchingKeywords.length > 0 ? (
                <div className="keywords-grid">
                  {matchingKeywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag match-tag">{keyword}</span>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">❌</div>
                  <p>No exact keyword matches found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="analysis-card">
            <div className="card-header">
              <h2>
                <span className="header-icon">⚠️</span>
                Missing Keywords
              </h2>
              <div className="card-badge warning">{missingKeywords.length}</div>
            </div>
            
            <div className="card-content">
              {missingKeywords.length > 0 ? (
                <div className="keywords-grid">
                  {missingKeywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag missing-tag">{keyword}</span>
                  ))}
                </div>
              ) : (
                <div className="empty-state success">
                  <div className="empty-icon">🎉</div>
                  <p>Great! All job description keywords are present in your resume.</p>
                </div>
              )}
            </div>
          </div>

          {/* All Keywords Comparison */}
          <div className="analysis-card full-width">
            <div className="card-header">
              <h2>
                <span className="header-icon">📊</span>
                Complete Keyword Analysis
              </h2>
            </div>
            
            <div className="card-content">
              <div className="keywords-comparison">
                <div className="keyword-section">
                  <h3>Resume Keywords ({sortedResumeKeywords.length})</h3>
                  <div className="keywords-grid scrollable">
                    {sortedResumeKeywords.length > 0 ? (
                      sortedResumeKeywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag resume-tag">{keyword}</span>
                      ))
                    ) : (
                      <p className="empty-text">No keywords extracted from resume.</p>
                    )}
                  </div>
                </div>
                
                <div className="keyword-section">
                  <h3>Job Description Keywords ({sortedJobKeywords.length})</h3>
                  <div className="keywords-grid scrollable">
                    {sortedJobKeywords.length > 0 ? (
                      sortedJobKeywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag job-tag">{keyword}</span>
                      ))
                    ) : (
                      <p className="empty-text">No keywords extracted from job description.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <button onClick={() => navigate('/')} className="action-btn primary">
            Analyze Another Resume
          </button>
          <button 
            onClick={() => window.print()} 
            className="action-btn secondary"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;