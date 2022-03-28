exports.handleIncorrectPath = (req, res) => {
  res.status(404).send({ msg: "path not found" });
};

exports.handleInternalServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
