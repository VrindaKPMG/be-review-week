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
        .then(({body: {msg}}) => {
            expect(msg).toBe('Path not found :( Try again.')
        })
    })
})

describe('GET /api/topics', () => {
    test('200: brings all data on topics endpoint', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body : {topics}}) => {
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

    describe('GET /api/articles', () => {
        test('200: brings all data on topics endpoint', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body : {articles}}) => {
                expect(articles).toHaveLength(12)
                expect(articles).toBeSortedBy('created_at', { descending: true })   
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic : expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(String)
                        })
                    )
            })
              
            })
    
            })
})

describe('GET /api/articles/:article_id', () => {
    test('200: brings up matching article to the article_id', () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then((response) => {
            const article = response.body.article;
            expect(article).toMatchObject({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0
              })
            })

        })
        test('400: invalid article_id given', () => {
            return request(app)
            .get('/api/articles/pikachu')
            .expect(400)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('wrong request')
                })
    
        })
               
    })
    test('404: given article_id valid but does not exist', () => {
        return request(app)
        .get('/api/articles/15')
        .expect(404)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('not found')
            })

    })
           

describe('GET /api/articles/:article_id/comments', () => {
    test('200: gives you comment info based on article_id in path', () => {
        return request(app)
        .get('/api/articles/5/comments')
        .expect(200)
        .then(({body: {comments}}) => {
            expect(comments).toHaveLength(2)
            expect(comments).toBeSortedBy('created_at', { descending: true })  
            comments.forEach((comment) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        comment_id: expect.any(Number),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        body: expect.any(String)
                    })
                )
        })

        })
    })
    test('200: gives you empty array when no comment is there', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body: {comments}}) => {
            expect(comments).toHaveLength(0)
        })
    })
    test('400: invalid article_id given', () => {
        return request(app)
        .get('/api/articles/ditto/comments')
        .expect(400)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('wrong request')
            })
    })

    test('404: given potentially valid article_id but does not exist', () => {
        return request(app)
        .get('/api/articles/666/comments')
        .expect(404)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('not found')
            })
    })
})






