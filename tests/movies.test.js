const request = require('supertest');
const app = require('../app'); // Adjust the path to your app

describe('GET /movies', () => {
   it('should return all movies', async () => {
      const res = await request(app).get('/movies');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array); // Assuming the response is an array of movies
   });
});
