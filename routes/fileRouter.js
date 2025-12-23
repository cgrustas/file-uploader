const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fileController = require("../controllers/fileController.js");
const upload = multer({
  dest: path.join(__dirname, "../uploads"),
  limits: { fileSize: 10000000 }, // 10 MB
});
const authorizeFile = require("../middleware/authorizeFile.js");

const fileRouter = Router();

fileRouter.get("/new", fileController.renderUploadForm);
fileRouter.post("/new", upload.single("file"), fileController.uploadFile);
fileRouter.get("/:id", authorizeFile, fileController.renderFileDetails);
fileRouter.get("/:id/download", authorizeFile, fileController.downloadFile);

module.exports = fileRouter;
