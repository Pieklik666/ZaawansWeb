import { useState } from "react"
import { BrowserRouter, Route } from "react-router-dom"
import { Routes, useParams } from "react-router-dom"


function ElementZadania(){
    const [nazwaElementu, setNazwaElementu] = useState("DefaultText")
    const {taskId} = useParams()

    return (<>
        {taskId} Nazwa: {nazwaElementu} <br/>
        <input type="text" onChange={(e) => {setNazwaElementu(e.target.value)}}/>
    </>)
}

function Zadanie2(){

    return(<>
        <BrowserRouter>
            <Routes>
                <Route path="/tasks/:taskId" element={<ElementZadania/>} />
            </Routes>
        </BrowserRouter>
    </>)
}

export default Zadanie2