import React from 'react'

function Message({ username, time, date, message }) {
  return (
    <div className="px-4 py-2">
      <div className="flex items-baseline justify-between">
        <p className="font-semibold">{username}</p>
        <div className="flex items-baseline">
          <p className="text-xs mr-2">{time}</p>
          <p className="text-xs">{date}</p>
        </div>
      </div>
      <div className="text-sm w-full break-words">{message}</div>
    </div>
  )
}

export default Message
