const assert = require('node:assert/strict');
const { test, describe } = require('node:test');

const { calls, fakeCard, request } = require('./apiTestSetup');

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

test('PATCH /api/cards/:id trims valid fields', async () => {
  const callsBefore = calls.length;

  const response = await request('PATCH', '/api/cards/card-1', {
    front: '  Bonjour  ',
    back: '  Hello  ',
  });

  assert.equal(response.status, 200);
  assert.equal(calls.length, callsBefore + 1);
  assert.deepEqual(calls.at(-1), [
    'patchCard',
    'card-1',
    { front: 'Bonjour', back: 'Hello' },
  ]);
});

test('PATCH /api/cards/:id rejects invalid fields', async () => {
  for (const body of [
    { front: '   ' },
    { front: 123 },
    { back: '   ' },
    { back: null },
    { front: 'Bonjour', back: '   ' },
  ]) {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/cards/card-1', body);

    assert.equal(response.status, 400);
    assert.equal(calls.length, callsBefore);
  }
});

describe('PATCH /api/cards/:id validation', () => {
  test('should update only the front field', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/cards/card-1', {
      front: '  Bonjour  ',
    });

    assert.equal(response.status, 200);
    assert.equal(calls.length, callsBefore + 1);
    assert.deepEqual(calls.at(-1), [
      'patchCard',
      'card-1',
      { front: 'Bonjour' },
    ]);
  });

  test('should update only the back field', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/cards/card-1', {
      back: '  Hello  ',
    });

    assert.equal(response.status, 200);
    assert.equal(calls.length, callsBefore + 1);
    assert.deepEqual(calls.at(-1), ['patchCard', 'card-1', { back: 'Hello' }]);
  });

  test('should update both front and back', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/cards/card-1', {
      front: '  Bonjour  ',
      back: '  Hello  ',
    });

    assert.equal(response.status, 200);
    assert.equal(calls.length, callsBefore + 1);
    assert.deepEqual(calls.at(-1), [
      'patchCard',
      'card-1',
      { front: 'Bonjour', back: 'Hello' },
    ]);
  });

  test('should reject an empty PATCH body', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/cards/card-1', {});

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: 'At least one field (front or back) is required',
    });
    assert.equal(calls.length, callsBefore);
  });

  test('should reject an empty front', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/cards/card-1', {
      front: '   ',
    });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: 'Front must be a non-empty string',
    });
    assert.equal(calls.length, callsBefore);
  });

  test('should reject a non-string front', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/cards/card-1', {
      front: 123,
    });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: 'Front must be a non-empty string',
    });
    assert.equal(calls.length, callsBefore);
  });

  test('should reject an empty back', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/cards/card-1', {
      back: '   ',
    });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: 'Back must be a non-empty string',
    });
    assert.equal(calls.length, callsBefore);
  });

  test('should reject a non-string back', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/cards/card-1', {
      back: null,
    });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: 'Back must be a non-empty string',
    });
    assert.equal(calls.length, callsBefore);
  });

  test('should reject the request if either field is invalid', async () => {
    const callsBefore = calls.length;
    const response = await request('PATCH', '/api/cards/card-1', {
      front: 'Bonjour',
      back: '   ',
    });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: 'Back must be a non-empty string',
    });
    assert.equal(calls.length, callsBefore);
  });
});
