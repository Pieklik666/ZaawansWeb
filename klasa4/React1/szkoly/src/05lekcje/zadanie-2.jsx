import { useState } from "react"
// NIE DZIALA
function KalkulatorOcen(){
    const [oceny, SetOceny] = useState(1, 3, 5)

    return (
        <>
            <input type="number" name="number" id="ocena" min={1} max={6}/>
            <button style={{height: '60px'}} onClick={()=>{
                SetOceny(...oceny, )
            }}>Dodaj ocenę</button>

            Wszystkie Oceny: {...oceny}
        </>
    )
}
export default KalkulatorOcen