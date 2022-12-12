const { selectTopic } = require("../models/model-topics");

exports.getTopics = (req, res, next) => {
    selectTopic().then((topics) => {
        res.status(200).send({topics})
    })
}

