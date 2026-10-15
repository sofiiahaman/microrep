const prisma = require('../../lib/prisma');

const getDecks = async () => {
  return await prisma.deck.findMany();
};

const getDeckById = async (id) => {
  return await prisma.deck.findUnique({
    where: {
      id: id,
    },
  });
};

const postDeck = async ({ name, description, userId }) => {
  return await prisma.deck.create({
    data: {
      name,
      description,
      userId,
    },
  });
};

const patchDeck = async (id, data) => {
  return await prisma.deck.update({
    where: {
      id,
    },
    data,
  });
};

const deleteDeck = async (id) => {
  return await prisma.deck.delete({
    where: {
      id,
    },
  });
};

module.exports = { getDecks, getDeckById, postDeck, patchDeck, deleteDeck };
