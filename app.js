const express = require('express');
const app = express();
const {getTopics, getArticles, getArticleById, getArticleCommentById, postCommentByArticleId} = require('./controllers/con-topics')

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getArticleCommentById)
app.post('/api/articles/:article_id/comments', postCommentByArticleId)

//handles all incorrect path errors
app.all('*', (req, res, next) => {
    res.status(404).send({msg: 'Path not found :( Try again.'})
});


app.use((err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send({msg : 'wrong request'})
    }
    if (err.code === '23503') {
        res.status(404).send({msg : 'not found'})
    }
    if (err.msg && err.status) {
        res.status(err.status).send({msg: err.msg})
    }
})



//handles anything not specifically handled
app.all('*', (err, req, res, next) => {
    res.status(500).send({msg : 'something is wrong'})
});





module.exports = app;
