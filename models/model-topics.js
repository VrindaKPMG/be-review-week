const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then(({rows})=> {
        return rows; 
    })
    
}

exports.selectArticles = () => {
    return db.query(`SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(*) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.author, title, articles.article_id
    ORDER BY created_at DESC`).then(({rows})=>{
        return rows
    })

}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id]).then((results) => {
        if (results.rowCount === 0) {
            return Promise.reject({status: 404, msg : 'not found'});
        }
        else {
            return results.rows[0]
        }
        
    })
}

exports.selectCommentsByArticleId= (article_id) => {
    return db.query(`SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id]).then((results) => {
        return results.rows
    })
}

exports.addComment = (article_id, newComment) => {
    const {username, body} = newComment
    return db.query(`
    INSERT INTO comments (author, body, article_id)
    VALUES( $1, $2, $3)
    RETURNING *`, [username, body, article_id])
    .then((results) => { 
        if (results.rowCount === 0) {
            return Promise.reject({status: 404, msg : 'not found'});
        }
        else {
            return results.rows[0]}
        })
        
}

exports.incrementArticleVote = (article_id, articleUpdate) => {
    const { inc_votes } = articleUpdate
    return db.query(`
    UPDATE articles
    SET votes = votes+$1
    WHERE article_id = $2
    RETURNING *`, [inc_votes, article_id])
    .then((results) => {
        if (results.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'not found'});
        }
        return results.rows[0]
    })
}

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`).then((results) => {
        return results.rows
    })
}
