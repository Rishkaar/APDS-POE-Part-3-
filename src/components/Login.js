import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

function Login() {
  const [formData, setFormData] = useState({ accountNumber: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  // Initialize the useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure both fields are filled out
    if (!formData.accountNumber || !formData.password) {
      setErrorMessage('Both fields are required.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      // Store token in local storage on successful login
      localStorage.setItem('token', res.data.token);
      setErrorMessage('');
      alert('Login successful');

      // Redirect to Payment Portal after login
      navigate('/payment');  // This will redirect the user to the Payment page
    } catch (err) {
      setErrorMessage('Invalid login credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>

      {/* Add link to Register page */}
      <div className="register-link">
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
}

export default Login;
