import { map } from "lodash"
import { useRef, useState } from "react"

function formularzOceniania(){
    const ocenaRef = useRef(null)
    const przedmiotRef = useRef(null)
    const imieRef = useRef(null)
    const nazwiskoRef = useRef(null)

    const [listaWstawionych, setListaWstawionych] = useState([{id: 0, imie: "imie1", nazwisko: "nazwisko1", przedmiot: "przedmiot1", ocena: 1}])


    function formSubmit(e){
        e.preventDefault()
        setListaWstawionych([...listaWstawionych, {id: listaWstawionych.length, imie: imieRef.current.value, nazwisko: nazwiskoRef.current.value, przedmiot: przedmiotRef.current.value, ocena: ocenaRef.current.value}])
    }

    return(<>
        <form onSubmit={formSubmit}>
            <label htmlFor="imie">Podaj imie</label>
            <input type="text" id="imie" ref={imieRef}/>
            <label htmlFor="nazwisko">Podaj nazwisko</label>
            <input type="text" id="nazwisko" ref={nazwiskoRef}/>

            <select name="selectOcena" id="selectOcena" ref={ocenaRef}>
                <option value={1}>1</option>
                <option value={1}>2</option>
                <option value={1}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
            </select>

            <select name="selectPrzedmiot" id="selectPrzedmiot" ref={przedmiotRef}>
                <option value="matematyka">matematyka</option>
                <option value="polski">polski</option>
                <option value="angielski">angielski</option>
                <option value="historia">historia</option>
                <option value="biologia">biologia</option>
            </select>

            <button type="submit">Dodaj Ocene</button>
        </form>
        
        Lista Ocen: 
        {
            listaWstawionych.map(
                (ocena) => {
                    return(<li key={ocena.id}> {ocena.imie} {ocena.nazwisko} - {ocena.przedmiot}: {ocena.ocena} </li>)
                }
            )
        }
    </>)
}

export default formularzOceniania