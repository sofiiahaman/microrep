const express = require('express');
const app = express();

const deckRoutes = require('./routes/deckRoutes');
const deckCardRoutes = require('./routes/deckCardRoutes');
const cardRoutes = require('./routes/cardRoutes');
const studyRoutes = require('./routes/studyRoutes');

app.disable('x-powered-by');

app.use(express.json());

app.use('/api/decks', deckRoutes);
app.use('/api/decks/:deckId/cards', deckCardRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/study', studyRoutes);

app.get('/', (req, res) => {
  res.send('Hello, MicroRep server!');
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const prismaStatusByCode = {
    P2025: 404,
    P2002: 409,
    P2003: 409,
  };

  let status = Number.isInteger(error.status) ? error.status : 500;
  let message = error.message;

  if (error.code && prismaStatusByCode[error.code]) {
    status = prismaStatusByCode[error.code];
  }

  if (error.name === 'PrismaClientValidationError') {
    status = 400;
    message = 'Invalid request data';
  }

  const safeStatus = status >= 400 && status < 600 ? status : 500;

  if (safeStatus === 500) {
    message = 'Internal server error';
  } else if (error.code === 'P2025') {
    message = 'Resource not found';
  } else if (error.code === 'P2002') {
    message = 'A resource with this value already exists';
  } else if (error.code === 'P2003') {
    message = 'The operation conflicts with related records';
  }

  return res.status(safeStatus).json({ message });
});

module.exports = app;
