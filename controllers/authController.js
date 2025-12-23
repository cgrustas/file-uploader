const { body, validateUser } = require("express-validator");
const bcrypt = require("bcryptjs");
const userQueries = require("../lib/userQueries.js");

function getSignupForm(req, res) {
  res.render("sign-up-form");
}

const createUser = [
  body("username")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom(async (value) => {
      const user = await userQueries.findUserByUsername(value);
      if (user) {
        throw new Error("E-mail already in use");
      }
    }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userId = await userQueries.addUser(req.body.username, hashedPassword);
    const user = {
      id: userId,
      username: req.body.username,
    };

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
];

function getLogin(req, res) {
  const errors = req.session.messages || [];
  req.session.messages = [];
  res.render("log-in-form", { errors });
}

module.exports = {
  getSignupForm,
  createUser,
  getLogin,
};
