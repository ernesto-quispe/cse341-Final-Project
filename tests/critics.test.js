const request = require('supertest');
const app = require('../app'); // Adjust the path to your app

describe('GET /critics', () => {
  it('should return all critics', async () => {
    const res = await request(app).get('/critics');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array); // Assuming the response is an array of actors
  });
});