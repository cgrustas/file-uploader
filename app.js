const express = require("express");
const path = require("node:path");
const passport = require("passport");

/**
 * -------------- GENERAL SETUP ----------------
 */

require("dotenv").config();
const multer = require("multer");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.locals.title = "My Drive";

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
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
 * -------------- CLOUD STORAGE ----------------
 *
 */
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmvocarnk",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * -------------- ROUTES ----------------
 */

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const fileRouter = require("./routes/fileRouter");
const folderRouter = require("./routes/folderRouter");
const isAuthenticated = require("./middleware/isAuthenticated.js");

app.use("/", authRouter);
app.use("/", isAuthenticated, indexRouter);
app.use("/files", isAuthenticated, fileRouter);
app.use("/folders", isAuthenticated, folderRouter);

/**
 * -------------- ERROR HANDLING ----------------
 */

app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .send(`${err.message}. <a href="/files/new">Try again</a>`);
  }

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
