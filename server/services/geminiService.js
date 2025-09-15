const analyzeResume = async (jobDescription) => {
  try {
      console.log(`Analyzing job description: ${jobDescription}`);

      // ✅ Simulate AI-based analysis (Mock)
      const response = {
          role: "Software Engineer",
          skills: ["JavaScript", "React", "Node.js"],
          experienceLevel: "Intermediate",
          analysis: `Based on the job description, the candidate should have strong JS, React, and Node.js experience.`
      };

      console.log('✅ Analysis Result:', response);

      return response;
  } catch (error) {
      console.error('❌ Error in analyzing resume:', error);
      throw new Error('Failed to analyze resume');
  }
};

module.exports = {
  analyzeResume
};
