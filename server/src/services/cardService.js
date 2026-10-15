const prisma = require('../../lib/prisma');

const getCardById = async (id) => {
  return await prisma.card.findUnique({
    where: {
      id: id,
    },
  });
};

const deleteCard = async (id) => {
  return await prisma.card.delete({
    where: {
      id,
    },
  });
};

const patchCard = async (id, data) => {
  return await prisma.card.update({
    where: {
      id,
    },
    data,
  });
};

module.exports = { getCardById, patchCard, deleteCard };
