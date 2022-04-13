const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((response) => {
    return response.rows;
  });
};
exports.selectArticle = (articleId) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count 
      FROM articles 
      JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1 GROUP BY articles.article_id
      ;`,
      [articleId]
    )
    .then((response) => {
      return response.rows[0];
    });
};
exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((response) => {
    return response.rows;
  });
};
exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [articleId])
    .then((response) => {
      return response.rows;
    });
};
exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
  FROM articles
  JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`
    )
    .then((response) => {
      return response.rows;
    });
};
exports.removeComment = (commentId) => {
  return db
    .query(`DELETE from comments WHERE comment_id = $1 RETURNING *;`, [
      commentId,
    ])
    .then((res) => {
      return res.rows[0];
    });
};
exports.addCommentByArticleId = (articleId, author, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body)
  VALUES ($1, $2, $3) RETURNING *;`,
      [articleId, author, body]
    )
    .then((res) => {
      console.log(res.rows);
      return res.rows[0];
    });
};
