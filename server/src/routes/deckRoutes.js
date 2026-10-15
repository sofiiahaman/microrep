const express = require('express');
const router = express.Router();

const {
  getDecks,
  getDeckById,
  postDeck,
  patchDeck,
  deleteDeck,
} = require('../controllers/deckController');

router.get('/', getDecks);
router.get('/:id', getDeckById);
router.post('/', postDeck);
router.patch('/:id', patchDeck);
router.delete('/:id', deleteDeck);

module.exports = router;
