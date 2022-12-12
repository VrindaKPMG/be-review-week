const express = require('express');
const app = express();
const {getTopics, getArticles} = require('./controllers/con-topics')


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles)



//handles all incorrect path errors
app.all('*', (req, res, next) => {
    res.status(404).send({msg: 'Path not found :( Try again.'})
});




module.exports = app;

