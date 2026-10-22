const deckService = require('../services/deckService');

const getDecks = async (req, res, next) => {
  try {
    const decks = await deckService.getDecks();

    res.json(decks);
  } catch (error) {
    next(error);
  }
};

const getDeckById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deck = await deckService.getDeckById(id);

    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    res.json(deck);
  } catch (error) {
    next(error);
  }
};

const postDeck = async (req, res, next) => {
  try {
    const { name, description, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ message: 'Name and userId are required' });
    }

    const deck = await deckService.postDeck({
      name,
      description,
      userId,
    });

    res.status(201).json(deck);
  } catch (error) {
    next(error);
  }
};

const patchDeck = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    const allowedFields = ['name', 'description'];
    const providedFields = Object.keys(req.body);

    if (providedFields.some((field) => !allowedFields.includes(field))) {
      return res.status(400).json({
        message: 'Only name and description can be updated',
      });
    }

    if (providedFields.length === 0) {
      return res.status(400).json({
        message: 'At least one field (name or description) is required',
      });
    }

    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({
        message: 'Name must be a non-empty string',
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== 'string'
    ) {
      return res.status(400).json({
        message: 'Description must be a string or null',
      });
    }

    const data = {};

    if (name !== undefined) {
      data.name = name.trim();
    }

    if (description !== undefined) {
      data.description = description === null ? null : description.trim();
    }

    const updatedDeck = await deckService.patchDeck(id, data);
    res.status(200).json(updatedDeck);
  } catch (error) {
    next(error);
  }
};

const deleteDeck = async (req, res, next) => {
  try {
    const id = req.params.id;
    await deckService.deleteDeck(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getDecks, getDeckById, postDeck, patchDeck, deleteDeck };
