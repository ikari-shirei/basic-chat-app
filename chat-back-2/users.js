let users = []

function userJoin(id, username, room) {
  const user = { id, username, room }
  users.push(user)

  return user
}

function getCurrentUser(id) {
  return users.find((usr) => usr.id === id)
}

function userLeave(id) {
  const leavingUser = users.find((usr) => usr.id === id)
  users = users.filter((usr) => usr.id !== id)
  return leavingUser
}

function getRoomUsers(room) {
  return users.filter((usr) => usr.room === room)
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
}
