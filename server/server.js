require('dotenv/config');

const app = require('./src/app');
const prisma = require('./lib/prisma');

const PORT = Number(process.env.PORT) || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const shutdown = async () => {
  console.log('Closing HTTP server and disconnecting Prisma...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed successfully.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
