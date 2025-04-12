// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
