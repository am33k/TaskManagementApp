const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
    createColumn,
    updateColumn,
    deleteColumn,
  } = require('../controllers/columnController');
  

router.post('/', protect, createColumn);
router.patch('/:id', protect, updateColumn);
router.delete('/:id', protect, deleteColumn);


module.exports = router;
