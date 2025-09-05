import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:8000/generate-questions',
        formData
      );
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating questions');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎓 AI Study Buddy</h1>
      
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{
          fontSize: '1.2rem',
          padding: '16px',
          margin: '16px 0',
          borderRadius: '8px',
          border: '2px solid #007bff',
          width: '300px',
          cursor: 'pointer'
        }}
      />
      <br />
      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        style={{
          fontSize: '1.2rem',
          padding: '16px 32px',
          borderRadius: '8px',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        {loading ? 'Generating...' : 'Generate Questions'}
      </button>

      {questions.length > 0 && (
        <div>
          <h2>Generated Questions:</h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              justifyContent: 'center'
            }}
          >
            {questions.map((q) => (
              <div
                key={q.id}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  padding: '20px',
                  width: '350px',
                  textAlign: 'left'
                }}
              >
                <h3 style={{ marginBottom: '10px' }}>{q.question}</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {Object.entries(q.options).map(([key, value]) => (
                    <li
                      key={key}
                      style={{
                        background: key === q.correct_answer ? '#e6f7ff' : 'transparent',
                        padding: '6px 0',
                        borderRadius: '6px',
                        fontWeight: key === q.correct_answer ? 'bold' : 'normal'
                      }}
                    >
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '10px', color: '#555' }}>
                  <strong>Answer:</strong> {q.correct_answer}
                  <br />
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;