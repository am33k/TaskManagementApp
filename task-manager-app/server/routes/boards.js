const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createBoard,
  getBoardWithDetails,
  getBoards, // ✅ Import this
} = require('../controllers/boardController');

router.post('/', protect, createBoard);
router.get('/', protect, getBoards); // ✅ Add this
router.get('/:id', protect, getBoardWithDetails);

module.exports = router;
