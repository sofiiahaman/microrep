const studyService = require('../services/studyService');

const getDueCards = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (typeof userId !== 'string' || !userId.trim()) {
      return res.status(400).json({
        message: 'userId query parameter is required',
      });
    }

    const cards = await studyService.getDueCards(userId);

    return res.status(200).json({
      count: cards.length,
      cards,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDueCards };
