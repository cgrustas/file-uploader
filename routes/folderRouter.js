const { Router } = require("express");
const folderController = require("../controllers/folderController.js");
const authorizeFolder = require("../middleware/authorizeFolder.js");

const folderRouter = Router();

folderRouter.get("/new", folderController.renderCreateFolderForm);
folderRouter.post("/new", folderController.createFolder);

folderRouter.get(
  "/:id",
  authorizeFolder,
  folderController.renderFolderContents
);

folderRouter.get(
  "/:id/update",
  authorizeFolder,
  folderController.renderUpdateFolderForm
);
folderRouter.post(
  "/:id/update",
  authorizeFolder,
  folderController.updateFolder
);

folderRouter.post(
  "/:id/delete",
  authorizeFolder,
  folderController.deleteFolder
);

module.exports = folderRouter;
