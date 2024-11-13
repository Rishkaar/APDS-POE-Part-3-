import { useEffect, useState } from 'react';
import api from '../api';

function AdminDashboard() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/admin/all');
        setPayments(res.data);
      } catch {
        setMessage('Failed to load payments.');
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      {message && <p className="error-message">{message}</p>}
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Recipient</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment._id}>
              <td>{payment.amount}</td>
              <td>{payment.currency}</td>
              <td>{payment.recipientAccount}</td>
              <td>{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
