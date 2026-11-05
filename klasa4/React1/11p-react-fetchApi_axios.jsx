import axios from "axios";
import { useEffect, useState } from "react";

function ListaWpisow() {
	const [wpisy, ustawWpisy] = useState([]);
	const [ladowanie, ustawLadowanie] = useState(true);
	const [blad, ustawBlad] = useState("");

	useEffect(() => {
		async function pobierzWpisy() {
			try {
				// fetch zwraca obietnice; await czeka na odpowiedz HTTP.
				const odpowiedz = await fetch(
					"https://jsonplaceholder.typicode.com/posts?_limit=5"
				);

				// Fetch nie odrzuca obietnicy dla statusu 404 lub innego bledu HTTP.
				if (!odpowiedz.ok) {
					throw new Error(`Blad HTTP: ${odpowiedz.status}`);
				}

				// Odczyt JSON jest asynchroniczny; wynik zapisuje sie w stanie.
				const dane = await odpowiedz.json();
				ustawWpisy(dane);
			} catch (bladZadania) {     
				// Oczekiwany wynik bledu: komunikat zamiast listy wpisow.
				ustawBlad(bladZadania.message);
			} finally {
				// Konczy ladowanie zarowno po sukcesie, jak i po bledzie.
				ustawLadowanie(false);
			}
		}

		// Pusta tablica zaleznosci uruchamia efekt po zamontowaniu.
		// W trybie deweloperskim Strict Mode moze uruchomic go ponownie.
		pobierzWpisy();
	}, []);

	if (ladowanie) return <p>Trwa ladowanie wpisow...</p>;
	if (blad) return <p role="alert">Blad pobierania: {blad}</p>;

	return (
		<section>
			<h2>Fetch API - wpisy</h2>
			<p>Oczekiwany wynik: lista maksymalnie pieciu tytulow wpisow.</p>
			<ul>
				{wpisy.map((wpis) => (
					<li key={wpis.id}>{wpis.title}</li>
				))}
			</ul>
		</section>
	);
}


function ListaUzytkownikow() {
	const [uzytkownicy, ustawUzytkownikow] = useState([]);
	const [ladowanie, ustawLadowanie] = useState(true);
	const [blad, ustawBlad] = useState("");

	useEffect(() => {
		async function pobierzUzytkownikow() {
			try {
				// Axios wysyla zadanie GET do publicznego API.
				const odpowiedz = await axios.get(
					"https://jsonplaceholder.typicode.com/users"
				);

				// Axios przekazuje tresc JSON we wlasciwosci data.
				ustawUzytkownikow(odpowiedz.data);
			} catch (bladZadania) {
				// Axios zglasza blad dla statusow spoza zakresu 2xx.
				ustawBlad(
					bladZadania.response?.status
						? `Blad HTTP: ${bladZadania.response.status}`
						: "Nie udalo sie polaczyc z serwerem."
				);
			} finally {
				// Oczekiwany wynik: po zakonczeniu znika komunikat ladowania.
				ustawLadowanie(false);
			}
		}

		// Pobranie tylko odczytuje dane, wiec ponowne wykonanie jest bezpieczne.
		pobierzUzytkownikow();
	}, []);

	if (ladowanie) return <p>Trwa ladowanie uzytkownikow...</p>;
	if (blad) return <p role="alert">{blad}</p>;

	return (
		<section>
			<h2>Axios - uzytkownicy</h2>
			<p>
				Oczekiwany wynik: imie, e-mail i miasto kazdego uzytkownika.
			</p>
			<ul>
				{uzytkownicy.map((uzytkownik) => (
					<li key={uzytkownik.id}>
						{uzytkownik.name} - {uzytkownik.email} -{" "}
						{uzytkownik.address.city}
					</li>
				))}
			</ul>
		</section>
	);
}


function Aplikacja() {
	return (
		<main>
			<h1>Fetch API i Axios</h1>
			<p>
				Zadania sprawdzisz w narzedziach deweloperskich przegladarki,
				w zakladce Network.
			</p>
			<ListaWpisow />
			<ListaUzytkownikow />
		</main>
	);
}

export default Aplikacja;
