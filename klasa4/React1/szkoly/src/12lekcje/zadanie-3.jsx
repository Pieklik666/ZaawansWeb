import { memo, useCallback, useState, useMemo } from "react"


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
        <StatystykiUseMemo listaWyswietlana={przefiltrowane()}/>
        <ZmienMotyw/>
    </>)
}

const ElementListy = memo(function ElementListy({nazwa}){
    console.log("ElementListy re-render") // re-renderuje sie tylko zostaje wyświetlony, nie gdy znika ani gdy zostaje jak jest
    return(<>
        <li key={nazwa}>Element: {nazwa}</li>
    </>)
})

//-----------------------------------------------------------------------------------------------------------
const Statystyki = memo(function Statystyki({listaWyswietlana}){
    const start = performance.now();
    while (performance.now() - start < 200) {
        // hehe nic nie zrobisz
    }

    console.log("Statystyki re-render")
    return(<>
        <p>Długość listy: {listaWyswietlana.length}</p>
    </>)
})

const StatystykiUseMemo = memo(function Statystyki({listaWyswietlana}) {
    console.log("Statystyki re-render");

    const dlugosc = useMemo(() => {
        const start = performance.now();
        while (performance.now() - start < 200) {
            // hehe nic nie zrobisz
        }

        return listaWyswietlana.length;
    }, [listaWyswietlana]);

    return <p>Długość listy: {dlugosc}</p>;
});
// Wersja z useMemo ma render komponentów App i Lista szybsze o 0.6ms


//------------------------------------------------------------------------------------------------------------



function ZmienMotyw(){
    const [motyw, setMotyw] = useState("jasny")

    const zmienMotyw = useCallback(() => {
        setMotyw(motyw === "jasny" ? "ciemny" : "jasny")
    }, [motyw])

    return(<>
        <p>Motyw: {motyw}</p>
        <button onClick={zmienMotyw}>Zmień motyw</button>
    </>)
}




export default Lista