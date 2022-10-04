import React, { useState } from 'react'
import Header from './Header'

function EnterForm({ currentRoom, setCurrentRoom, setCurrentUser }) {
  const [username, setUsername] = useState(null)
  const [roomName, setRoomName] = useState('Room 1')

  function submitFunc(e) {
    e.preventDefault()

    setCurrentUser(username || 'Anonymous')
    setCurrentRoom(roomName)
  }

  return (
    <div>
      <Header currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
      <form
        onSubmit={submitFunc}
        className="flex flex-col bg-color3 text-color1 m-4 px-2 py-8 rounded"
      >
        {/* Username */}
        <div className="flex flex-col">
          <label htmlFor="username" className="pb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="py-2 px-4 mb-4 text-color1"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        {/* Rooms */}
        <div className="flex flex-col">
          <label htmlFor="rooms" className="pb-2">
            Room
          </label>
          <select
            id="rooms"
            name="rooms"
            className="py-2 px-4 mb-4"
            onChange={(e) => setRoomName(e.target.value)}
          >
            <option value="Room 1">Room 1</option>
            <option value="Room 2">Room 2</option>
            <option value="Room 3">Room 3</option>
            <option value="Room 4">Room 4</option>
          </select>

          <button className="button" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default EnterForm
