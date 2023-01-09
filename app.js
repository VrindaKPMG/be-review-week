const express = require('express');
const app = express();
const {getTopics, getArticles, getArticleById, getArticleCommentById, postCommentByArticleId, patchArticleVote, getUsers, getTopic, deleteCommentByID} = require('./controllers/con-news')
const {handle404, handleOtherErrors, handle500} = require('./controllers/con-errors')
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getArticleCommentById)
app.post('/api/articles/:article_id/comments', postCommentByArticleId)
app.patch('/api/articles/:article_id', patchArticleVote)
app.get('/api/users', getUsers)
app.delete('/api/comments/:comment_id', deleteCommentByID)


//handles all incorrect path errors
app.all('*', handle404)

//handles any other errors
app.use(handleOtherErrors)

//handles anything not specifically handled
app.all('*', handle500)





module.exports = app;
