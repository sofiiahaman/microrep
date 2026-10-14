const assert = require('node:assert/strict');
const test = require('node:test');

const cardService = require('./services/cardService');
const deckCardService = require('./services/deckCardService');
const deckService = require('./services/deckService');

const calls = [];

const fakeDeck = { id: 'deck-1', name: 'Spanish', userId: 'user-1' };
const fakeCard = {
  id: 'card-1',
  front: 'Hola',
  back: 'Hello',
  deckId: 'deck-1',
};

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
  return { ...fakeDeck, ...data, id };
};
deckService.deleteDeck = async (id) => {
  calls.push(['deleteDeck', id]);
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

const app = require('./app');
let server;
let baseUrl;

test.before(async () => {
  server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

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

test('deck API lists decks and gets a deck by id', async () => {
  assert.deepEqual(await request('GET', '/api/decks'), {
    status: 200,
    body: [fakeDeck],
  });
  assert.deepEqual(await request('GET', '/api/decks/deck-1'), {
    status: 200,
    body: fakeDeck,
  });
});

test('deck API validates, creates, updates, and deletes decks', async () => {
  assert.deepEqual(await request('POST', '/api/decks', { name: 'Spanish' }), {
    status: 400,
    body: { message: 'Name and userId are required' },
  });

  assert.deepEqual(
    await request('POST', '/api/decks', {
      name: 'Spanish',
      description: 'Basics',
      userId: 'user-1',
    }),
    {
      status: 201,
      body: {
        id: 'deck-2',
        name: 'Spanish',
        description: 'Basics',
        userId: 'user-1',
      },
    }
  );
  assert.deepEqual(
    await request('PATCH', '/api/decks/deck-1', { name: 'German' }),
    {
      status: 200,
      body: { ...fakeDeck, name: 'German' },
    }
  );
  assert.deepEqual(await request('DELETE', '/api/decks/deck-1'), {
    status: 204,
    body: undefined,
  });
});

test('deck API returns 404 when a deck does not exist', async () => {
  assert.deepEqual(await request('GET', '/api/decks/missing'), {
    status: 404,
    body: { message: 'Deck not found' },
  });
});

test('deckCard API lists cards and creates a trimmed card', async () => {
  assert.deepEqual(await request('GET', '/api/decks/deck-1/cards'), {
    status: 200,
    body: [fakeCard],
  });
  assert.deepEqual(
    await request('POST', '/api/decks/deck-1/cards', {
      front: '  Bonjour  ',
      back: '  Hello  ',
    }),
    {
      status: 201,
      body: { ...fakeCard, front: 'Bonjour', back: 'Hello' },
    }
  );
});

test('deckCard API rejects missing or blank card fields', async () => {
  for (const body of [
    {},
    { front: 'Front' },
    { back: 'Back' },
    { front: '   ', back: 'Back' },
    { front: 'Front', back: 42 },
  ]) {
    assert.deepEqual(await request('POST', '/api/decks/deck-1/cards', body), {
      status: 400,
      body: { message: 'Front and back must be non-empty strings' },
    });
  }
});

test('deckCard API returns an error when the deck does not exist', async () => {
  assert.equal(
    (await request('GET', '/api/decks/missing/cards')).status,
    404
  );
});

test('card API gets, updates, and deletes cards', async () => {
  assert.deepEqual(await request('GET', '/api/cards/card-1'), {
    status: 200,
    body: fakeCard,
  });
  assert.deepEqual(
    await request('PATCH', '/api/cards/card-1', { back: 'Hi' }),
    {
      status: 200,
      body: { ...fakeCard, back: 'Hi' },
    }
  );
  assert.deepEqual(await request('DELETE', '/api/cards/card-1'), {
    status: 204,
    body: undefined,
  });
});

test('card API validates patch requests and returns 404 for missing cards', async () => {
  assert.deepEqual(await request('PATCH', '/api/cards/card-1', {}), {
    status: 400,
    body: { message: 'At least one field (front or back) is required' },
  });
  assert.deepEqual(await request('GET', '/api/cards/missing'), {
    status: 404,
    body: { message: 'Card not found' },
  });
});
