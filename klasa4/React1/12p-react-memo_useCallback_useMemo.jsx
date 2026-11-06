import { memo, useCallback, useMemo, useState } from 'react';

export default function Przyklady() {
	return (
		<>
			<PrzykladRerender />
			<PrzykladReferencje />
			<PrzykladMemo />
			<PrzykladUseCallback />
			<PrzykladUseMemo />
			<PrzykladFiltrowanie />
		</>
	);
}

function WypiszGodzineRenderowania({ element }) {
	const godzina = (new Date()).toLocaleTimeString();

	return <p>Godzina renderowania {element}: {godzina}</p>;
}

// #region Przykład 1: Re-render po zmianie stanu
function PrzykladRerender() {
	const [licznik, setLicznik] = useState(0);

	// Każda zmiana stanu w rodzicu wywołuje ponowny render dzieci
	console.log('\nRender rodzica');

	return (
		<section>
			<h2>1. Re-render po zmianie stanu</h2>
			<p>Licznik: {licznik}</p>
			<WypiszGodzineRenderowania element="PrzykladRerender" />
			<button onClick={() => setLicznik(licznik + 1)}>Zwiększ</button>
			<PotomekBezMemo />
			<br /><br />
		</section>
	);
}

function PotomekBezMemo() {
	// Wynik w konsoli przy każdej zmianie stanu: "Render PotomekBezMemo"
	console.log('Render PotomekBezMemo');

	return (<>
		<p>Komponent potomny bez React.memo</p>
		<WypiszGodzineRenderowania element="PotomekBezMemo" />
	</>);
}
// #endregion

// #region Przykład 2: Równość referencji
function PrzykladReferencje() {
	const funkcjaA = () => 'wynik';
	const funkcjaB = () => 'wynik';
	const obiektA = { imie: 'Ala' };
	const obiektB = { imie: 'Ala' };

	// Wynik: false - identyczne funkcje i obiekty mają różne referencje
	const czyFunkcjeRowne = funkcjaA === funkcjaB;
	const czyObiektyRowne = obiektA === obiektB;

	return (
		<section>
			<h2>2. Równość referencji</h2>
			<p>funkcjaA === funkcjaB: {String(czyFunkcjeRowne)}</p>
			<p>obiektA === obiektB: {String(czyObiektyRowne)}</p>
			<WypiszGodzineRenderowania element="PrzykladReferencje" />
			<br /><br />
		</section>
	);
}
// #endregion

// #region Przykład 3: React.memo
const EtykietaZMemo = memo(function EtykietaZMemo({ tekst }) {
	// Log pojawia się tylko wtedy, gdy zmienia się prop "tekst"
	console.log('Render EtykietaZMemo:', tekst);

	return (<>
		<p>Etykieta: {tekst}</p>
		<WypiszGodzineRenderowania element="EtykietaZMemo" />
	</>);
});

function PrzykladMemo() {
	const [licznik, setLicznik] = useState(0);

	return (
		<section>
			<h2>3. React.memo</h2>
			<p>Licznik: {licznik}</p>
			<button onClick={() => setLicznik(licznik + 1)}>Zwiększ licznik</button>
			<WypiszGodzineRenderowania element="PrzykladMemo" />
			<EtykietaZMemo tekst="Stały tekst" />
			<br /><br />
		</section>
	);
}
// #endregion

// #region Przykład 4: useCallback i stabilna funkcja dla potomka
const PrzyciskZMemo = memo(function PrzyciskZMemo({ fnClick, etykieta }) {
	// Log pojawia się tylko przy zmianie propsów przycisku
	console.log('Render PrzyciskZMemo:', etykieta);

	return (<>
		<WypiszGodzineRenderowania element="PrzyciskZMemo" />
		<button onClick={fnClick}>{etykieta}</button>
	</>);
});

function PrzykladUseCallback() {
	const [licznik, setLicznik] = useState(0);

	// Ta sama referencja funkcji przy każdym renderze - memo działa poprawnie
	const zwieksz = useCallback(() => setLicznik((p) => p + 1), []);

	return (
		<section>
			<h2>4. useCallback i stabilna funkcja dla potomka</h2>
			<p>Licznik: {licznik}</p>
			<WypiszGodzineRenderowania element="PrzykladUseCallback" />
			<PrzyciskZMemo etykieta="Dodaj" fnClick={zwieksz} />
			<br /><br />
		</section>
	);
}
// #endregion

// #region Przykład 5: useMemo - zapamiętany wynik obliczeń
function PrzykladUseMemo() {
	const [n, setN] = useState(3);
	const [kolor, setKolor] = useState('niebieski');

	// Obliczenie wykonuje się tylko po zmianie n, nie po zmianie koloru
	const kwadrat = useMemo(() => {
		console.log('Liczenie kwadratu dla n =', n);
		return n * n;
	}, [n]);

	const zmienKolor = () => {
		setKolor(kolor === 'niebieski' ? 'zielony' : 'niebieski');
	};

	return (
		<section>
			<h2>5. useMemo - zapamiętany wynik obliczeń</h2>
			<p>n = {n}, kwadrat = {kwadrat}</p>
			<p>Kolor: {kolor}</p>
			<button onClick={() => setN(n + 1)}>Zwiększ n</button>
			<button onClick={zmienKolor}>Zmień kolor</button>
			<WypiszGodzineRenderowania element="PrzykladUseMemo" />
			<br /><br />
		</section>
	);
}
// #endregion

// #region Przykład 6: useMemo - filtrowanie listy
function PrzykladFiltrowanie() {
	const produkty = ['Jabłko', 'Banan', 'Gruszka', 'Ananas', 'Kiwi'];
	const [fraza, setFraza] = useState('');

	// Dla frazy "an" wynik: Banan, Ananas
	const przefiltrowane = useMemo(() => {
		const frazaMala = fraza.toLowerCase();
		return produkty.filter((p) => p.toLowerCase().includes(frazaMala));
	}, [fraza]);

	return (
		<section>
			<h2>6. useMemo - filtrowanie listy</h2>
			<input value={fraza} onChange={(e) => setFraza(e.target.value)} />
			<p>Znaleziono: {przefiltrowane.length}</p>
			<ul>
				{przefiltrowane.map((p) => (
					<li key={p}>{p}</li>
				))}
			</ul>
			<WypiszGodzineRenderowania element="PrzykladFiltrowanie" />
			<br /><br />
		</section>
	);
}
// #endregion
