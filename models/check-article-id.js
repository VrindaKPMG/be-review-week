const db = require('../db/connection');

exports.checkArticleId = (article_id) => {
    if (!article_id) return Promise.resolve(true)
    else {
        return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1`, [article_id])
        .then(({rowCount}) => {
            if (rowCount == 0) {
                return Promise.reject({status:404, msg: 'not found'})
    
            }
            else {
                return true
            }
        })
    }
    
}