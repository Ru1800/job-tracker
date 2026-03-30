const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, enum: ['applied', 'interviewed', 'offered', 'rejected'], default: 'applied' },
  salary: { type: Number, default: undefined },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String },
  jobLink: { type: String },
  nextAction: { type: String },
  contact: { type: String }
});

module.exports = mongoose.model('Job', JobSchema);