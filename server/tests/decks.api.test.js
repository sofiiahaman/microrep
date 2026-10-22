const assert = require('node:assert/strict');
const { test, describe } = require('node:test');

const {
  calls,
  fakeCard,
  fakeDeck,
  request,
  serviceErrors,
} = require('./apiTestSetup');

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
  assert.equal((await request('GET', '/api/decks/missing/cards')).status, 404);
});

test('PATCH /api/decks/:id updates valid fields', async () => {
  assert.deepEqual(
    await request('PATCH', '/api/decks/deck-1', {
      name: '  Updated deck  ',
    }),
    {
      status: 200,
      body: { ...fakeDeck, name: 'Updated deck' },
    }
  );
  assert.deepEqual(calls.at(-1), [
    'patchDeck',
    'deck-1',
    { name: 'Updated deck' },
  ]);
});

describe('PATCH /api/decks/:id validation', () => {
  test('should update only the name', async () => {
    const response = await request('PATCH', '/api/decks/deck-1', {
      name: '  Updated deck  ',
    });

    assert.equal(response.status, 200);
    assert.deepEqual(calls.at(-1), [
      'patchDeck',
      'deck-1',
      { name: 'Updated deck' },
    ]);
  });

  test('should update only the description', async () => {
    const response = await request('PATCH', '/api/decks/deck-1', {
      description: 'New description',
    });

    assert.equal(response.status, 200);
    assert.deepEqual(calls.at(-1), [
      'patchDeck',
      'deck-1',
      { description: 'New description' },
    ]);
  });

  test('should allow clearing the description with null', async () => {
    const response = await request('PATCH', '/api/decks/deck-1', {
      description: null,
    });

    assert.equal(response.status, 200);
    assert.deepEqual(calls.at(-1), [
      'patchDeck',
      'deck-1',
      { description: null },
    ]);
  });

  test('should reject an empty PATCH body', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/decks/deck-1', {});

    assert.equal(response.status, 400);
    assert.equal(calls.length, callsBefore);
  });

  test('should reject an empty name', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/decks/deck-1', {
      name: '   ',
    });

    assert.equal(response.status, 400);
    assert.equal(calls.length, callsBefore);
  });

  test('should reject a non-string name', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/decks/deck-1', {
      name: 123,
    });

    assert.equal(response.status, 400);
    assert.equal(calls.length, callsBefore);
  });

  test('should reject a non-string description', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/decks/deck-1', {
      description: 123,
    });

    assert.equal(response.status, 400);
    assert.equal(calls.length, callsBefore);
  });

  test('should reject unknown fields', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/decks/deck-1', {
      name: 'Updated deck',
      userId: 'another-user',
    });

    assert.equal(response.status, 400);
    assert.equal(calls.length, callsBefore);
  });
});

describe('Prisma P2025 handling', () => {
  test('PATCH deck should return 404 for P2025', async () => {
    serviceErrors.patchDeck = Object.assign(new Error('Record not found'), {
      code: 'P2025',
    });

    try {
      const response = await request('PATCH', '/api/decks/deck-1', {
        name: 'Updated deck',
      });

      assert.equal(response.status, 404);
      assert.deepEqual(response.body, {
        message: 'Resource not found',
      });
    } finally {
      delete serviceErrors.patchDeck;
    }
  });

  test('DELETE deck should return 404 for P2025', async () => {
    serviceErrors.deleteDeck = Object.assign(new Error('Record not found'), {
      code: 'P2025',
    });

    try {
      const response = await request('DELETE', '/api/decks/deck-1');

      assert.equal(response.status, 404);
      assert.deepEqual(response.body, {
        message: 'Resource not found',
      });
    } finally {
      delete serviceErrors.deleteDeck;
    }
  });
});
