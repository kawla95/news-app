const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((response) => {
    return response.rows;
  });
};
exports.selectArticle = (articleId) => {
  return db
    .query(
      `SELECT * FROM articles WHERE article_id = $1
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
