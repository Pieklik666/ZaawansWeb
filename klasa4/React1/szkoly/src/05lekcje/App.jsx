import { useState } from 'react'

import ZmienMotyw from './zadanie-1.jsx'
import InputLengthChange from './zadanie-cw.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ZmienMotyw />
      <InputLengthChange />
    </>
  )
}

export default App
