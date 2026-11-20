import {create} from "zustand"

const useLicznikStore = create((set) => ({
	count: 10,
	decrement: () => set((state) => ({ 
		count: (state.count > 0) ? state.count - 1 : state.count
	})),
}));

function Zadanie1() {
	const licznik = useLicznikStore((state) => state.count)
	const zmniejsz = useLicznikStore((state) => state.decrement)

	return (<>
		{licznik}
		<button onClick={zmniejsz}>-</button>
	</>);
}

export default Zadanie1;