'use client';

import { useState } from 'react';

export default function ContestForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Repository: '',
    Reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.Name.trim()) return 'Name is required';
    if (!formData.Email.trim()) return 'Email is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) return 'Please enter a valid email address';
    
    // Repository URL validation
    if (!formData.Repository.trim()) return 'Repository URL is required';
    const urlRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/;
    if (!urlRegex.test(formData.Repository)) return 'Please enter a valid GitHub repository URL';
    
    // Reason validation
    if (!formData.Reason.trim()) return 'Please explain why your project is valuable';
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit entry');
      }
      
      // Reset form
      setFormData({
        Name: '',
        Email: '',
        Repository: '',
        Reason: ''
      });
      
      // Notify parent component of successful submission
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="submission-form" onSubmit={handleSubmit}>
      {error && (
        <div style={{ color: '#ff6b6b', marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '6px' }}>
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="Name">Your Name</label>
        <input 
          type="text" 
          id="Name" 
          placeholder="Enter your full name" 
          value={formData.Name}
          onChange={handleChange}
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="Email">Email Address</label>
        <input 
          type="email" 
          id="Email" 
          placeholder="your@email.com" 
          value={formData.Email}
          onChange={handleChange}
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="Repository">GitHub Repository URL</label>
        <input 
          type="url" 
          id="Repository" 
          placeholder="https://github.com/username/repository" 
          value={formData.Repository}
          onChange={handleChange}
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="Reason">Why is this project valuable?</label>
        <textarea 
          id="Reason" 
          placeholder="Tell us about the impact and value of your project..." 
          value={formData.Reason}
          onChange={handleChange}
          required 
        />
      </div>
      
      <button 
        type="submit" 
        className="submit-btn" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="loading"></span>
            Submitting...
          </>
        ) : 'Submit Entry'}
      </button>
    </form>
  );
}