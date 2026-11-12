import { memo, useCallback, useState } from "react"


function Lista(){
    const [lista, setLista] = useState(["el1","el2","el3","el4","el5","el6","e7",])
    const [szkukane, setSzkane] = useState("")

    const przefiltrowane = useCallback(() => {
        console.log("Przefiltrowane re-render")
        return (lista.filter((p) => p.includes(szkukane)))
    }, [lista, szkukane])

    return(<>
        Szukaj: <input type="text" onChange={(e) => setSzkane(e.target.value)}/>
        <ul>
			{przefiltrowane().map((p) => (
                <ElementListy key={p} nazwa={p}/>
			))}
		</ul>
    </>)
}

const ElementListy = memo(function ElementListy({nazwa}){
    console.log("ElementListy re-render") // renderuje sie tylko gdy sie wyswietla, nie gdy znika lub zostaje jak jest
    return(<>
        <li key={nazwa}>Element: {nazwa}</li>
    </>)
})

export default Lista