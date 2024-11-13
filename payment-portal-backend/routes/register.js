import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      setSuccessMessage(res.data || 'Registration successful');
      setErrorMessage('');
      setFormData({
        fullName: '',
        idNumber: '',
        accountNumber: '',
        password: ''
      });

      setTimeout(() => {
        navigate('/'); // Redirect to login page after successful registration
      }, 1000);
    } catch (error) {
      console.error("Error during registration:", error.response?.data || error.message); // Log the error details
      setErrorMessage(error.response?.data || 'Registration failed. Please try again.');
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
          onChange={handleChange}
          value={formData.fullName}
          required
        />
        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          onChange={handleChange}
          value={formData.idNumber}
          required
        />
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          onChange={handleChange}
          value={formData.accountNumber}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
