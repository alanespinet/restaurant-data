const catchError = error => res.status(403).send(error);


module.exports = {
  catchError
};
