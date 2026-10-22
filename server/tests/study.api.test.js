const assert = require('node:assert/strict');
const { test } = require('node:test');

const {
  calls,
  fakeDueCards,
  request,
  setStudyServiceError,
} = require('./apiTestSetup');

test('study API returns due cards and their count', async () => {
  setStudyServiceError(null);

  assert.deepEqual(await request('GET', '/api/study/due?userId=user-1'), {
    status: 200,
    body: {
      count: fakeDueCards.length,
      cards: fakeDueCards,
    },
  });
  assert.deepEqual(calls.at(-1), ['getDueCards', 'user-1']);
});

test('study API rejects a missing or blank userId', async () => {
  const previousCalls = calls.length;

  for (const userId of [undefined, '', '   ']) {
    const path =
      userId === undefined
        ? '/api/study/due'
        : `/api/study/due?userId=${encodeURIComponent(userId)}`;

    assert.deepEqual(await request('GET', path), {
      status: 400,
      body: { message: 'userId query parameter is required' },
    });
  }

  assert.equal(calls.length, previousCalls);
});

test('study API handles unexpected service errors', async () => {
  setStudyServiceError(new Error('Database connection failed'));

  try {
    assert.deepEqual(await request('GET', '/api/study/due?userId=user-1'), {
      status: 500,
      body: { message: 'Internal server error' },
    });
  } finally {
    setStudyServiceError(null);
  }
});

test('unknown routes return a JSON 404 response', async () => {
  assert.deepEqual(await request('GET', '/api/unknown'), {
    status: 404,
    body: { message: 'Route not found' },
  });
});
