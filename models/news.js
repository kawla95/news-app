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
// exports.selectArticles = () => {
//   return db
//     .query(
//       `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
//   FROM articles
//   JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`
//     )
//     .then((response) => {
//       return response.rows;
//     });
// };
exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  const orders = ["ASC", "DESC"];

  let queryStr = ` SELECT articles.*, COUNT(comments.comment_id) AS comment_count
   FROM articles
   LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at ${orders}`;

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.updateArticleById = (articleId, inc_votes) => {
  if (typeof inc_votes != "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1
                  WHERE article_id = $2 RETURNING *;`,
      [inc_votes, articleId]
    )
    .then((response) => {
      return response.rows[0];
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
