const { body, validationResult } = require("express-validator");
const fileQueries = require("../lib/fileQueries.js");
const NotFoundError = require("../errors/NotFoundError.js");
const BadRequestError = require("../errors/BadRequestError.js");

function renderUploadForm(req, res) {
  res.render("upload-file-form", { folderId: req.query.folderId });
}

async function uploadFile(req, res, next) {
  if (!req.file) {
    throw new BadRequestError("Select a file before submitting!");
  }

  const { originalname, filename, path, size } = req.file;
  const userId = Number(req.user.id);
  const folderId = req.body.folderId ? Number(req.body.folderId) : null;
  await fileQueries.addFile(
    originalname,
    filename,
    path,
    size,
    userId,
    folderId
  );

  const returnPath = folderId ? `/folders/${folderId}` : "/";
  res.redirect(returnPath);
}

function renderFileDetails(req, res, next) {
  const file = req.dbFile;
  if (!file) {
    throw new NotFoundError("Cannot access file");
  }

  res.render("file-details", { file });
}

function downloadFile(req, res, next) {
  const file = req.dbFile;
  if (!file) {
    throw new NotFoundError("Cannot access file");
  }

  const filePath = file.path;
  const originalFilename = file.originalname;
  res.download(filePath, originalFilename);
}

module.exports = {
  renderUploadForm,
  uploadFile,
  renderFileDetails,
  downloadFile,
};
