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
        test('404: given article_id valid but does not exist', () => {
            return request(app)
            .get('/api/articles/15')
            .expect(404)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('not found')
                })
    
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

describe('POST /api/articles/:article_id/comments', () => {
    test('201: adds your comment for the specified article ', () => {
        const newComment = {
            username: 'rogersop',
            body: 'tldr'
        };
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            const myComment = body.comment
                expect(myComment).toMatchObject({
                    comment_id: 19,
                    author: 'rogersop',
                    body: 'tldr',
                    article_id: 2,
                    votes: 0,
                    created_at: expect.any(String)
                })
        })

    })
    test('400: article_id given breaks SQL rules', () => {
        const newComment = {
            username: 'rogersop',
            body: 'tldr'
        };
        return request(app)
        .post('/api/articles/spoink/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('wrong request')
            })

    })

    test('400: missing important essential key from POST object', () => {
        const newComment = {
            username: 'rogersop'
        };
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('wrong request')
            })

    })

    test('404: article_id given follows SQL rules but does not exist', () => {
        const newComment = {
            username: 'rogersop',
            body: 'tldr'
        };
        return request(app)
        .post('/api/articles/69/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('not found')
            })
    })
    test('404: username given does not actually exist', () => {
        const newComment = {
            username: 'vrinda',
            body: 'tldr'
        };
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('not found')
            })
    })
    test('201: adds your comment for the specified article even with extra keys ', () => {
        const newComment = {
            username: 'rogersop',
            body: 'tldr',
            extraKey: 'he he'
        };
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            const myComment = body.comment
                expect(myComment).toMatchObject({
                    comment_id: 19,
                    author: 'rogersop',
                    body: 'tldr',
                    article_id: 2,
                    votes: 0,
                    created_at: expect.any(String)
                })
        })

    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('200: will respond with updated vote count on article', () => {
        const articleUpdate = {"inc_votes": 7}
        return request(app)
        .patch('/api/articles/5')
        .send(articleUpdate)
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                article_id: 5,
                title: 'UNCOVERED: catspiracy to bring down democracy',
                topic: 'cats',
                author: 'rogersop',
                body: 'Bastet walks amongst us, and the cats are taking arms!',
                created_at: '2020-08-03T13:14:00.000Z',
                votes: 7
            })
        })
    })
    test('400: given an article_id which breaks sql rules', () => {
        const articleUpdate = {"inc_votes": 7}
        return request(app)
        .patch('/api/articles/bulbasaur')
        .send(articleUpdate)
        .expect(400)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('wrong request')
        })
    })
    test('400: given no inc_votes', () => {
        const articleUpdate = {}
        return request(app)
        .patch('/api/articles/5')
        .send(articleUpdate)
        .expect(400)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('wrong request')
        })
    })
    test('400: given inc_votes but it cannot be added as not integer', () => {
        const articleUpdate = {"inc_votes": "Machop"}
        return request(app)
        .patch('/api/articles/5')
        .send(articleUpdate)
        .expect(400)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('wrong request')
        })
    })
    test('404: given an article_id that follows sql rules but does not exist yet', () => {
        const articleUpdate = {"inc_votes": 7}
        return request(app)
        .patch('/api/articles/420')
        .send(articleUpdate)
        .expect(404)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('not found')
        })
    })
})




