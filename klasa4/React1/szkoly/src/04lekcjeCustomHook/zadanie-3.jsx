import { useState } from "react";

function useDebounce(wartosc, opoznienie) {
	const [opoznionaWartosc, setOpoznionaWartosc] = useState(wartosc);

	useEffect(() => {
		const timer = setTimeout(() => {
			setOpoznionaWartosc(wartosc);
		}, opoznienie);

		return () => clearTimeout(timer); 
	}, [wartosc, opoznienie]);

	return opoznionaWartosc;
}


function WyszukiwarkaUczniow() {
    
    return(<>
    
    </>)
}

export default WyszukiwarkaUczniow