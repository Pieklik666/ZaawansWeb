import { useState } from "react";

function ListaProduktow() {
    const [listaProduktow, setListaProduktow] = useState([{id: 1, name: 'Product A', price: 10}, {id: 2, name: 'Product B', price: 20}, {id: 3, name: 'Product C', price: 30}]);
    
    return (
        <>
            <ul>
            {
                listaProduktow.map((p) => {
                    return (<li key={p.id}>{p.id} {p.name} for {p.price}$</li>)
                })
            }
            </ul>
        </>
    )
}

export default ListaProduktow;