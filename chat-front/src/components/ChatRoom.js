import React, { useEffect, useRef, useState } from 'react'
import Header from './Header'
import Message from './Message'

function ChatRoom({ currentUser, currentRoom, setCurrentRoom, socket }) {
  const ref = useRef(null)
  const [currentMessage, setCurrentMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [currentRoomUsers, setCurrentRoomUsers] = useState([])

  useEffect(() => {
    // On connection
    socket.on('connect', () => {
      // Tell server user has joined a room
      socket.emit('joinRoom', { currentUser, currentRoom })
    })

    // Get info of users in the room
    socket.on('roomUsers', (data) => {
      setCurrentRoomUsers(data)
    })

    // Get user disconnected message
    socket.on('disconnectMessage', (data) => {
      setMessages((prev) => prev.concat(data))
    })

    // Get welcome messages and user sent messages
    socket.on('message', (data) => {
      setMessages((prev) => prev.concat(data))
    })

    // On error
    socket.on('connect_error', (err) => {
      console.error(`connect_error due to ${err.message}`)
    })

    // Cleanup
    return () => {
      socket.off('connect')
      socket.off('message')
      socket.off('connect_error')
      socket.off('disconnectMessage')
      socket.off('joinRoom')

      setTimeout(() => {
        disconnectSocket()
      }, 500)
    }
  }, [socket])

  // Whenever new message come, scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Disconnect from socket connection manually
  function disconnectSocket() {
    socket.disconnect()
  }

  // Send user message
  function sendMessage(message) {
    socket.emit('chatMessage', {
      currentMessage,
      currentUser,
      currentRoom,
    })
    setCurrentMessage('')
  }

  // Scroll to bottom
  function scrollToBottom() {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
      })
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
        disconnectSocket={disconnectSocket}
      />

      <div>
        {/* Room Name */}
        <div className="flex flex-col items-center text-color1 bg-color2 py-1 h-16">
          <h1 className="font-bold text-xl">Current Room</h1>
          <p>{currentRoom}</p>
        </div>

        {/* Users */}
        <div className="flex flex-col items-center h-24">
          <h1 className="font-bold text-xl pt-1">Users</h1>
          <ul className="py-4 px-16 flex justify-center flex-wrap gap-4 overflow-y-auto">
            {currentRoomUsers.map((usr) => {
              return <li key={usr.id}>{usr.username}</li>
            })}
          </ul>
        </div>
      </div>

      {/* Messages */}
      <div className="relative bg-color3 text-color1 h-[32rem] overflow-y-auto">
        {messages
          ? messages.map((message) => {
              return (
                <Message
                  username={message.currentUser}
                  time={message.currentTime}
                  date={message.currentDate}
                  message={message.currentMessage}
                  key={message.key}
                />
              )
            })
          : ''}
        {/* Go bottom */}
        <div ref={ref} className="pt-CcC16"></div>
      </div>

      {/* Message send */}
      <div className="flex justify-between p-4">
        <input
          className="h-8 w-full mr-4 rounded py-1 px-4 text-sm text-color1 bg-color3"
          placeholder="Enter message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          type="text"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              sendMessage()
            }
          }}
        ></input>
        <button
          className="hover:bg-color2 text-color3
  font-semibold h-8 px-4 border rounded shadow"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatRoom
