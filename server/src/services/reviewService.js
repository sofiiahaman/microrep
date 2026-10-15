const prisma = require('../../lib/prisma');
const { calculateSm2 } = require('../../lib/sm2');

const VALID_RATINGS = ['AGAIN', 'HARD', 'GOOD', 'EASY'];

const createReview = async (cardId, userId, rating) => {
  if (!cardId || !userId) {
    const error = new Error('cardId and userId are required');
    error.status = 400;
    throw error;
  }

  if (!VALID_RATINGS.includes(rating)) {
    const error = new Error('Invalid review rating');
    error.status = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const card = await tx.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        repetition: true,
        intervalDays: true,
        easeFactor: true,
      },
    });

    if (!card) {
      const error = new Error('Card not found');
      error.status = 404;
      throw error;
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const reviewedAt = new Date();

    const schedule = calculateSm2(card, rating, reviewedAt);

    const review = await tx.review.create({
      data: {
        cardId,
        userId,
        rating,
        reviewedAt,
      },
    });

    const updatedCard = await tx.card.update({
      where: { id: cardId },
      data: {
        repetition: schedule.repetition,
        intervalDays: schedule.intervalDays,
        easeFactor: schedule.easeFactor,
        nextReviewAt: schedule.nextReviewAt,
      },
    });

    return {
      review,
      card: updatedCard,
    };
  });
};

module.exports = { createReview };
