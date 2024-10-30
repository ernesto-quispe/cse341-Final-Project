const request = require('supertest');
const app = require('../app'); // Adjust the path to your app

describe('GET /reviews', () => {
  it('should return all reviews', async () => {
    const res = await request(app).get('/reviews');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array); // Assuming the response is an array of actors
  });
});