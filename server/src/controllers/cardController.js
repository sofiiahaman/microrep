const cardService = require('../services/cardService');

const getCardById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const card = await cardService.getCardById(id);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    next(error);
  }
};

const patchCard = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { front, back } = req.body;

    if (front === undefined && back === undefined) {
      return res.status(400).json({
        message: 'At least one field (front or back) is required',
      });
    }

    const data = {};

    if (front !== undefined) data.front = front;
    if (back !== undefined) data.back = back;

    const updatedCard = await cardService.patchCard(id, data);
    res.status(200).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const id = req.params.id;
    await cardService.deleteCard(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getCardById, patchCard, deleteCard };
