const prisma = require("./prisma.js");

async function findUserByUsername(username) {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
}

async function findUserById(id) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function addUser(username, password) {
  const user = await prisma.user.create({
    data: {
      username,
      password,
    },
  });
  return user.id;
}

module.exports = {
  findUserByUsername,
  findUserById,
  addUser,
};
