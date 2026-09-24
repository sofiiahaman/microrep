const express = require('express');
require('dotenv/config');

const prisma = require('./lib/prisma');

const app = express();
const PORT = Number(process.env.PORT) || 5001;

app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.send('Hello, MicroRep server!');
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
