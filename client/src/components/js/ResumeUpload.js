import React, { useState } from 'react';
import axios from 'axios';
import Footer from './footer';

const ResumeUpload = () => {
  const user = JSON.parse(localStorage.getItem('user')); // get logged-in user info
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      console.log('Uploading file...');
      const response = await axios.post('http://localhost:5000/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);

      setQuestions(response.data.questions || []);
      setError('');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
    }
  };

  return (
    <>

      <div style={styles.container}>
        {/* Personalized Welcome */}
        {user && (
          <div style={styles.welcome}>
            <h2>Hi, {user.name}! Ready to upload your resume?</h2>
          </div>
        )}

        <div style={styles.uploadSection}>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} style={styles.uploadButton}>Upload</button>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {questions.length > 0 && (
            <div style={styles.questions}>
              <h3>Generated Questions:</h3>
              <ul>
                {questions.map((q, index) => (
                  <li key={index}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

const styles = {
  container: {
    padding: '120px 20px 20px 20px', // Add top padding for fixed Navbar
  },
  welcome: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#e0f7fa',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  uploadSection: {
    textAlign: 'center',
  },
  uploadButton: {
    display: 'inline-block',
    marginLeft: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  questions: {
    marginTop: '30px',
    textAlign: 'left',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '15px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
};

export default ResumeUpload;
