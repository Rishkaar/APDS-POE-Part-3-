const express = require('express');
const Payment = require('../models/Payment');
const authenticateToken = require('../middleware/authenticateToken');
const authorize = require('../middleware/authorize');
const router = express.Router();

// Customer: Make a Payment
router.post('/', authenticateToken, authorize('customer'), async (req, res) => {
  const { amount, currency, provider, recipientAccount, swiftCode } = req.body;

  try {
    const newPayment = new Payment({
      userId: req.user.id,
      amount,
      currency,
      provider,
      recipientAccount,
      swiftCode,
      status: 'pending'
    });

    await newPayment.save();
    res.status(201).json({ msg: "Payment processed successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error processing payment" });
  }
});

// Admin: View All Payments
router.get('/admin/all', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'fullName accountNumber');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ msg: "Error retrieving payments" });
  }
});

// Admin: Delete a Payment
router.delete('/admin/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting payment" });
  }
});

// Admin: Process a Payment
router.put('/admin/:id/process', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id, 
      { status: 'processed' }, 
      { new: true }
    );
    res.status(200).json({ msg: "Payment processed successfully", payment });
  } catch (error) {
    res.status(500).json({ msg: "Error processing payment" });
  }
});

module.exports = router;
