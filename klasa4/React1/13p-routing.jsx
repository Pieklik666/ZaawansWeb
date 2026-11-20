// React: Routing z React Router

// Uruchomienie: npm install react-router-dom, a nastepnie import komponentu Przyklady
// w pliku main.jsx i renderowanie go w aplikacji React.

import { useState } from 'react';
import {
	BrowserRouter,
	Routes,
	Route,
	Link,
	useNavigate,
	useParams,
} from 'react-router-dom';

export default function Przyklady() {
	// Wszystkie przyklady dzialaja wewnatrz jednego BrowserRouter
	return (
		<BrowserRouter>
			<PrzykladMenu />
			<PrzykladTrasy />
			<PrzykladNawigacja />
			<PrzykladParametry />
			<PrzykladFormularz />
		</BrowserRouter>
	);
}

// Przyklad 1: Menu z Link - zmiana adresu bez przeladowania strony
function PrzykladMenu() {
	return (
		<>
			<h2>Przykład 1: Menu z Link</h2>
			<nav>
				{/* Link zmienia adres bez przeladowania strony (w odroznieniu od <a href>) */}
				<Link to="/">Strona główna</Link> | <Link to="/about">O aplikacji</Link>
			</nav>
			{/* Wynik: po kliknieciu linku zmienia sie adres, strona sie nie przeladowuje */}
			<br />
			<br />
		</>
	);
}

// Przyklad 2: Trasy Routes i Route - wyswietlanie komponentu dla adresu
function PrzykladTrasy() {
	return (
		<>
			<h2>Przykład 2: Trasy Routes i Route</h2>
			{/* Routes wybiera pierwsza trase pasujaca do aktualnego adresu */}
			<Routes>
				<Route path="/" element={<h3>Strona główna</h3>} />
				<Route path="/about" element={<h3>O aplikacji</h3>} />
				<Route path="/tasks" element={<h3>Lista zadań</h3>} />
			</Routes>
			{/* Wynik: dla adresu /about wyswietlany jest naglowek "O aplikacji" */}
			<br />
			<br />
		</>
	);
}

// Przyklad 3: Nawigacja z kodu - useNavigate
function PrzykladNawigacja() {
	// useNavigate zwraca funkcje przechodzaca do trasy z poziomu kodu
	const nawiguj = useNavigate();

	return (
		<>
			<h2>Przykład 3: Nawigacja z kodu (useNavigate)</h2>
			{/* Klikniecie przycisku przechodzi do /tasks */}
			<button type="button" onClick={() => nawiguj('/tasks')}>
				Przejdź do zadań
			</button>
			{/* Wynik: adres zmienia sie na /tasks, pojawia sie naglowek "Lista zadań" */}
			<br />
			<br />
		</>
	);
}

// #region Przykład 4: Parametr ścieżki (useParams)
// Komponent odczytuje parametr taskId z aktualnej trasy
function SzczegolyZadania() {
	// useParams zwraca obiekt z parametrami ścieżki; wartości są zawsze tekstem
	const { taskId } = useParams();

	return <p>Szczegóły zadania: {taskId}</p>;
}

// Trasa z parametrem: dwukropek przed nazwa parametru jest obowiazkowy
function PrzykladParametry() {
	return (
		<>
			<h2>Przykład 4: Parametr ścieżki (useParams)</h2>
			<Routes>
				<Route path="/tasks/:taskId" element={<SzczegolyZadania />} />
			</Routes>
			{/* Wynik: dla adresu /tasks/7 wyswietlane jest "Szczegóły zadania: 7" */}
			<br />
			<br />
		</>
	);
}
// #endregion

// Przyklad 5: Formularz z przejsciem do zadania
function PrzykladFormularz() {
	const nawiguj = useNavigate();
	const [identyfikator, ustawIdentyfikator] = useState('');

	function obsluzWyslanie(zdarzenie) {
		// Zapobiega przeladowaniu strony po wyslaniu formularza
		zdarzenie.preventDefault();

		// Dla pustego pola nie nastepuje przejscie
		if (identyfikator.trim() === '') {
			return;
		}

		nawiguj(`/tasks/${encodeURIComponent(identyfikator)}`);
	}

	return (
		<>
			<h2>Przykład 5: Formularz z przejściem do zadania</h2>
			<form onSubmit={obsluzWyslanie}>
				<label>
					Identyfikator zadania:{' '}
					<input
						value={identyfikator}
						onChange={(zdarzenie) => ustawIdentyfikator(zdarzenie.target.value)}
					/>
				</label>
				<button type="submit">Otwórz</button>
			</form>
			{/* Wynik: wpisanie 7 i wyslanie przechodzi do /tasks/7 */}
			<br />
			<br />
		</>
	);
}
