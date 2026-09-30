const test = require('node:test');
const assert = require('node:assert/strict');

const { calculateSm2, RATING_QUALITY, MIN_EASE_FACTOR } = require('./sm2');

const reviewedAt = new Date('2026-09-30T10:00:00.000Z');

const newCard = () => ({
  repetition: 0,
  intervalDays: 0,
  easeFactor: 2.5,
});

const assertEaseFactor = (actual, expected) => {
  assert.ok(Math.abs(actual - expected) < 1e-10);
};

test('new card with GOOD starts with a 1-day interval', () => {
  const result = calculateSm2(newCard(), 'GOOD', reviewedAt);

  assert.equal(result.repetition, 1);
  assert.equal(result.intervalDays, 1);
  assertEaseFactor(result.easeFactor, 2.5);
  assert.equal(result.nextReviewAt.toISOString(), '2026-10-01T10:00:00.000Z');
});

test('second successful review uses a 6-day interval', () => {
  const result = calculateSm2(
    {
      repetition: 1,
      intervalDays: 1,
      easeFactor: 2.5,
    },
    'GOOD',
    reviewedAt
  );

  assert.equal(result.repetition, 2);
  assert.equal(result.intervalDays, 6);
  assertEaseFactor(result.easeFactor, 2.5);
  assert.equal(result.nextReviewAt.toISOString(), '2026-10-06T10:00:00.000Z');
});

test('third successful review calculates interval using ease factor', () => {
  const result = calculateSm2(
    {
      repetition: 2,
      intervalDays: 6,
      easeFactor: 2.5,
    },
    'GOOD',
    reviewedAt
  );

  assert.equal(result.repetition, 3);
  assert.equal(result.intervalDays, 15);
  assertEaseFactor(result.easeFactor, 2.5);
  assert.equal(result.nextReviewAt.toISOString(), '2026-10-15T10:00:00.000Z');
});

test('AGAIN resets the repetition sequence', () => {
  const result = calculateSm2(
    {
      repetition: 5,
      intervalDays: 20,
      easeFactor: 2.5,
    },
    'AGAIN',
    reviewedAt
  );

  assert.equal(result.repetition, 0);
  assert.equal(result.intervalDays, 1);
  assertEaseFactor(result.easeFactor, 1.7);
  assert.equal(result.nextReviewAt.toISOString(), '2026-10-01T10:00:00.000Z');
});

test('HARD keeps the repetition and schedules the next interval', () => {
  const result = calculateSm2(
    {
      repetition: 2,
      intervalDays: 6,
      easeFactor: 2.5,
    },
    'HARD',
    reviewedAt
  );

  assert.equal(result.repetition, 3);
  assert.equal(result.intervalDays, 14);
  assertEaseFactor(result.easeFactor, 2.36);
  assert.equal(result.nextReviewAt.toISOString(), '2026-10-14T10:00:00.000Z');
});

test('EASY increases the ease factor and interval', () => {
  const result = calculateSm2(
    {
      repetition: 2,
      intervalDays: 6,
      easeFactor: 2.5,
    },
    'EASY',
    reviewedAt
  );

  assert.equal(result.repetition, 3);
  assertEaseFactor(result.easeFactor, 2.6);
  assert.equal(result.intervalDays, 16);
  assert.equal(result.nextReviewAt.toISOString(), '2026-10-16T10:00:00.000Z');
});

test('ease factor never goes below the minimum', () => {
  const result = calculateSm2(
    {
      repetition: 5,
      intervalDays: 20,
      easeFactor: 1.3,
    },
    'AGAIN',
    reviewedAt
  );

  assertEaseFactor(result.easeFactor, MIN_EASE_FACTOR);
  assert.equal(result.repetition, 0);
  assert.equal(result.intervalDays, 1);
  assert.equal(result.nextReviewAt.toISOString(), '2026-10-01T10:00:00.000Z');
});

test('unsupported rating throws an error', () => {
  assert.throws(
    () =>
      calculateSm2(
        {
          repetition: 0,
          intervalDays: 0,
          easeFactor: 2.5,
        },
        'INVALID',
        reviewedAt
      ),
    {
      message: 'Unsupported review rating: INVALID',
    }
  );
});

test('review ratings map to the expected SM-2 quality values', () => {
  assert.equal(RATING_QUALITY.AGAIN, 0);
  assert.equal(RATING_QUALITY.HARD, 3);
  assert.equal(RATING_QUALITY.GOOD, 4);
  assert.equal(RATING_QUALITY.EASY, 5);
});
