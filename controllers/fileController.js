const fileQueries = require("../lib/fileQueries.js");
const NotFoundError = require("../errors/NotFoundError.js");
const BadRequestError = require("../errors/BadRequestError.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");

function renderUploadForm(req, res) {
  res.render("upload-file-form", { folderId: req.query.folderId });
}

async function uploadFile(req, res, next) {
  if (!req.file) {
    throw new BadRequestError("Select a file before submitting!");
  }

  const { originalname, size, path } = req.file;

  const results = await cloudinary.uploader.upload(path);
  const url = cloudinary.url(results.public_id);

  const userId = Number(req.user.id);
  const folderId = req.body.folderId ? Number(req.body.folderId) : null;
  await fileQueries.addFile(
    originalname,
    url,
    results.public_id,
    size,
    userId,
    folderId
  );

  fs.unlink(path);

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

  const downloadableUrl = file.url.replace(
    "/upload/",
    "/upload/fl_attachment/"
  );

  res.redirect(downloadableUrl);
}

module.exports = {
  renderUploadForm,
  uploadFile,
  renderFileDetails,
  downloadFile,
};
