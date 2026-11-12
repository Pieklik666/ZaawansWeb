import { useCallback, useState } from "react"

function Licznik(){
    console.log("Licznik re-render")
    const [licznik, setLicznik] = useState(0)

    const zwieksz = useCallback(() => {
        setLicznik(licznik + 1)
    }, [licznik])

    return(<>
        {licznik}
        <button onClick={zwieksz}>+1</button> 
    </>)
}

export default Licznik