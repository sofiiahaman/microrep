const prisma = require('../../lib/prisma');

const ensureDeckExists = async (deckId) => {
  const deck = await prisma.deck.findUnique({
    where: {
      id: deckId,
    },
    select: {
      id: true,
    },
  });

  if (!deck) {
    const error = new Error('Deck not found');
    error.status = 404;
    throw error;
  }
};

const getDeckCards = async (deckId) => {
  await ensureDeckExists(deckId);
  return prisma.card.findMany({
    where: {
      deckId,
    },
  });
};

const postDeckCard = async (deckId, data) => {
  await ensureDeckExists(deckId);
  return prisma.card.create({
    data: {
      ...data,
      deck: {
        connect: {
          id: deckId,
        },
      },
    },
  });
};

module.exports = { getDeckCards, postDeckCard };
