import React from 'react'

function Header({ currentRoom, setCurrentRoom, disconnectSocket }) {
  return (
    <header className="flex justify-between p-4">
      {/* Header */}
      <p className="text-2xl">Chat App</p>

      {/* Leave button */}
      {currentRoom ? (
        <button
          className="button"
          onClick={() => {
            disconnectSocket()
            setCurrentRoom(null)
          }}
        >
          Leave Room
        </button>
      ) : (
        ''
      )}
    </header>
  )
}

export default Header
