import { useState } from "react"


function FormularzImienia(){
    const [imieState, setImieState] = useState(null)

    function onChange(e){
        setImieState(e.target.value)
    }

    return(<>
        <input type="text" onChange={onChange}/>
        Witaj {imieState ? imieState : "Wpisz swoje imię"}
    </>)
}

export default FormularzImienia