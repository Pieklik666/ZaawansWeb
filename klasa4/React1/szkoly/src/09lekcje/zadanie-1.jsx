import { createContext } from "react"
import { useState } from "react"
import { useContext } from "react"

const SchoolNameContext = createContext(null)

function SchoolNameProvider(){
    const [ nazwa, setNazwa] = useState("Liceum Ogólnokształcące nr 1 im. Jana Kochanowskiego")
    return(<>
        <SchoolNameContext.Provider value={nazwa}>
            <SchoolHeader />
        </SchoolNameContext.Provider>

    </>)
}

function SchoolHeader(){
    const nazwa = useContext(SchoolNameContext)

    return(<>
        <h1>{nazwa}</h1>
    </>)
}

export default SchoolNameProvider