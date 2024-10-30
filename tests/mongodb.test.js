const { initDb, getDb } = require('../db/connect.js'); // Adjust the path to your db module
const dotenv = require('dotenv');

dotenv.config();

describe('MongoDB Connection Test', () => {
  it('should connect to MongoDB', (done) => {
    initDb((err, db) => {
      if (err) {
        done(err);
      } else {
        expect(db).toBeDefined();
        expect(() => getDb()).not.toThrow();
        done();
      }
    });
  });
});
