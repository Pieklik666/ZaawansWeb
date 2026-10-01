/* Niezbędne biblioteki react
npm install typescript vite create-vite create-react-app react prop-types react-hook-form react-jsx-runtime react-dom react-router-dom axios redux framer-motion redis @babel/core @babel/preset-react @types/react @types/react-dom @vitejs/plugin-react eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
*/
// #region Informacje ogólne
/*
 * Temat: Komponenty Funkcyjne w React
 *
 * Cel lekcji:
 * - Zrozumieć różnicę między komponentami funkcyjnymi a klasowymi
 * - Nauczyć się tworzyć komponenty jako czyste funkcje JavaScript
 * - Opanować używanie hooks'ów (useState, useEffect) w komponentach funkcyjnych
 * - Zrozumieć, dlaczego współczesny React preferuje komponenty funkcyjne
 *
 * Przejście z Angulara do React:
 * - W Angularze: komponenty to klasy z dekoratorami (@Component)
 * - W React: komponenty to funkcje zwracające JSX
 * - Angular używa wiązania danych, a React props i state
 */

/*
 * Props (properties) to dane przekazywane do komponentów.
 *
 * Cechy props:
 * - Tylko do odczytu (immutable) - NIE można ich modyfikować
 * - Przepływ jednokierunkowy: rodzic → dziecko
 * - Mogą być dowolnego typu: string, number, object, array, function
 * - Pozwalają na konfigurację i wielokrotne użycie komponentów
 * - Podobne do argumentów funkcji
 *
 * Zasady:
 * - Nigdy nie modyfikuj props wewnątrz komponentu
 * - Komponent powinien być "pure" - te same props = ten sam wynik
 */

/* Czym jest stan (state)?
 * Stan to dane, ktore sa przechowywane wewnatrz komponentu i moga sie zmieniac
 * w czasie dzialania aplikacji. Gdy stan sie zmienia, React automatycznie
 * przerysowuje (re-renderuje) komponent, aby pokazac uzytkownikowi nowe dane.
 *
 * Przyklad z zycia:
 * Wyobraz sobie tablice z liczba obecnych uczniow w klasie.
 * Na poczatku jest np. 20 osob. Gdy ktos wychodzi, liczba zmienia sie na 19.
 * Tablica (ekran) sie aktualizuje. To wlasnie dziala stan w React! Do ustawiania
 * i odczytywania służy useState()
 *
 * const [wartosc, ustawWartosc] = useState(wartoscPoczatkowa);
 * - wartosc: aktualna wartość stanu
 * - ustawWartosc: funkcja do aktualizacji stanu
 * - useState: hook, który inicjalizuje stan (wartoscPoczatkowa) i zwraca parę [aktualnyStan, funkcja]
 */

/*
 * Instalacja i konfiguracja:
 * - Node.js i npm powinny być zainstalowane
 * - Projekt React można stworzyć komendą Vite: 'npm create vite@latest my-app --template react'
 * - Alternatywa: npx create-react-app my-app
 */
// #endregion

// #region Przykłady
/*
 * Przykład 1: Prosty komponent funkcyjny
 */
function Welcome(props) {
	return <h1>Cześć, {props.name}!</h1>;
}

/*
 * Przykład 2: Komponent funkcyjny z destructuring props
 */
function Greeting({ name, age }) {
	return (
		<div>
			<p>Imię: {name}</p>
			<p>Wiek: {age}</p>
		</div>
	);
}

/*
 * Przykład 3: Komponent z useState hook
 */

function Counter() {
	const wartoscPoczatkowa = 0;
	const [count, setCount] = useState(wartoscPoczatkowa);

	return (
		<div>
			<p>Licznik: {count}</p>
			<button onClick={() => setCount(count + 1)}>Zwiększ</button>
		</div>
	);
}

/*
 * Przykład 4: Komponent z useEffect hook
 */

function DataFetcher() {
	const [data, setData] = useState(null); // null czyli brak wartości początkowej
	const [loading, setLoading] = useState(true); // wartość początkowa to true, bo zaczynamy od ładowania

	useEffect(() => {
		fetch('https://api.example.com/data')
			.then(res => res.json())
			.then(result => {
				setData(result);
				setLoading(false);
			});
	}, []);

	if (loading) return <p>Ładowanie...</p>;
	return <div>{JSON.stringify(data)}</div>;
}

/*
 * Przykład 5: Arrow function komponent (ES6)
 */
const ProductCard = ({ title, price }) => (
	<div className="card">
		<h3>{title}</h3>
		<p>${price}</p>
	</div>
);
// #endregion

// #region Zadania praktyczne
/*	Odpowiedzi do zadań proszę zapisać:
	w formacie 'zadanie-X.js' (X to numer zadania np. 'zadanie-1.js')
	w katalogu 'W:\numerKlasy\przedmiot\data-nazwaPlikuBezRozszerzenia\ImieNazwisko\'
		np. 'W:\1a\algorytmy\20260325-10-tabliceJednowymiarowe\JanKowalski\zadanie-1.js'
	Nie wrzucaj katalogu 'node_modules' ani innych zbędnych (zwłaszcza dużych)
		katalogów, tylko same pliki z rozwiązaniami
*/

/*	Zadanie praktyczne 1: Stwórz komponent Button
 *
 * Treść:
 * Utwórz komponent funkcyjny o nazwie "StyledButton", który:
 * - Przyjmuje props: label (tekst przycisku), onClick (funkcja callback), disabled (czy przycisk jest wyłączony)
 * - Renderuje przycisk HTML z przyjętymi właściwościami
 * - Zmienia kolor na szary, jeśli disabled=true
 *
 * Instrukcje:
 * 1. Stwórz funkcję StyledButton
 * 2. Destructure props w parametrze funkcji
 * 3. Zwróć element <button> z odpowiednimi atrybutami
 * 4. Przetestuj komponent w App.js
 *
 * Oczekiwany rezultat:
 * <StyledButton label="Kliknij mnie" onClick={() => alert('Klik!')} disabled={false} />
 */

/*	Zadanie praktyczne 2: Komponent z useState - Todo Item
 *
 * Treść:
 * Utwórz komponent "TodoItem", który:
 * - Wyświetla zadanie i checkbox
 * - Pozwala zaznaczyć zadanie jako wykonane (zmienia tekst na przekreślony)
 * - Pokazuje przycisk do usunięcia zadania
 *
 * Instrukcje:
 * 1. Użyj useState do zarządzania stanem "ukończenia" zadania
 * 2. Dodaj klasę CSS dla przekreślonego tekstu
 * 3. Przekaż callback onDelete do komponentu rodzica
 *
 * Oczekiwany rezultat:
 * Możliwość zaznaczania/odznaczania zadań i ich usuwania
 */

/*	Zadanie praktyczne 3: Komponent Form z wieloma polami
 *
 * Treść:
 * Utwórz komponent "UserForm", który:
 * - Zawiera pola: imię, email, hasło
 * - Zarządza stanem dla każdego pola oddzielnie
 * - Wyświetla błędy walidacji (email musi zawierać @, hasło minimum 8 znaków)
 * - Wysyła dane podciśnięciu przycisku "Wyślij"
 *
 * Instrukcje:
 * 1. Użyj pojedynczego obiektu w useState lub kilka useState dla każdego pola
 * 2. Utwórz funkcję handleChange do aktualizacji stanu
 * 3. Utwórz funkcję handleSubmit z validacją
 * 4. Wyświetl błędy koniecznie pod każdym polem
 *
 * Oczekiwany rezultat:
 * Funkcjonalny formularz z walidacją i submitem
 */

/*	Zadanie praktyczne 4: Lista dynamiczna z map()
 *
 * Treść:
 * Utwórz komponent "UserList", który:
 * - Przyjmuje prop users (tablica obiektów: id, name, email)
 * - Renderuje listę użytkowników używając .map()
 * - Każdy element listy to osobny komponent "UserListItem"
 * - Dodaj możliwość filtrowania użytkowników po imieniu
 *
 * Instrukcje:
 * 1. Stwórz dwa komponenty: UserList i UserListItem
 * 2. W UserList użyj useState dla filtra
 * 3. Filtruj tablicę users w zależności od wartości filtra
 * 4. Renderuj UserListItem dla każdego użytkownika
 *
 * Oczekiwany rezultat:
 * Lista użytkowników z działającym polem filtrowania
 */

/*	Zadanie praktyczne 5: Komponent z useEffect - Zegar
 *
 * Treść:
 * Utwórz komponent "Clock", który:
 * - Wyświetla aktualny czas i aktualizuje się co sekundę
 * - Używa useEffect do uruchomienia interwału
 * - Czyszcze interwał po unmouncie komponentu
 * - Ma przycisk START/STOP do kontroli zegara
 *
 * Instrukcje:
 * 1. Użyj useState dla aktualnego czasu
 * 2. W useEffect ustaw setInterval
 * 3. Zwróć cleanup function, która czyści interval
 * 4. Dodaj state dla isRunning i przycisk do kontroli
 *
 * Oczekiwany rezultat:
 * Zegar wyświetlający bieżący czas, który można uruchamiać/zatrzymywać
 * Brak memory leaks (interwał jest czyszczony)
 */

// #endregion
