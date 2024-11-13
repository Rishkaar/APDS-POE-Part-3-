//frontend // reg
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // useNavigate hook to handle redirection
  const navigate = useNavigate();  // Initialize navigate

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Simple validation: Ensure all fields are filled
    if (!formData.fullName || !formData.idNumber || !formData.accountNumber || !formData.password) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      // Send POST request to backend
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // On successful registration, show success message and clear form
      setSuccessMessage(res.data.msg || 'User registered successfully.');
      setErrorMessage('');
      setFormData({
        fullName: '',
        idNumber: '',
        accountNumber: '',
        password: ''
      });

      // Redirect to Login after 2 seconds
      setTimeout(() => {
        navigate('/');  // Redirect to Login page
      }, 1000);
    } catch (err) {
      // Handle error response
      setErrorMessage(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={formData.idNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={formData.accountNumber}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
