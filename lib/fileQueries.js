const prisma = require("./prisma.js");

async function addFile(originalname, filename, path, size, userId) {
  await prisma.file.create({
    data: { originalname, filename, path, size, userId },
  });
}

module.exports = { addFile };
