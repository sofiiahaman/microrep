const express = require('express');
const { getDueCards } = require('../controllers/studyController');

const router = express.Router();

router.get('/due', getDueCards);

module.exports = router;
