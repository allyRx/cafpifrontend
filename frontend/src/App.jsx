import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="App">
      <h1>Frontend</h1>
      <p>Message from backend: {message}</p>
    </div>
  )
}

export default App
