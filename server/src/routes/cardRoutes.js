const express = require('express');
const router = express.Router();

const {
  getCardById,
  patchCard,
  deleteCard,
} = require('../controllers/cardController');

const { createReview } = require('../controllers/reviewController');

router.get('/:id', getCardById);
router.patch('/:id', patchCard);
router.delete('/:id', deleteCard);

router.post('/:id/reviews', createReview);

module.exports = router;
