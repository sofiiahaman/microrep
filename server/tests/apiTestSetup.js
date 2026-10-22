const cardService = require('../src/services/cardService');
const deckCardService = require('../src/services/deckCardService');
const deckService = require('../src/services/deckService');
const reviewService = require('../src/services/reviewService');
const studyService = require('../src/services/studyService');

const calls = [];
const serviceErrors = {};

const fakeDeck = { id: 'deck-1', name: 'Spanish', userId: 'user-1' };
const fakeCard = {
  id: 'card-1',
  front: 'Hola',
  back: 'Hello',
  deckId: 'deck-1',
};

const fakeReview = {
  id: 'review-1',
  cardId: 'card-1',
  userId: 'user-1',
  rating: 'GOOD',
  reviewedAt: '2026-10-15T08:00:00.000Z',
};

const fakeReviewedCard = {
  ...fakeCard,
  repetition: 1,
  intervalDays: 1,
  easeFactor: 2.5,
  nextReviewAt: '2026-10-16T08:00:00.000Z',
};

const fakeDueCards = [
  {
    ...fakeCard,
    createdAt: '2026-10-15T08:00:00.000Z',
    repetition: 0,
    intervalDays: 0,
    nextReviewAt: null,
  },
];

let reviewServiceError = null;
let studyServiceError = null;

deckService.getDecks = async () => {
  calls.push(['getDecks']);
  return [fakeDeck];
};

deckService.getDeckById = async (id) => {
  calls.push(['getDeckById', id]);
  return id === fakeDeck.id ? fakeDeck : null;
};

deckService.postDeck = async (data) => {
  calls.push(['postDeck', data]);
  return { id: 'deck-2', ...data };
};

deckService.patchDeck = async (id, data) => {
  calls.push(['patchDeck', id, data]);

  if (serviceErrors.patchDeck) {
    throw serviceErrors.patchDeck;
  }

  return { ...fakeDeck, ...data };
};

deckService.deleteDeck = async (id) => {
  calls.push(['deleteDeck', id]);

  if (serviceErrors.deleteDeck) {
    throw serviceErrors.deleteDeck;
  }
};

cardService.getCardById = async (id) => {
  calls.push(['getCardById', id]);
  return id === fakeCard.id ? fakeCard : null;
};

cardService.patchCard = async (id, data) => {
  calls.push(['patchCard', id, data]);
  return { ...fakeCard, ...data, id };
};

cardService.deleteCard = async (id) => {
  calls.push(['deleteCard', id]);
};

deckCardService.getDeckCards = async (deckId) => {
  calls.push(['getDeckCards', deckId]);
  if (deckId !== fakeDeck.id) {
    const error = new Error('Deck not found');
    error.status = 404;
    throw error;
  }
  return [fakeCard];
};

deckCardService.postDeckCard = async (deckId, data) => {
  calls.push(['postDeckCard', deckId, data]);
  return { ...fakeCard, ...data, deckId };
};

reviewService.createReview = async (cardId, userId, rating) => {
  calls.push(['createReview', cardId, userId, rating]);

  if (reviewServiceError) {
    throw reviewServiceError;
  }

  return {
    review: fakeReview,
    card: fakeReviewedCard,
  };
};

studyService.getDueCards = async (userId) => {
  calls.push(['getDueCards', userId]);

  if (studyServiceError) {
    throw studyServiceError;
  }

  return fakeDueCards;
};

const app = require('../src/app');
const server = app.listen(0);
server.unref();
const baseUrl = `http://127.0.0.1:${server.address().port}`;

const request = async (method, path, body) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body === undefined ? {} : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let parsedBody;

  try {
    parsedBody = text ? JSON.parse(text) : undefined;
  } catch {
    parsedBody = text;
  }

  return {
    status: response.status,
    body: parsedBody,
  };
};

module.exports = {
  calls,
  fakeCard,
  fakeDeck,
  fakeDueCards,
  fakeReview,
  fakeReviewedCard,
  request,
  serviceErrors,
  setReviewServiceError(error) {
    reviewServiceError = error;
  },
  setStudyServiceError(error) {
    studyServiceError = error;
  },
};
