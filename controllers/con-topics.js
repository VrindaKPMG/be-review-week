const { selectTopic, selectArticle } = require("../models/model-topics");

exports.getTopics = (req, res, next) => {
    selectTopic().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticles = (req, res, next) => {
    selectArticle().then((articles) => {
        res.status(200).send({articles})
    })
}
