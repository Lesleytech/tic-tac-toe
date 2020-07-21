const users = [];

const addUser = (user) => {
  users.push(user);
};

const getUsers = () => {
  return users;
};

const getWaitingUsers = () => {
  return users.filter(
    (user) => users.filter((u) => u.room === user.room).length === 1
  );
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  users.splice(index, 1);
};

const removeUserFromRoom = (room) => {
  const index = users.findIndex((user) => user.room === room);
  users.splice(index, 1);
};

module.exports = {
  addUser,
  getUsers,
  removeUser,
  getWaitingUsers,
  removeUserFromRoom,
};
