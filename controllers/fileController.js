const { body, validationResult } = require("express-validator");
const fileQueries = require("../lib/fileQueries.js");

function renderUploadForm(req, res) {
  res.render("upload-file-form");
}

async function uploadFile(req, res, next) {
  try {
    const { originalname, filename, path, size } = req.file;
    const { id } = req.user;
    await fileQueries.addFile(originalname, filename, path, size, id);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

module.exports = { renderUploadForm, uploadFile };
