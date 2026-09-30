const MIN_EASE_FACTOR = 1.3;

const RATING_QUALITY = Object.freeze({
  AGAIN: 0,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
});

const addDays = (date, days) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const calculateSm2 = (
  { repetition, intervalDays, easeFactor },
  rating,
  reviewedAt = new Date()
) => {
  const quality = RATING_QUALITY[rating];

  if (quality === undefined) {
    throw new Error(`Unsupported review rating: ${rating}`);
  }

  const nextEaseFactor = Math.max(
    MIN_EASE_FACTOR,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  // Failed review: reset the repetition sequence.
  if (quality < 3) {
    return {
      repetition: 0,
      intervalDays: 1,
      easeFactor: nextEaseFactor,
      nextReviewAt: addDays(reviewedAt, 1),
    };
  }

  const nextRepetition = repetition + 1;

  let nextIntervalDays = 1;

  if (nextRepetition === 2) {
    nextIntervalDays = 6;
  } else if (nextRepetition > 2) {
    nextIntervalDays = Math.max(1, Math.round(intervalDays * nextEaseFactor));
  }

  return {
    repetition: nextRepetition,
    intervalDays: nextIntervalDays,
    easeFactor: nextEaseFactor,
    nextReviewAt: addDays(reviewedAt, nextIntervalDays),
  };
};

module.exports = {
  calculateSm2,
  RATING_QUALITY,
  MIN_EASE_FACTOR,
};
