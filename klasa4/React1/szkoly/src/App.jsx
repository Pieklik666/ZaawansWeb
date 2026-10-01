import { useState } from 'react'
import './App.css'
import Article from './zadanie-1.jsx'
import PersonCard from './zadanie-2.jsx'
import MovieList from './zadanie-3.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="zadania">

        <Article title="Tytul" author="Jan" content="React jest super!" />

        <PersonCard firstName="A" lastName="C" age={18}/>

        <MovieList movies={[{ id: 1, title: "Inception", year: 2010, rating: 8.8 }, { id: 2, title: "Avatar", year: 2009, rating: 8.5 }]} />

        


      </section>
    </>
  )
}

export default App
