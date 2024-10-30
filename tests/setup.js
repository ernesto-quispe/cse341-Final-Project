require('dotenv').config({ path: '.env' });
const mongodb = require('../db/connect');

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    mongodb.initDb((err, db) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

// Ensure connections are closed after tests
afterAll(async () => {
  const db = mongodb.getDb();
  await db.close();
});