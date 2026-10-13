const deckCardService = require('../services/deckCardService');

const getDeckCards = async (req, res, next) => {
  try {
    const deckId = req.params.deckId;

    const cards = await deckCardService.getDeckCards(deckId);
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

const postDeckCard = async (req, res, next) => {
  try {
    const deckId = req.params.deckId;
    const { front, back } = req.body;

    if (
      typeof front !== 'string' ||
      !front.trim() ||
      typeof back !== 'string' ||
      !back.trim()
    ) {
      return res.status(400).json({
        message: 'Front and back must be non-empty strings',
      });
    }

    const newCard = await deckCardService.postDeckCard(deckId, {
      front: front.trim(),
      back: back.trim(),
    });
    res.status(201).json(newCard);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDeckCards, postDeckCard };
