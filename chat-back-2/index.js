const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const { DateTime } = require('luxon')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./users')
require('dotenv').config()

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: process.env.FRONT_URL, optionsSuccessStatus: 200 },
  methods: ['GET', 'POST'],
})

io.on('connection', (socket) => {
  function socketInfo() {
    console.log(
      'Socket connected.\nCount of total sockets:' + io.engine.clientsCount
    )
  }
  socketInfo()

  const date = DateTime.fromISO(DateTime.now())

  // This helps sending messages like a user.
  class Bot {
    constructor(message, room) {
      this.currentMessage = message || 'No name'
      this.currentUser = 'Bot'
      this.currentRoom = room || 'No room'
      this.currentDate = date.toLocaleString()
      this.currentTime = date.toLocaleString(DateTime.TIME_24_SIMPLE)
      this.key = new Date()
    }
  }

  socket.on('joinRoom', ({ currentUser, currentRoom }) => {
    const user = userJoin(socket.id, currentUser, currentRoom)

    // This is socketio function
    socket.join(user.room)

    // Personalized welcome, just user can see
    const welcomeBot = new Bot(
      `Welcome to room ${user.room} ${user.username}.`,
      user.room
    )
    socket.emit('message', welcomeBot)

    // Broadcast to all other users that new user has connected
    const broadcastBot = new Bot(
      `${user.username} has joined the room ${user.room}`,
      `${user.room}`
    )
    socket.broadcast.to(user.room).emit('message', broadcastBot)

    // Update room user info
    io.to(user.room).emit('roomUsers', getRoomUsers(user.room))
  })

  // Get user message and share it everybody in the same room
  socket.on('chatMessage', (data) => {
    const user = getCurrentUser(socket.id)

    if (user) {
      data.currentDate = date.toLocaleString()
      data.currentTime = date.toLocaleString(DateTime.TIME_24_SIMPLE)
      data.key = new Date()

      io.to(`${user.room}`).emit('message', data)
    }
  })

  // Disconnect
  socket.on('disconnect', (data) => {
    // Remove user from users list
    const user = userLeave(socket.id)

    if (user) {
      // Update room user info
      io.to(user.room).emit('roomUsers', getRoomUsers(user.room))

      // Socketio function
      socket.disconnect()

      let disconnectBot = new Bot(
        `${user.username} left the room.`,
        `${user.room}`
      )

      io.emit('disconnectMessage', disconnectBot)
    }
  })
})

server.listen(5000, () => {
  console.log('SERVER CONNECTED')
})
