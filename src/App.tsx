import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [messages, setMessages] = useState({ edge: '', nodejs: '' })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [edgeResponse, nodejsResponse] = await Promise.all([
          fetch('/api/edge/hello'),
          fetch('/api/nodejs/hello')
        ])

        const [edgeData, nodejsData] = await Promise.all([
          edgeResponse.json(),
          nodejsResponse.json()
        ])
        setMessages({ edge: edgeData.message, nodejs: nodejsData.message })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData();
  }, [])

  return (
    <>
      <div>
        <div className="App">
          <h1>My React Vercel App</h1>
          <p>{messages.edge}</p>
          <p>{messages.nodejs}</p>
        </div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
