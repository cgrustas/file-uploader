const { body, validationResult } = require("express-validator");
const folderQueries = require("../lib/folderQueries.js");
const fileQueries = require("../lib/fileQueries.js");
const NotFoundError = require("../errors/NotFoundError.js");
const fs = require("fs/promises");

function renderCreateFolderForm(req, res) {
  const action = "/folders/new";
  res.render("folder-form", { action, parentId: req.query.folderId });
}

async function renderUpdateFolderForm(req, res) {
  const folderId = Number(req.params.id);

  const folder = req.folder;
  if (!folder) throw new NotFoundError("Folder not found");

  const action = `/folders/${folderId}/update`;
  res.render("folder-form", { action, folderId });
}

async function createFolder(req, res, next) {
  const userId = Number(req.user.id);
  const parentId = Number(req.body.parentId) || null;

  await folderQueries.addFolder(req.body.name, userId, parentId);

  const returnPath = parentId ? `/folders/${parentId}` : "/";
  res.redirect(returnPath);
}

async function renderFolderContents(req, res, next) {
  const folderId = req.params.id ? Number(req.params.id) : null;
  const userId = Number(req.user.id);
  const folders = await folderQueries.getFolders(userId, folderId);
  const files = await fileQueries.getFiles(userId, folderId);
  const folderPath = await folderQueries.getFolderPath(userId, folderId);

  res.render("folder-contents", { folders, files, folderPath, folderId });
}

async function updateFolder(req, res, next) {
  const folderId = Number(req.params.id);
  const userId = Number(req.user.id);

  await folderQueries.setFolderName(req.body.name, userId, folderId);
  res.redirect(`/folders/${folderId}`);
}

async function deleteFolder(req, res, next) {
  const folderId = Number(req.params.id);
  const userId = Number(req.user.id);

  const parentId = await folderQueries.getParentId(userId, folderId);
  const returnPath = parentId ? `/folders/${parentId}` : "/";

  const filePaths = await folderQueries.getFilePathsRec(userId, folderId);
  const deleteFiles = filePaths.map((path) => fs.unlink(path));
  await Promise.all(deleteFiles);

  await folderQueries.deleteFolder(userId, folderId);

  res.redirect(returnPath);
}

module.exports = {
  renderCreateFolderForm,
  renderUpdateFolderForm,
  createFolder,
  renderFolderContents,
  updateFolder,
  deleteFolder,
};
