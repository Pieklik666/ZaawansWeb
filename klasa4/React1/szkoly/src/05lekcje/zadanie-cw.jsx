import { useState } from "react"

function InputLengthChange(){
    const [ileZnak, setIleZnak] = useState(0)
    const HandleChange = (e) => {
        setIleZnak(e.target.value.length)
    }

    return(
        <>
            <input type="text" onChange={HandleChange} />
            Jest w tym {ileZnak} znaków
        </>
    )
}
export default InputLengthChange