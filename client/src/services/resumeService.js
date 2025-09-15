import axios from 'axios';

const API_URL = 'http://localhost:5000/api/resume/analyze';

export const analyzeResume = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData);
    return response.data;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
};
