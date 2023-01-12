const { ClientBase } = require('pg');
const { rows } = require('pg/lib/defaults');
const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then(({rows})=> {
        return rows; 
    })
    
}

exports.selectArticles = (topic, sort_by = 'created_at', order_by = 'DESC') => {
    const validOrderQuery = ['desc', 'asc', 'DESC', 'ASC']
    const validSortQuery = ['article_id', 'author', 'comment_count', 'created_at', 'title', 'topic', 'votes']

    if (!validOrderQuery.includes(order_by) || !validSortQuery.includes(sort_by)) {
        return Promise.reject({status: 400, msg : 'wrong request'})
    }

    let doINeedTopic = []

    let articleQuery = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id `

    if (topic !== undefined) {
        articleQuery += `WHERE topic = $1 `
        doINeedTopic.push(topic)
    }
    

    articleQuery += `GROUP BY articles.author, title, articles.article_id 
    ORDER BY ${sort_by} ${order_by};`
    return db.query(articleQuery, doINeedTopic).then(({rows})=>{
        console.log(rows, "model")
        return rows
    })
    

}

exports.selectArticleById = (article_id) => {
    let articleQuery = `SELECT articles.*, COUNT(*) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1 
        GROUP BY articles.author, title, articles.article_id; `
 

    return db.query(articleQuery, [article_id] ).then((results) => {
        if (results.rowCount === 0) {
            return Promise.reject({status: 404, msg : 'not found'});
        }
        else {
            return results.rows[0]
        }
        
    })
}

exports.selectCommentsByArticleId= (article_id) => {
    return db.query(`
    SELECT comment_id, votes, created_at, author, body 
    FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC;`, [article_id]).then((results) => {
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


exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id]).then((results) => {
        if (results.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'not found'})
        }
        return results.rows

    })
}