const articles = require("../db/data/test-data/articles");
const { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId } = require("../models/model-topics");

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
        //res.status(400).send({msg : 'wrong request'});
        next(err)
    })
    
}

exports.getArticleCommentById = (req, res, next) => {
    const article_id = req.params.article_id;
    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({comments})
    })
}
