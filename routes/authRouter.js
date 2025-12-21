require("../config/passport");
const passport = require("passport");
const { Router } = require("express");
const authController = require("../controllers/authController.js");

const authRouter = Router();

authRouter.get("/sign-up", authController.getSignupForm);
authRouter.post("/sign-up", authController.createUser);

authRouter.get("/log-in", authController.getLogin);
authRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: true,
  })
);

authRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = authRouter;
