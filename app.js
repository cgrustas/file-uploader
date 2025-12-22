const express = require("express");
const path = require("node:path");
const passport = require("passport");

/**
 * -------------- GENERAL SETUP ----------------
 */

require("dotenv").config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION SETUP ----------------
 */

const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./lib/prisma");
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 *
 */

require("./config/passport");
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const fileRouter = require("./routes/fileRouter");

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/files", fileRouter);

/**
 * -------------- ERROR HANDLING ----------------
 */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

/**
 * -------------- SERVER ----------------
 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app listening on port ${PORT}!`);
});
