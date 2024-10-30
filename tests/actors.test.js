const request = require('supertest');
const app = require('../app'); // Adjust the path to your app

describe('GET /actors', () => {

  it('should return all actors', async () => {
    const res = await request(app).get('/actors');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array); // Assuming the response is an array of actors
  
  });


});






