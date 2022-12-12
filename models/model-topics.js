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
