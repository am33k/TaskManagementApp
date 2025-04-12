// models/Column.js
const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  order: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Column', columnSchema);
