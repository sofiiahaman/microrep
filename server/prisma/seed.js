const prisma = require('../lib/prisma.js');

async function main() {
  try {
    // =========================
    // Users
    // =========================

    const user1 = await prisma.user.upsert({
      where: {
        email: 'test@microrep.local',
      },

      update: {},

      create: {
        email: 'test@microrep.local',
        passwordHash: 'test_hashed_password',
        name: 'Test User',
      },
    });

    const user2 = await prisma.user.upsert({
      where: {
        email: 'student@microrep.local',
      },

      update: {},

      create: {
        email: 'student@microrep.local',
        passwordHash: 'student_hashed_password',
        name: 'Student User',
      },
    });

    // =========================
    // Decks for Test User
    // =========================

    await prisma.deck.upsert({
      where: {
        id: '00000000-0000-0000-0000-000000000001',
      },

      update: {},

      create: {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'JavaScript Basics',
        description: 'Basic JavaScript concepts and syntax',
        userId: user1.id,
      },
    });

    await prisma.deck.upsert({
      where: {
        id: '00000000-0000-0000-0000-000000000002',
      },

      update: {},

      create: {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'Node.js',
        description: 'Node.js and Express fundamentals',
        userId: user1.id,
      },
    });

    await prisma.deck.upsert({
      where: {
        id: '00000000-0000-0000-0000-000000000003',
      },

      update: {},

      create: {
        id: '00000000-0000-0000-0000-000000000003',
        name: 'Software Engineering',
        description: 'Software engineering concepts and practices',
        userId: user1.id,
      },
    });

    // =========================
    // Decks for Student User
    // =========================

    await prisma.deck.upsert({
      where: {
        id: '00000000-0000-0000-0000-000000000004',
      },

      update: {},

      create: {
        id: '00000000-0000-0000-0000-000000000004',
        name: 'English Vocabulary',
        description: 'English words and useful expressions',
        userId: user2.id,
      },
    });

    await prisma.deck.upsert({
      where: {
        id: '00000000-0000-0000-0000-000000000005',
      },

      update: {},

      create: {
        id: '00000000-0000-0000-0000-000000000005',
        name: 'Database Basics',
        description: 'SQL, PostgreSQL and database concepts',
        userId: user2.id,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Seed data created successfully.');
  })
  .catch((error) => {
    console.error('Seed failed:', error);
  });
