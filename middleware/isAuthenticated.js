function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/log-in");
  }
}

module.exports = isAuthenticated;
