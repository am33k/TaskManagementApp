const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
    createTask,
    deleteTask,
    updateTask, // ✅ Add this
  } = require('../controllers/taskController');
  

router.post('/', protect, createTask);
router.patch('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);


module.exports = router;
