//payments.js

import { useState } from 'react';
import axios from 'axios';

function Payment() {
  const [formData, setFormData] = useState({
    amount: '',
    currency: '',
    provider: 'SWIFT',
    payeeAccount: '',
    swiftCode: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.currency || !formData.payeeAccount || !formData.swiftCode) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post('http://localhost:5000/api/payments', formData, {
        headers: { 'x-auth-token': token }
      });

      setSuccessMessage('Payment processed successfully.');
      setErrorMessage('');
      setFormData({
        amount: '',
        currency: '',
        provider: 'SWIFT',
        payeeAccount: '',
        swiftCode: ''
      });
    } catch (err) {
      setErrorMessage('Payment failed. Please try again.');
    }
  };

  return (
    <div className="payment-container">
      <h2>Make a Payment</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <input
            type="text"
            name="currency"
            id="currency"
            placeholder="Currency (e.g. USD)"
            value={formData.currency}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="payeeAccount">Payee Account Number</label>
          <input
            type="text"
            name="payeeAccount"
            id="payeeAccount"
            placeholder="Payee Account Number"
            value={formData.payeeAccount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="swiftCode">SWIFT Code</label>
          <input
            type="text"
            name="swiftCode"
            id="swiftCode"
            placeholder="SWIFT Code"
            value={formData.swiftCode}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="pay-now-button">Pay Now</button>
      </form>
    </div>
  );
}

export default Payment;