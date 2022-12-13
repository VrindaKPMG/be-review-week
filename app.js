const express = require('express');
const app = express();
const {getTopics, getArticles, getArticleById} = require('./controllers/con-topics')


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)

//handles 400 errors (breaks sql rules so cannot exist)
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg : 'wrong request'})
    }
    else {
        next(err)
    }
})

//handles 404 not found errors (path does not break sql rules but does not currently exist)
app.use((err, req, res, next) => {
    if (err.msg !== undefined) {
        res.status(404).send({msg: err.msg});
    }
    else {
        next(err);
    }
})

//handles all incorrect path errors
app.all('*', (req, res, next) => {
    res.status(404).send({msg: 'Path not found :( Try again.'})
});


module.exports = app;

