const prisma = require("./prisma.js");

async function addFile(name, url, publicId, size, userId, folderId) {
  await prisma.file.create({
    data: { name, url, publicId, size, userId, folderId },
  });
}

async function getFiles(userId, folderId) {
  return await prisma.file.findMany({
    where: {
      userId,
      folderId,
    },
  });
}

async function getFileById(userId, fileId) {
  return await prisma.file.findUnique({
    where: {
      id: fileId,
      userId,
    },
  });
}

module.exports = { addFile, getFiles, getFileById };
