const { selectTopics, selectArticles } = require("../models/model-topics");

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
}
