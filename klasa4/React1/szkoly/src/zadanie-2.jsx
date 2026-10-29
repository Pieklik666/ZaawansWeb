import { useState } from "react"

function formularzOceniania(){
    const [oceny, setOceny] = useState(null)
    const [imieOrazNazwisko, setImieOrazNazwisko] = useState(null)


    function formSubmit(e){
        e.preventDefault()

    }

    return(<>
        <form onSubmit={formSubmit}>
            <label htmlFor="imieNazwisko">Podaj Imie i Nazwisko</label>
            <input type="text" id="imieNazwisko"/>
            <select name="selectOcena" id="selectOcena">
                <option value={1}>1</option>
                <option value={1}>2</option>
                <option value={1}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
            </select>

            <select name="selectPrzedmiot" id="selectPrzedmiot">
                <option value="matematyka">matematyka</option>
                <option value="polski">polski</option>
                <option value="angielski">angielski</option>
                <option value="historia">historia</option>
                <option value="biologia">biologia</option>
            </select>
        </form>
        
        Lista Ocen: 
        {
            oceny.forEach(element => {
                return("[Imie Nazwisko] - [Przedmiot]: {ocena}")
            });
        }
    </>)
}

export default formularzOceniania