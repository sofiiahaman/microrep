const express = require('express');
const app = express();

const deckRoutes = require('./routes/deckRoutes');

app.disable('x-powered-by');

app.use(express.json());

app.use('/api/decks', deckRoutes);

app.get('/', (req, res) => {
  res.send('Hello, MicroRep server!');
});

module.exports = app;
