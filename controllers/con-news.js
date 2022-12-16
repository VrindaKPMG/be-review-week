const articles = require("../db/data/test-data/articles");
const { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId, addComment, incrementArticleVote, selectUsers } = require("../models/model-news");
const {checkArticleId} = require('../models/check-article-id');
const {checkTopic} = require('../models/check-topic')


exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticles = (req, res, next) => {
    const topic = req.query.topic
    const sort_by = req.query.sort_by
    const order_by = req.query.order_by
    Promise.all([checkTopic(topic),
        selectArticles(topic, sort_by, order_by),])
    .then(([topic_exists, articles]) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
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

exports.postCommentByArticleId = (req, res, next) => {
    const article_id = req.params.article_id
    const newComment = req.body
    addComment(article_id, newComment).then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleVote = (req,res,next) => {
    const article_id = req.params.article_id;
    const articleUpdate = req.body
    incrementArticleVote(article_id, articleUpdate).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })
}

