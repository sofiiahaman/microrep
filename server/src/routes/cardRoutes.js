const express = require('express');
const router = express.Router();

const {
  getCardById,
  patchCard,
  deleteCard,
} = require('../controllers/cardController');

router.get('/:id', getCardById);
router.patch('/:id', patchCard);
router.delete('/:id', deleteCard);

module.exports = router;
