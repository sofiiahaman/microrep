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

  const status = Number.isInteger(error.status) ? error.status : 500;
  const safeStatus = status >= 400 && status < 600 ? status : 500;

  res.status(safeStatus).json({
    message: safeStatus === 500 ? 'Internal server error' : error.message,
  });
});

module.exports = app;
