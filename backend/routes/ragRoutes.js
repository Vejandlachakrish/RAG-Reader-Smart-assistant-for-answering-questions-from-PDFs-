const express = require('express');
const router = express.Router();
const { runRAG } = require('../controllers/ragController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, runRAG);

module.exports = router;
