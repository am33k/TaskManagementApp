const Board = require('../models/Board');
const Column = require('../models/Column');
const Task = require('../models/Task');

exports.createBoard = async (req, res) => {
  const { name } = req.body;
  const board = await Board.create({ name, owner: req.user._id, members: [req.user._id] });
  res.status(201).json(board);
};

exports.getBoardWithDetails = async (req, res) => {
  const boardId = req.params.id;

  const board = await Board.findById(boardId).populate('members', 'name email');
  const columns = await Column.find({ boardId }).sort('order');
  const tasks = await Task.find({ columnId: { $in: columns.map(col => col._id) } });

  res.json({ board, columns, tasks });
};

exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ members: req.user._id }); // ✅ show user's boards
    res.json(boards);
  } catch (err) {
    console.error('Error fetching boards:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
