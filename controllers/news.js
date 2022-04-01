const {
  selectTopics,
  selectArticle,
  selectUsers,
  selectCommentsByArticleId,
  selectArticles,
  removeComment,
  addCommentByArticleId,
} = require("../models/news");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleById = (req, res, next) => {
  const { articleId } = req.params;
  selectArticle(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  selectCommentsByArticleId(articleId)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
exports.deleteCommentByCommentId = (req, res, next) => {
  const { commentId } = req.params;
  removeComment(commentId)
    .then(() => {
      res.status(204).send({ msg: "No content" });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postCommentByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const newComment = req.body;
  console.log(articleId, newComment);

  addCommentByArticleId(articleId, newComment)
    .then((comment) => {
      return res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};
