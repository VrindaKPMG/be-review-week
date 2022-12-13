const articles = require("../db/data/test-data/articles");
const { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId } = require("../models/model-topics");
const {checkArticleId} = require('../models/check-article-id')


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

exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id;
    selectArticleById(article_id).then((article) => {
       res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleCommentById = (req, res, next) => {
    const article_id = req.params.article_id;

    Promise.all([checkArticleId(article_id),
        selectCommentsByArticleId(article_id),])
    .then(([article_id_exists, comments]) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}
