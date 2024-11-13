const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    required: true 
  },
  provider: { 
    type: String, 
    required: true 
  },
  recipientAccount: { 
    type: String, 
    required: true 
  },
  swiftCode: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'processed'], 
    default: 'pending' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
