const folderQueries = require("../lib/folderQueries.js");
const fileQueries = require("../lib/fileQueries.js");

async function getIndex(req, res, next) {
  const userId = Number(req.user.id);
  const folders = await folderQueries.getFolders(userId, null);
  const files = await fileQueries.getFiles(userId, null);
  const folderPath = await folderQueries.getFolderPath(userId, null);
  res.render("index", {
    user: req.user,
    folders,
    files,
    folderPath,
  });
}

module.exports = {
  getIndex,
};
