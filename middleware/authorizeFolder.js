const folderQueries = require("../lib/folderQueries");
const NotFoundError = require("../errors/NotFoundError");

async function authorizeFolder(req, res, next) {
  const folderId = Number(req.params.id);
  const userId = Number(req.user.id);

  const folder = await folderQueries.getFolderById(userId, folderId);
  if (!folder) {
    throw new NotFoundError("Folder not found");
  }

  req.folder = folder;
  next();
}

module.exports = authorizeFolder;
