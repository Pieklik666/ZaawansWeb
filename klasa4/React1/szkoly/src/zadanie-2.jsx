import { memo, useCallback, useState } from "react"


function Lista(){
    const [lista, setLista] = useState(["el1","el2","el3","el4","el5","el6","e7",])
    const [szkukane, setSzkane] = useState("")

    const przefiltrowane = useCallback(() => {

        lista
    })

    return(<>
        Szukaj: <input type="text" onChange={(e) => setSzkane(e.target.value)}/>
        <ul>
			{przefiltrowane.map((p) => (
				<li key={p}>{p}</li>
			))}
		</ul>
    </>)
}

const ElementListy = memo(function ElementListy({nazwa}){

    return(<>
        <li key={nazwa}>Element: {nazwa}</li>
    </>)
})