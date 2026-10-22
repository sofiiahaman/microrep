const prisma = require('../../lib/prisma');

const getDueCards = async (userId) => {
  if (!userId) {
    const error = new Error('userId is required');
    error.status = 400;
    throw error;
  }

  const now = new Date();

  return prisma.card.findMany({
    where: {
      deck: {
        userId,
      },
      OR: [{ nextReviewAt: null }, { nextReviewAt: { lte: now } }],
    },
    orderBy: [
      { nextReviewAt: { sort: 'asc', nulls: 'first' } },
      { createdAt: 'asc' },
    ],
    take: 20,
    select: {
      id: true,
      front: true,
      back: true,
      deckId: true,
      createdAt: true,
      repetition: true,
      intervalDays: true,
      nextReviewAt: true,
    },
  });
};

module.exports = { getDueCards };
