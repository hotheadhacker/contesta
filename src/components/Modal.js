'use client';
import { useState } from 'react';
import styles from './Modal.module.css';

export default function Modal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    repo: '',
    reason: ''
  });
  
  // Track which fields have been touched/interacted with
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    repo: false,
    reason: false
  });
  
  // Track if form has been submitted
  const [submitted, setSubmitted] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    repo: '',
    reason: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field on change if it's been touched or form was submitted
    if (touched[name] || submitted) {
      validateField(name, value);
    }
  };
  
  // Mark field as touched when user interacts with it
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate on blur
    validateField(name, formData[name]);
  };
  
  // Validate a single field
  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errorMessage = 'Name is required';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errorMessage = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = 'Email is invalid';
        }
        break;
      case 'repo':
        if (!value.trim()) {
          errorMessage = 'Repository URL is required';
        } else if (!/^https?:\/\/github\.com\/[\w-]+\/[\w-]+/.test(value)) {
          errorMessage = 'Please enter a valid GitHub repository URL';
        }
        break;
      case 'reason':
        if (!value.trim()) {
          errorMessage = 'Please explain why your project is valuable';
        } else if (value.trim().length < 20) {
          errorMessage = 'Please provide a more detailed explanation (at least 20 characters)';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
    
    return !errorMessage;
  };
  
  // Validate all fields
  const validateForm = () => {
    const fields = ['name', 'email', 'repo', 'reason'];
    let isValid = true;
    
    fields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field]);
      isValid = isValid && fieldIsValid;
    });
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (validateForm()) {
      onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        repo: '',
        reason: ''
      });
      setTouched({
        name: false,
        email: false,
        repo: false,
        reason: false
      });
      setSubmitted(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Submit Your Project</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.name && errors.name ? styles.inputError : ''}
            />
            {touched.name && errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? styles.inputError : ''}
            />
            {touched.email && errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="repo">GitHub Repository URL</label>
            <input
              type="url"
              id="repo"
              name="repo"
              value={formData.repo}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.repo && errors.repo ? styles.inputError : ''}
              placeholder="https://github.com/username/repository"
            />
            {touched.repo && errors.repo && <div className={styles.errorMessage}>{errors.repo}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="reason">Why is this project valuable?</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.reason && errors.reason ? styles.inputError : ''}
              rows="4"
            ></textarea>
            {touched.reason && errors.reason && <div className={styles.errorMessage}>{errors.reason}</div>}
          </div>
          
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
            <button type="submit" className={styles.submitButton}>Submit Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
}