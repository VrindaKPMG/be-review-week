const db = require('../db/connection');

exports.checkTopic = (topic) => {
    if (!topic) return Promise.resolve(true)
    else {
        return db.query(`
        SELECT * FROM topics
        WHERE slug = $1`, [topic])
        .then(({rowCount}) => {
            if (rowCount === 0) {
                return Promise.reject({status:404, msg: 'not found'})
            }
            else {
                return true
            }
        })
    }
}