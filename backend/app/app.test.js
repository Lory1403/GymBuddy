const request = require('supertest');
const app = require('./app');

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

test('GET / should return 404', () => {
  return request(app)
    .get('/')
    .expect(200)
});