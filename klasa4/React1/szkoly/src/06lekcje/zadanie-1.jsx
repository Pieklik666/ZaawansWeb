import { useState, useEffect } from "react"

function ZegarCyfrowy(){
    const [czas, setCzas] = useState(new Date().getTime())

    
	useEffect(() => {
    	const interval = setInterval(() => {
			setCzas(czas + 1000);
		}, 1000);
        
		return () => {
			clearInterval(interval);
		};
	});
    
    return (
        <>
            Czas: {new Date(czas).toLocaleTimeString()}
        </>
    )
}
export default ZegarCyfrowy