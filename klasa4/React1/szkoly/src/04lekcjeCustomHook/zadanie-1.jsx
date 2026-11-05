import { useState } from "react"

function useToggle(initial = false){
    const [toggled, setToggled] = useState(initial)

    function toggle(){
        setToggled(!toggled)
    }

    return([toggled, toggle])
}

function PrzelacznikWidoku(){
    const [widoczny, toggle] = useToggle()


    return(<>
        <button onClick={toggle}>{widoczny ? "Ukryj szczegóły" : "Pokaż szczegóły"}</button>

        {widoczny && "Szczegóły uczniów tutaj"}
    </>)
}

export default PrzelacznikWidoku