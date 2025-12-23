const fileQueries = require("../lib/fileQueries");
const NotFoundError = require("../errors/NotFoundError");

async function authorizeFile(req, res, next) {
  const fileId = Number(req.params.id);
  const userId = Number(req.user.id);

  const file = await fileQueries.getFileById(userId, fileId);
  if (!file) {
    throw new NotFoundError("File not found");
  }

  req.dbFile = file;
  next();
}

module.exports = authorizeFile;
