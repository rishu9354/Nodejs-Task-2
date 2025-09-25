const mongoose = require("mongoose");

const alertSchema = mongoose.Schema({
  crypto: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  direction: { type: String, enum: ['above', 'below'], required: true },
  triggered: { type: Boolean, default: false },
  triggeredAt: Date,
});


module.exports = mongoose.model("alert", alertSchema);
