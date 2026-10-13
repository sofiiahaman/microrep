const express = require('express');
const app = express();

const deckRoutes = require('./routes/deckRoutes');
const deckCardRoutes = require('./routes/deckCardRoutes');
const cardRoutes = require('./routes/cardRoutes');

app.disable('x-powered-by');

app.use(express.json());

app.use('/api/decks', deckRoutes);
app.use('/api/decks/:deckId/cards', deckCardRoutes);
app.use('/api/cards', cardRoutes);

app.get('/', (req, res) => {
  res.send('Hello, MicroRep server!');
});

module.exports = app;
