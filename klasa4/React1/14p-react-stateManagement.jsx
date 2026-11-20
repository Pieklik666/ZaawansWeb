// React: Zarządzanie stanem - Redux i Zustand

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Komponent glowny wyswietla przyklady w kolejnosci materialu
export default function Przyklady() {
	return (
		<>
			<PrzykladCreateSlice />
			<PrzykladConfigureStore />
			<Provider store={store}>
				<PrzykladUseSelectorUseDispatch />
			</Provider>
			<PrzykladZustandCreate />
			<PrzykladZustandPersist />
		</>
	);
}

// Przyklad 1: createSlice (Redux Toolkit)
// Slice zawiera stan poczatkowy, reducer i automatycznie nazwana akcje.
// Immer pozwala zapisac mutacje w reducerze (state.value += 1).
const counterSlice = createSlice({
	name: 'counter',
	initialState: { value: 0 },
	reducers: {
		increment: (state) => {
			state.value += 1;
		},
	},
});

const { increment } = counterSlice.actions;
const counterReducer = counterSlice.reducer;

function PrzykladCreateSlice() {
	// Wynik: stan poczatkowy value = 0
	const stanPoczatkowy = counterSlice.getInitialState();
	// Wynik: po wywolaniu increment() value = 1
	const stanPo = counterReducer(stanPoczatkowy, increment());

	return (
		<div>
			<h2>Przyklad 1: createSlice (Redux Toolkit)</h2>
			<p>Wartosc przed increment: {stanPoczatkowy.value}</p>
			<p>Wartosc po increment: {stanPo.value}</p>
			<br /><br />
		</div>
	);
}

// Przyklad 2: configureStore
// Klucz "counter" w slowniku reducerow staje sie nazwa czesci stanu.
const store = configureStore({
	reducer: { counter: counterReducer },
});

function PrzykladConfigureStore() {
	// Wynik: {"counter":{"value":0}}
	return (
		<div>
			<h2>Przyklad 2: configureStore</h2>
			<p>store.getState(): {JSON.stringify(store.getState())}</p>
			<br /><br />
		</div>
	);
}

// Przyklad 3: useSelector i useDispatch (react-redux)
// Komponent wymaga Provider, ktory jest zapewniony w funkcji Przyklady.
function PrzykladUseSelectorUseDispatch() {
	// Odczyt wartosci ze store; komponent odswieza sie przy zmianie
	const wartosc = useSelector((state) => state.counter.value);
	const wyslij = useDispatch();

	// Wynik: po kazdym kliknieciu wartosc rosnie: 1, 2, 3
	return (
		<div>
			<h2>Przyklad 3: useSelector i useDispatch (react-redux)</h2>
			<p>Licznik: {wartosc}</p>
			<button onClick={() => wyslij(increment())}>+1</button>
			<br /><br />
		</div>
	);
}

// Przyklad 4: create (Zustand)
// Hook daje dostep do danych i funkcji store; provider nie jest potrzebny.
const useLicznikStore = create((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
	reset: () => set({ count: 0 }),
}));

function PrzykladZustandCreate() {
	// Selektory pobieraja pojedyncze elementy store
	const licznik = useLicznikStore((state) => state.count);
	const zwieksz = useLicznikStore((state) => state.increment);
	const resetuj = useLicznikStore((state) => state.reset);

	// Wynik: po trzech kliknieciach +1 i Reset widoczne Licznik: 0
	return (
		<div>
			<h2>Przyklad 4: create (Zustand)</h2>
			<p>Licznik: {licznik}</p>
			<button onClick={zwieksz}>+1</button>
			<button onClick={resetuj}>Reset</button>
			<br /><br />
		</div>
	);
}

// Przyklad 5: persist (Zustand)
// Stan zapisywany jest w localStorage pod kluczem "counter-storage".
const useLicznikTrwalyStore = create(
	persist(
		(set) => ({
			count: 0,
			increment: () => set((state) => ({ count: state.count + 1 })),
		}),
		{ name: 'counter-storage' }
	)
);

function PrzykladZustandPersist() {
	const licznik = useLicznikTrwalyStore((state) => state.count);
	const zwieksz = useLicznikTrwalyStore((state) => state.increment);

	// Wynik: wartosc zostaje po odswiezeniu strony
	return (
		<div>
			<h2>Przyklad 5: persist (Zustand)</h2>
			<p>Licznik: {licznik}</p>
			<button onClick={zwieksz}>+1</button>
			<br /><br />
		</div>
	);
}
