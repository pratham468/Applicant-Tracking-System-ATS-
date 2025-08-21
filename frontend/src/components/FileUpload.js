import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FileUpload.css'; // We'll create this CSS file

const FileUpload = ({ onKeywordsExtracted, onJobDescriptionProcessed }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [jobText, setJobText] = useState('');
  const [resumeKeywords, setResumeKeywords] = useState([]);
  const [jobKeywords, setJobKeywords] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ resume: 0, job: 0 });
  const [activeJobTab, setActiveJobTab] = useState('file'); // 'file' or 'text'
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

  // Upload Resume with progress
  const handleResumeUpload = async () => {
    if (!resumeFile) {
      showNotification('Please select a resume file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    setIsProcessing(true);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => ({
        ...prev,
        resume: Math.min(prev.resume + 10, 90)
      }));
    }, 200);

    try {
      const response = await axios.post('http://localhost:5001/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, resume: 100 }));

      const extractedKeywords = normalizeKeywords(response.data.keywords);
      setResumeKeywords(extractedKeywords);
      onKeywordsExtracted(extractedKeywords);
      
      showNotification('Resume processed successfully!', 'success');
      
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, resume: 0 }));
      }, 2000);
      
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      showNotification('Failed to upload resume', 'error');
      setUploadProgress(prev => ({ ...prev, resume: 0 }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Upload Job Description (File)
  const handleJobUpload = async () => {
    if (!jobFile) {
      showNotification('Please select a job description file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('jobDescription', jobFile);
    setIsProcessing(true);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => ({
        ...prev,
        job: Math.min(prev.job + 10, 90)
      }));
    }, 200);

    try {
      const response = await axios.post('http://localhost:5001/api/job/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, job: 100 }));

      const extractedKeywords = normalizeKeywords(response.data.keywords);
      setJobKeywords(extractedKeywords);
      onJobDescriptionProcessed(extractedKeywords);
      
      showNotification('Job description processed successfully!', 'success');
      
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, job: 0 }));
      }, 2000);
      
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      showNotification('Failed to upload job description', 'error');
      setUploadProgress(prev => ({ ...prev, job: 0 }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Process Job Description (Text)
  const handleJobTextProcess = async () => {
    if (!jobText.trim()) {
      showNotification('Please paste a job description', 'error');
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await axios.post('http://localhost:5001/api/job/keywords', { text: jobText });
      const extractedKeywords = normalizeKeywords(response.data.keywords);
      setJobKeywords(extractedKeywords);
      onJobDescriptionProcessed(extractedKeywords);
      showNotification('Job description processed successfully!', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to process job description text', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigate to Results
  const goToResults = () => {
    if (resumeKeywords.length === 0 && jobKeywords.length === 0) {
      showNotification('Please upload both resume and job description first', 'warning');
      return;
    }
    if (resumeKeywords.length === 0) {
      showNotification('Please upload and analyze your resume first', 'warning');
      return;
    }
    if (jobKeywords.length === 0) {
      showNotification('Please upload and analyze job description first', 'warning');
      return;
    }
    navigate('/results');
  };

  // Notification system
  const showNotification = (message, type) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  return (
    <div className="file-upload-container">
      {/* Animated Background */}
      <div className="bg-animation"></div>
      
      {/* Main Content */}
      <div className="upload-content">
        <div className="header-section">
          <h1 className="main-title">ATS Resume Checker</h1>
          <p className="subtitle">Analyze your resume against job requirements with AI-powered keyword matching</p>
        </div>

        <div className="upload-sections">
          {/* Resume Upload Section */}
          <div className="upload-card resume-section">
            <div className="card-header">
              <div className="icon">📄</div>
              <h2>Upload Resume</h2>
            </div>
            
            <div className="upload-area">
              <div className={`file-drop-zone ${resumeFile ? 'has-file' : ''}`}>
                <input 
                  type="file" 
                  id="resume-upload"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                  className="file-input"
                />
                <label htmlFor="resume-upload" className="file-label">
                  {resumeFile ? (
                    <div className="file-info">
                      <span className="file-name">{resumeFile.name}</span>
                      <span className="file-size">{(resumeFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ) : (
                    <div className="upload-prompt">
                      <div className="upload-icon">⬆️</div>
                      <span>Click to upload or drag and drop</span>
                      <small>PDF, DOC, DOCX up to 10MB</small>
                    </div>
                  )}
                </label>
              </div>
              
              {uploadProgress.resume > 0 && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${uploadProgress.resume}%`}}></div>
                  <span className="progress-text">{uploadProgress.resume}%</span>
                </div>
              )}
              
              <button 
                onClick={handleResumeUpload} 
                className={`upload-btn ${isProcessing ? 'processing' : ''}`}
                disabled={!resumeFile || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Analyze Resume'}
              </button>
            </div>

            {resumeKeywords.length > 0 && (
              <div className="keywords-preview">
                <h3>Extracted Keywords ({resumeKeywords.length})</h3>
                <div className="keywords-container">
                  {resumeKeywords.slice(0, 10).map((keyword, index) => (
                    <span key={index} className="keyword-tag resume-tag">{keyword}</span>
                  ))}
                  {resumeKeywords.length > 10 && (
                    <span className="more-keywords">+{resumeKeywords.length - 10} more</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Job Description Section */}
          <div className="upload-card job-section">
            <div className="card-header">
              <div className="icon">💼</div>
              <h2>Job Description</h2>
            </div>
            
            <div className="job-input-tabs">
              <div className="tab-buttons">
                <button 
                  className={`tab-btn ${activeJobTab === 'file' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveJobTab('file');
                    setJobText('');
                  }}
                >
                  Upload File
                </button>
                <button 
                  className={`tab-btn ${activeJobTab === 'text' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveJobTab('text');
                    setJobFile(null);
                  }}
                >
                  Paste Text
                </button>
              </div>
              
              {activeJobTab === 'file' ? (
                <div className="upload-area">
                  <div className={`file-drop-zone ${jobFile ? 'has-file' : ''}`}>
                    <input 
                      type="file" 
                      id="job-upload"
                      onChange={(e) => setJobFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx,.txt"
                      className="file-input"
                    />
                    <label htmlFor="job-upload" className="file-label">
                      {jobFile ? (
                        <div className="file-info">
                          <span className="file-name">{jobFile.name}</span>
                          <span className="file-size">{(jobFile.size / 1024).toFixed(1)} KB</span>
                        </div>
                      ) : (
                        <div className="upload-prompt">
                          <div className="upload-icon">⬆️</div>
                          <span>Upload job description</span>
                          <small>PDF, DOC, DOCX, TXT</small>
                        </div>
                      )}
                    </label>
                  </div>
                  
                  {uploadProgress.job > 0 && (
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${uploadProgress.job}%`}}></div>
                      <span className="progress-text">{uploadProgress.job}%</span>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleJobUpload} 
                    className={`upload-btn ${isProcessing ? 'processing' : ''}`}
                    disabled={!jobFile || isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Analyze Job Description'}
                  </button>
                </div>
              ) : (
                <div className="text-input-area">
                  <textarea
                    className="job-textarea"
                    placeholder="Paste the job description here..."
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    rows="8"
                  />
                  <button 
                    onClick={handleJobTextProcess} 
                    className={`upload-btn ${isProcessing ? 'processing' : ''}`}
                    disabled={!jobText.trim() || isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Analyze Text'}
                  </button>
                </div>
              )}
            </div>

            {jobKeywords.length > 0 && (
              <div className="keywords-preview">
                <h3>Extracted Keywords ({jobKeywords.length})</h3>
                <div className="keywords-container">
                  {jobKeywords.slice(0, 10).map((keyword, index) => (
                    <span key={index} className="keyword-tag job-tag">{keyword}</span>
                  ))}
                  {jobKeywords.length > 10 && (
                    <span className="more-keywords">+{jobKeywords.length - 10} more</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Button */}
        <div className="results-section">
          <button 
            onClick={goToResults}
            className={`results-btn ${(resumeKeywords.length > 0 || jobKeywords.length > 0) ? 'ready' : ''}`}
          >
            <span className="btn-text">View Analysis Results</span>
            <span className="btn-icon">→</span>
          </button>
          
          <div className="results-status">
            <div className={`status-item ${resumeKeywords.length > 0 ? 'completed' : ''}`}>
              <span className="status-icon">{resumeKeywords.length > 0 ? '✅' : '⭕'}</span>
              Resume: {resumeKeywords.length > 0 ? `${resumeKeywords.length} keywords found` : 'Not analyzed'}
            </div>
            
            <div className={`status-item ${jobKeywords.length > 0 ? 'completed' : ''}`}>
              <span className="status-icon">{jobKeywords.length > 0 ? '✅' : '⭕'}</span>
              Job Description: {jobKeywords.length > 0 ? `${jobKeywords.length} keywords found` : 'Not analyzed'}
            </div>
          </div>
          
          {(resumeKeywords.length === 0 && jobKeywords.length === 0) && (
            <p className="results-hint">
              Upload and analyze both resume and job description to view results
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;