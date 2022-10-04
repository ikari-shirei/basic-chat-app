import { useState } from 'react'
import ChatRoom from './components/ChatRoom'
import EnterForm from './components/EnterForm'
import io from 'socket.io-client'

function App() {
  const [currentRoom, setCurrentRoom] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // Automatically connects
  // Don't use this inside of frequently rerendering component
  const socket = io.connect('https://ikari-shirei-chat-app-basic.glitch.me/')

  return (
    <div className="flex justify-center">
      <div className="w-96 bg-color1 text-color3 h-screen">
        {!currentRoom && (
          <div>
            <EnterForm
              currentRoom={currentRoom}
              setCurrentRoom={setCurrentRoom}
              setCurrentUser={setCurrentUser}
            />
          </div>
        )}

        {currentRoom && (
          <ChatRoom
            currentRoom={currentRoom}
            setCurrentRoom={setCurrentRoom}
            socket={socket}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  )
}

export default App
