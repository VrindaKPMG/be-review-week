const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const request = require('supertest');
const { response } = require('../app');



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

describe('GET /api/users', () => {
    test('200: brings up all data on users endpoint', () => {
        return request(app)
        .get('/api/users')  
        .expect(200)
        .then(({body : {users}}) => {
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                )
            })    
        })
    })
})

describe('GET /api/articles to query', () => {
    test('200: can add a topics query', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body : {articles}})=> {
            articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        comment_count: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                )
        })
            
       })
    })
    test('200: can add a sort_by query and order', () => {
        return request(app)
        .get('/api/articles?sort_by=title&order_by=ASC')
        .expect(200)
        .then(({body: {articles}})=> {
            console.log(articles, "in test")
            expect(articles).toBeSortedBy('title', {descending: false})
            articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        comment_count: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                )
        })
            
       })
    })
    test('200: order_by defaults to desc when not specified', () => {
        return request(app)
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then(({body: {articles}})=> {
            expect(articles).toHaveLength(12)
            expect(articles).toBeSortedBy('article_id', {descending: true})
            articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        comment_count: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                )
        })
            
       })
    })
    test('404: trying to query with a topic that is not yet a topic', () => {
        return request(app)
        .get('/api/articles?topic=spheal')
        .expect(404)
        .then((response)=> {
            const msg = response.body.msg;
            expect(msg).toBe('not found')
       })
    })
    test('400: trying to sort by with a column that is not in articles table should not work', () => {
        return request(app)
        .get('/api/articles?sort_by=hitmonlee')
        .expect(400)
        .then((response)=> {
            const msg = response.body.msg;
            expect(msg).toBe('wrong request')
       })
    })
    test('400: trying to order by with a column that is not desc/asc/DESC/ASC should not work', () => {
        return request(app)
        .get('/api/articles?order_by=amaura')
        .expect(400)
        .then((response)=> {
            const msg = response.body.msg;
            expect(msg).toBe('wrong request')
       })
    })
    test('200: topic does not come up with anything but is a valid topic ', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body : {articles}})=> {
            expect(articles).toHaveLength(0)
            articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        comment_count: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                )
        })
            
       })
    })

})

describe('GET /api/articles/:article_id comment_count as a query', () => {
    test('200: get the comment count is asking for it', () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({body: {article}}) => {
            expect(article).toMatchObject({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0, 
                comment_count: '2'
              })
        })
    })
})

describe('DELETE /api/comments/:comment_id', () => {
    test('204: should get no content', () => {
        return request(app)
        .delete('/api/comments/7')
        .expect(204)
        
       
     })

     test('400: invalid comment_id that breaks sql rules', () => {
        return request(app)
        .delete('/api/comments/cascoon')
        .expect(400)
        .then((response)=> {
            const msg = response.body.msg;
            expect(msg).toBe('wrong request')
       })

     })
     test('404: invalid comment_id because it does not exist yet', () => {
        return request(app)
        .delete('/api/comments/80085')
        .expect(404)
        .then((response)=> {
            const msg = response.body.msg;
            expect(msg).toBe('not found')
       })

     })
})

