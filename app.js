const express = require('express');
const app = express();
const {getTopics} = require('./controllers/con-topics')


app.get('/api/topics', getTopics);



//handles all incorrect path errors
app.all('*', (req, res, next) => {
    res.status(404).send({message: 'Path not found :( Try again.'})
});




module.exports = app;

