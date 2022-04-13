const db = require("../db/connection");
const format = require("pg-format");

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

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const allowedSortBys = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  const allowedOrder = ["ASC", "DESC"];
  if (!allowedSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!allowedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else {
    let queryValues = [];
    let sqlString = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    JOIN comments ON articles.article_id = comments.article_id`;

    if (topic) {
      queryValues.push(topic);
      sqlString += ` WHERE topic ILIKE %L`;
    }

    sqlString += ` GROUP BY articles.article_id`;

    if (sort_by === "title") {
      queryValues.push(`title`);
      sqlString += ` ORDER BY %I`;
    } else if (sort_by === "body") {
      queryValues.push(`body`);
      sqlString += ` ORDER BY %I`;
    } else if (sort_by === "votes") {
      queryValues.push(`votes`);
      sqlString += ` ORDER BY %I`;
    } else if (sort_by === "topic") {
      queryValues.push(`topic`);
      sqlString += ` ORDER BY %I`;
    } else if (sort_by === "author") {
      queryValues.push(`author`);
      sqlString += ` ORDER BY %I`;
    } else if (sort_by === "comment_count") {
      queryValues.push(`comment_count`);
      sqlString += ` ORDER BY %I`;
    } else {
      queryValues.push(`created_at`);
      sqlString += ` ORDER BY %I`;
    }

    if (order === "ASC") {
      queryValues.push(` ASC`);
      sqlString += ` %s`;
    } else {
      queryValues.push(` DESC`);
      sqlString += ` %s`;
    }

    const queryString = format(sqlString, ...queryValues);

    return db.query(queryString).then((responses) => {
      return responses.rows;
    });
  }
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
