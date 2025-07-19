import { useState } from 'react'
import './App.css'
import axios from 'axios';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'; 
import { useId } from 'react';


function App() {
  const [messages, setMessages] = useState([])
  const [context, setContext] = useState({})
  const [source, setSource] = useState('')
  const session_id = Date.now().toString(36)

  const CustomLink = ({href, children,...props}) => {
    const handleClick = (event) => {
      console.log(children)
      setSource(context[children]['content'])
    }

    return (
      <a href={href} onClick={handleClick} className='text-blue-500' {...props}>
        {children}
      </a>
    )
  }
  const customRenderers = {
    a: CustomLink
  }
  const handleKeyUp = async (e) => {
    if (e.key === 'Enter') {
      const inputValue = e.target.value
      setMessages([...messages, {"message": inputValue}])
      console.log(messages)
      axios.post('http://127.0.0.1:8000/chat/', {"message": inputValue, "session_id": session_id}).then(res => {
        setMessages(prevMessages => {
          const newMessages = [...prevMessages, res.data]
          console.log(res.data)
          console.log(session_id)
          try {
            const newContextData = JSON.parse(res.data.context)
            let newContext = context
            for(let i = 0; i < newContextData.length; i++) {
              let id = newContextData[i].id
              console.log(id)
              if(!(id in context)) {
                newContext[id] = newContextData[i]
              }
            }
            setContext(newContext)
          } catch (error) {
            console.log(error)
          }
          return newMessages
        })
      })
      e.target.value = ''
    }
  }

  return (
    <>
    <div className='w-full h-full'>
      {source == '' && 
        <div className='flex flex-col h-[80vh] w-full overflow-y-scroll'>
          {messages.map((msg, index) => {
            if ("message" in msg) {
              return <div key={index} className='flex self-end p-3 m-5 bg-blue-100 rounded-full w-fit'>
                {msg.message}
              </div>
            } else if ("response" in msg) {
              return <div key={index} className='w-fit h-fit flex-col p-3 m-5 text-left'>
                {<Markdown rehypePlugins={[rehypeRaw]} components={customRenderers}>{msg.response}</Markdown>}
              </div>
            }
          })}
        </div>
      }
      {source != '' &&
        <div className='w-full h-[80vh] flex'>
          <div className='flex flex-col h-full w-2/3 overflow-y-scroll'>
            {messages.map((msg, index) => {
              if ("message" in msg) {
                return <div key={index} className='flex self-end p-3 m-5 bg-blue-100 rounded-full w-fit'>
                  {msg.message}
                </div>
              } else if ("response" in msg) {
                return <div key={index} className='w-fit h-fit flex-col p-3 m-5 text-left'>
                  {<Markdown rehypePlugins={[rehypeRaw]}>{msg.response}</Markdown>}
                </div>
              }
            })}
          </div>
          <div className='flex flex-col h-full w-1/3 overflow-y-scroll'>
            <div className='w-fit self-end p-4' onClick={()=>{setSource('')}}>x</div>
            <div className='text-left p-4'>
              {<Markdown rehypePlugins={[rehypeRaw]}>{source}</Markdown>}
            </div>
          </div>
        </div>
      }
      <input className='w-full p-2 rounded-md border border-gray-300' placeholder="詢問關於採購相關的問題" onKeyUp={handleKeyUp}/>
    </div>
    </>
  )
}

export default App
