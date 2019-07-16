require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Meme = require('../lib/models/Meme');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a new meme', () => {
    return request(app)
      .post('/api/v1/memes')
      .send({ top: 'I live, I die', image: './assets/philosoraptor.jpg', bottom: 'I live again' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          top: 'I live, I die',
          image: './assets/philosoraptor.jpg',
          bottom: 'I live again',
          __v: 0
        });
      });
  });

  it('gets a list of all habits', async() => {
    const meme = await Meme.create({ image: 'image' });

    return request(app)
      .get('/api/v1/memes')
      .then(res => {
        const memeJSON = JSON.parse(JSON.stringify(meme));
        expect(res.body).toEqual([memeJSON]);
      });
  });

  it('gets a habit by id', async() => {
    const meme = await Meme.create({ image: 'image' });

    return request(app)
      .get(`/api/v1/memes/${meme._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          image: 'image',
          __v: 0
        });
      });
  });

  it('can update the image of a meme', async() => {
    const meme = await Meme.create({ image: 'image' });

    return request(app)
      .patch(`/api/v1/memes/${meme._id}`)
      .send({ top: 'ahhhh' })
      .then(res => {
        expect(res.body.top).toEqual("ahhhh");
      });
  });

  it('deletes a meme', async() => {
    const meme = await Meme.create({ image: 'image' });

    return request(app)
      .delete(`/api/v1/memes/${meme._id}`)
      .then(res => {
        expect(res.body.image).toEqual('image');
      });
  });
});
