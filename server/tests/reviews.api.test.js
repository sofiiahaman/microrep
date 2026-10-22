const assert = require('node:assert/strict');
const { test } = require('node:test');

const {
  calls,
  fakeReview,
  fakeReviewedCard,
  request,
  setReviewServiceError,
} = require('./apiTestSetup');

test('review API creates a review and returns the updated card schedule', async () => {
  setReviewServiceError(null);

  const response = await request('POST', '/api/cards/card-1/reviews', {
    userId: 'user-1',
    rating: 'GOOD',
  });

  assert.deepEqual(response, {
    status: 201,
    body: {
      review: fakeReview,
      card: fakeReviewedCard,
    },
  });
  assert.deepEqual(calls.at(-1), ['createReview', 'card-1', 'user-1', 'GOOD']);
});

test('review API rejects invalid ratings', async () => {
  const previousCalls = calls.length;

  for (const rating of ['OK', 'good', '', null, 42]) {
    assert.deepEqual(
      await request('POST', '/api/cards/card-1/reviews', {
        userId: 'user-1',
        rating,
      }),
      {
        status: 400,
        body: {
          message: 'Rating must be one of: AGAIN, HARD, GOOD, EASY',
        },
      }
    );
  }

  assert.equal(calls.length, previousCalls);
});

test('review API rejects a missing userId', async () => {
  const previousCalls = calls.length;

  assert.deepEqual(
    await request('POST', '/api/cards/card-1/reviews', {
      rating: 'GOOD',
    }),
    {
      status: 400,
      body: { message: 'userId is required' },
    }
  );

  assert.equal(calls.length, previousCalls);
});

test('review API returns 404 when the service cannot find the card', async () => {
  setReviewServiceError(
    Object.assign(new Error('Card not found'), {
      status: 404,
    })
  );

  try {
    assert.deepEqual(
      await request('POST', '/api/cards/missing/reviews', {
        userId: 'user-1',
        rating: 'GOOD',
      }),
      {
        status: 404,
        body: { message: 'Card not found' },
      }
    );
  } finally {
    setReviewServiceError(null);
  }
});

test('review API handles unexpected service errors', async () => {
  setReviewServiceError(new Error('Database connection failed'));

  try {
    assert.deepEqual(
      await request('POST', '/api/cards/card-1/reviews', {
        userId: 'user-1',
        rating: 'GOOD',
      }),
      {
        status: 500,
        body: { message: 'Internal server error' },
      }
    );
  } finally {
    setReviewServiceError(null);
  }
});
