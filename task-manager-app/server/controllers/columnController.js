const Column = require('../models/Column');

exports.createColumn = async (req, res) => {
  const { name, boardId, order } = req.body;
  const column = await Column.create({ name, boardId, order });
  res.status(201).json(column);
};

const Task = require('../models/Task');

// DELETE /api/columns/:id
exports.deleteColumn = async (req, res) => {
  try {
    await Task.deleteMany({ columnId: req.params.id });
    const column = await Column.findByIdAndDelete(req.params.id);
    if (!column) return res.status(404).json({ message: 'Column not found' });
    res.json({ message: 'Column and its tasks deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/columns/:id
exports.updateColumn = async (req, res) => {
  const { name } = req.body;
  try {
    const column = await Column.findById(req.params.id);
    if (!column) return res.status(404).json({ message: 'Column not found' });
    column.name = name || column.name;
    await column.save();
    res.json(column);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
