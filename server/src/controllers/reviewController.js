const reviewService = require('../services/reviewService');

const VALID_RATINGS = ['AGAIN', 'HARD', 'GOOD', 'EASY'];

const createReview = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const { rating } = req.body;

    if (!VALID_RATINGS.includes(rating)) {
      return res.status(400).json({
        message: 'Rating must be one of: AGAIN, HARD, GOOD, EASY',
      });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'userId is required',
      });
    }

    const result = await reviewService.createReview(cardId, userId, rating);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview };
