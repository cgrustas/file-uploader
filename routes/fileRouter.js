const { Router } = require("express");
require("../config/passport");
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const fileController = require("../controllers/fileController.js");
const upload = multer({ dest: path.join(__dirname, "../uploads") });
const isAuthenticated = require("../middleware/isAuthenticated.js");

const fileRouter = Router();

fileRouter.get("/", isAuthenticated, fileController.renderUploadForm);
fileRouter.post(
  "/",
  isAuthenticated,
  upload.single("file"),
  fileController.uploadFile
);

module.exports = fileRouter;
