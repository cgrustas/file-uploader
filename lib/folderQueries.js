const prisma = require("./prisma.js");

async function addFolder(name, userId, parentId) {
  await prisma.folder.create({
    data: {
      name,
      userId,
      parentId,
    },
  });
}

async function getFolders(userId, parentId) {
  return await prisma.folder.findMany({
    where: {
      parentId,
      userId,
    },
  });
}

async function getFolderPath(userId, folderId) {
  const path = [];

  let currentId = folderId;
  while (currentId) {
    const folder = await getFolderById(userId, currentId);
    path.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId;
  }
  path.unshift({ id: null, name: "My Drive" });
  return path;
}

async function getFolderById(userId, folderId) {
  return await prisma.folder.findUnique({
    where: {
      id: folderId,
      userId: userId,
    },
  });
}

async function setFolderName(name, userId, folderId) {
  await prisma.folder.update({
    where: {
      userId,
      id: folderId,
    },
    data: {
      name,
    },
  });
}

async function deleteFolder(userId, folderId) {
  await prisma.folder.delete({
    where: {
      userId,
      id: folderId,
    },
  });
}

async function getParentId(userId, folderId) {
  const { parentId } = await prisma.folder.findUnique({
    where: {
      userId,
      id: folderId,
    },
    select: {
      parentId: true,
    },
  });
  return parentId;
}

async function getFilePathsRec(userId, folderId) {
  const { files } = await prisma.folder.findUnique({
    where: {
      userId,
      id: folderId,
    },
    select: {
      files: true,
    },
  });

  const filePaths = files.map((file) => file.path);
  const childFolders = await getFolders(userId, folderId);
  const nestedPaths = await Promise.all(
    childFolders.map((child) => getFilePathsRec(userId, child.id))
  );
  return filePaths.concat(nestedPaths.flat());
}

module.exports = {
  addFolder,
  getFolders,
  getFolderPath,
  getFolderById,
  setFolderName,
  deleteFolder,
  getParentId,
  getFilePathsRec,
};
