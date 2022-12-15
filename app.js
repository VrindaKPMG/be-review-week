const express = require('express');
const app = express();
const {getTopics, getArticles, getArticleById, getArticleCommentById, postCommentByArticleId} = require('./controllers/con-topics')
const {handle404, handleOtherErrors, handle500} = require('./controllers/con-errors')

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getArticleCommentById)
app.post('/api/articles/:article_id/comments', postCommentByArticleId)

//handles all incorrect path errors
app.all('*', handle404)

//handles any other errors
app.use(handleOtherErrors)

//handles anything not specifically handled
app.all('*', handle500)





module.exports = app;
