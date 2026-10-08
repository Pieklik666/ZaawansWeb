import { useState } from "react"
import InfoUczen from "./zadanie-1"
import PrzyciskZapisz from "./zadanie-2"




function App() {
  const [zapisane, setZapisane] = useState(false)

  return (
    <>
      <InfoUczen imie="Kasia Nowak" czyObecny={true} numerDziennika={5} />    <br/><br/><br/><br/><br/><br/>
      <PrzyciskZapisz czyZapisano={zapisane} onZapis={() => {setZapisane(true)}}/>
    </>
  )
}

export default App
