const express = require("express");
const app = express();
const {
  handleIncorrectPath,
  handleInternalServerError,
} = require("./errorhandling");

const {
  getTopics,
  getArticleById,
  getUsers,
  getCommentsByArticleId,
  getArticles,
  patchArticleById,
  deleteCommentByCommentId,
  postCommentByArticleId,
  getApi,
} = require("./controllers/news");

app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);

app.get("/api/articles/:articleId", getArticleById);

app.get("/api/users", getUsers);

app.get("/api/articles/:articleId/comments", getCommentsByArticleId);

app.get("/api/articles", getArticles);

app.patch("/api/articles/:articleId", patchArticleById);

app.delete("/api/comments/:commentId", deleteCommentByCommentId);

app.post("/api/articles/:articleId/comments", postCommentByArticleId);

app.all("/*", handleIncorrectPath);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use(handleInternalServerError);

module.exports = app;
