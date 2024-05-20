import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ModelForm() {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Fetch model from backend
    fetch(`http://localhost:3000/models/${modelId}`)
      .then(response => response.json())
      .then(data => setModel(data));
  }, [modelId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send formData to backend for PDF generation
    const response = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modelId, formData }),
    });
    const data = await response.json();
    // Display or download the generated PDF
    window.open(data.pdfUrl, '_blank');
  };

  if (!model) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{model.name}</h2>
      {model.fields.map(field => (
        <div key={field}>
          <label>{field}</label>
          <input
            type="text"
            name={field}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button type="submit">Generate PDF</button>
    </form>
  );
}

export default ModelForm;
