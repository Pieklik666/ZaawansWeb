import { useState } from 'react'
import './App.css'
import Profil from './zadanie-1'
import ListaProduktow from './zadanie-2'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <section id="zadania">

        <Profil username="Aleks" email="Pieklik@gmail.com" avatar="https://media.istockphoto.com/id/2220888288/pl/wektor/znak-symbolu-wektorowego-emoji-ognia-w-p%C5%82askim-stylu-ilustracja-wektorowa-p%C5%82omienia-wektor.jpg?s=1024x1024&w=is&k=20&c=z7XlMaDD5146S-AggfEY_-mcCVK5iFWKSTmiivQfRCc=" />
        
        <ListaProduktow />

      </section>
    </>
  )
}

export default App
