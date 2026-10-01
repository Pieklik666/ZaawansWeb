import { useState } from "react";

function CounterLogic(initialValue = 0) {
    const [value, setValue] = useState(initialValue)

    
}



function CounterRender(OnIncrement, OnDecrement, initialValue) {
    
    return (
        <>
            Obecna wartość: {initialValue}
            <button onClick={OnIncrement}>Zwiększ</button>
            <button onClick={OnDecrement}>Zmiejsz</button>
        </>
    )
}



export default CounterRender;