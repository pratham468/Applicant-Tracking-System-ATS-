# Applicant Tracking System (ATS)

The ATS is an intelligent system designed to analyze and compare resumes against job descriptions using state-of-the-art natural language processing and mechanical matching techniques. It extracts key information, identifies similarities, and highlights gaps to streamline the hiring process.  

 <img width="1876" height="899" alt="Screenshot 2025-08-21 004105" src="https://github.com/user-attachments/assets/d1e65a75-1aef-4caa-a78d-8a19af16241b" />
 
<img width="1864" height="941" alt="Screenshot 2025-08-21 004225" src="https://github.com/user-attachments/assets/77576884-239e-43bc-9276-e3e9171bed56" /> 

## Features  

### 1. Soft Matches with Confidence Levels  
Leverages **Large Language Models (LLMs)** to identify textual similarities between job description keywords and resume keywords. Each match comes with a **confidence level**, allowing users to evaluate the strength of the match and set thresholds for displaying results based on confidence levels in future iterations.  
**Example:** `"Visual Studio ↔ certifications"` (Confidence: **0.50**) → Likely ignored. `"Product Roadmap Development ↔ product roadmap"` (Confidence: **0.88**) → Likely accepted.  

### 2. Keyword Extraction  
- **From Resumes:** Extracts and identifies important keywords from the resume, sorting them alphabetically for easy readability.  
- **From Job Descriptions:** Extracts key terms from the job description, sorting them alphabetically for consistency and easy comparison.  

### 3. Mechanical Matching  
Performs a **100% similarity match** between keywords from resumes and job descriptions. This is a **case-sensitive process**, ensuring matches respect upper- and lowercase distinctions, providing a reliable list of exactly matched keywords.  

### 4. Missing Keywords  
Identifies missing keywords by calculating the difference between the extracted keywords from the job description and the mechanically matched keyword set. Highlights **gaps** in the resume, providing actionable insights for optimization or further evaluation.  


## Project Structure  
The project is organized into two main components: **Backend:** Contains the logic for keyword extraction, soft matching, and mechanical matching. Located in the `/backend/` directory. **Frontend:** Provides a user-friendly interface for uploading resumes, adding job descriptions, and viewing results. Located in the **root directory**.  


## Getting Started  

### 5. Prerequisites  
Ensure the following tools are installed: **[Node.js](https://nodejs.org/)** (v14 or later), **[npm](https://www.npmjs.com/)** (Node Package Manager).  


### 6. Installation  
Clone the repository:  
```sh
git clone https://github.com/pratham468/Applicant-Tracking-System-ATS-.git
cd   
```

### Install Dependencies 

#### Backend:  
```sh
cd backend  
npm install  
```

#### Frontend:
```sh
   cd frontend
   npm install
```

### 7. Set up local environments

GEMINI_API_KEY=TYPE-YOUR-API_KEY-HERE_WITHOUT-QUOTES
PORT=5001


## Running the Project
### 8. Start the Backend

Navigate to the backend/ directory and start the server:
```sh
cd backend
node server.js
```
The backend will run at http://localhost:5001 by default.


### 9. Start the Frontend

Navigate to the backend/ directory and start the React app:
```sh
Cd frontend
npm start
```
The frontend will open at http://localhost:3000 if you followed the .env.example setup.


### 10. How to use the application

#### 10.1 <u>Upload a resume<u>
- Supported file formats: PDF, DOC, DOCX.<br>
- Upload a resume in one of the supported file types.<br>

#### 10.2 <u>Upload Job Description<u>
After the validation and verification completes and the file is checked-marked as OK, 
add job description: either as a file in the same format as the resume or copy/paste as a plain text.

#### 10.3 Click button "Submit to Process Resume and job Description"



Contributing

We welcome contributions! Here’s how you can help:

Fork the repository.
Create a feature branch:
   git checkout -b feature-name
Commit your changes:
   git commit -m "Description of changes"
Push the branch and create a pull request.

## Technologies Used

- **Frontend**: [React.js](https://reactjs.org/) (JavaScript library for building user interfaces)
- **Backend**: [Node.js](https://nodejs.org/) (JavaScript runtime environment)
- **Package Manager**: [npm](https://www.npmjs.com/) (Node Package Manager)



License

This project is open-source and licensed under the MIT License. See the LICENSE file for details.
