const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getDeckCards,
  postDeckCard,
} = require('../controllers/deckCardController');

router.get('/', getDeckCards);
router.post('/', postDeckCard);

module.exports = router;
