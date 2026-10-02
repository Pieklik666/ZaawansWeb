import { useEffect, useState } from "react";


function PowitanieZBazy(){
    const [imie, setImie] = useState('Nieznajomy');

    useEffect(()=>{
        setImie(localStorage.getItem('imie-ucznia'))
    }, []);

    return(<>
        Witaj {imie}
        <input type="text" id="imie" onChange={(event) => setImie(event.target.value)} />
        <button onClick={()=>{
            localStorage.setItem('imie-ucznia', imie);
        }}>klik</button>
    </>)
}
export default PowitanieZBazy