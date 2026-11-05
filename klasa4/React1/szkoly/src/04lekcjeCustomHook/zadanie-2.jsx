import { useState } from "react";

function useCounter(start = 0, min = 0, max = 0, krok = 1) {
    const [licznik, setLicznik] = useState(start);

    function zwieksz() {
        if(licznik + krok <= max) {
            return <button onClick={() => setLicznik(licznik + krok)}>+</button>
        }
        else{
            return <button disabled={true}>+</button>
        }
    }
    function zmniejsz() {
        if(licznik - krok >= min) {
            return <button onClick={() => setLicznik(licznik - krok)}>-</button>
        }
        else{
            return <button disabled={true}>-</button>
        }
    }
    function resetuj(){
        setLicznik(0)
    }

    return [licznik, zwieksz, zmniejsz, resetuj];
}

function CounterCustomHook() {
    const [licznik, zwieksz, zmniejsz, resetuj] = useCounter(0, 0, 35, 1)

    return(<>
        {zwieksz()}
        Aktualna ilość uczniów: {licznik}
        {zmniejsz()}
        
        <button onClick={resetuj}>Reset</button>
    </>)
}

export default CounterCustomHook