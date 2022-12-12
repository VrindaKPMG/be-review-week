const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const request = require('supertest');


afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('testing error for any incorrect path', () => {
    test('GET /apo', () => {
        return request(app)
        .get('/apo')
        .expect(404)
        .then(({body: {message}}) => {
            expect(message).toBe('Path not found :( Try again.')
        })
    })
})

describe('GET /api/topics', () => {
    test('200: brings all data on topics endpoint', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body : {topics}}) => {
            expect(topics).toBeInstanceOf(Array)
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                )
            })
               
        })

        })
    })




