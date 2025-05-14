import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import webSocket from 'socket.io-client'

function App() {
  const ws = webSocket('http://127.0.0.1:5000')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // initWebSocket()
  }, [ws])

  // const initWebSocket = () => {
  //   ws.on('connect', message => {
  //     ws.emit("new_message", "User join from react")
  //   })
  // }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      const inputValue = e.target.value
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, {"message": inputValue}]
        return newMessages
      })
      ws.emit("new_message", inputValue)
      e.target.value = ''
    }
  }

  ws.on("chat", (msg) => {
    console.log(msg.message)
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, msg]
      return newMessages
    })
  })

  return (
    <>
    <div className='w-full h-full'>
      <div className='flex flex-col h-[80vh] w-full overflow-auto'>
        {messages.map((msg, index) => {
          if ("message" in msg) {
            return <div key={index} className='flex self-end p-3 m-5 bg-blue-100 rounded-full w-fit'>
              {msg.message}
            </div>
          } else if ("response" in msg) {
            return <div key={index} className='w-fit flex p-3 m-5 text-left'>
              {msg.response}
            </div>

          }
        })}
      </div>
      <input className='w-full p-2 rounded-md border border-gray-300' placeholder="詢問關於採購相關的問題" onKeyUp={handleKeyUp}/>
    </div>
    </>
  )
}

export default App
