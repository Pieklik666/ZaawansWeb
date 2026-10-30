 # Custom Hooks w React

## Cel lekcji

W tej lekcji nauczysz się tworzyć własne hooki w React — tzw. Custom Hooks. Pozwalają one wydzielać powtarzającą się logikę z komponentów i wielokrotnie jej używać.

Wyobraź sobie, że w kilku miejscach aplikacji szkoły musisz pobierać dane uczniów z serwera oraz obsługiwać stan ładowania i błędy. Zamiast powielać ten sam kod w każdym komponencie, możesz wydzielić go do jednego hooka.

### Po tej lekcji będziesz umiał

- Wyjaśnić, czym są Custom Hooks i dlaczego warto je stosować.
- Tworzyć własne hooki według konwencji `useNazwa`.
- Wydzielać logikę z komponentów do hooków.
- Używać hooków `useState` i `useEffect` wewnątrz własnych hooków.
- Tworzyć hooki wielokrotnego użytku dla systemu zarządzania szkołą.
- Rozpoznać, kiedy warto utworzyć Custom Hook, a kiedy nie jest to potrzebne.

## Czym są Custom Hooks?

Custom Hook to zwykła funkcja JavaScript, która:

1. Zaczyna się od słowa `use`, np. `useStudents`, `useFetch`, `useForm`.
2. Może używać wbudowanych hooków Reacta, np. `useState`, `useEffect` i `useContext`.
3. Zwraca dane lub funkcje potrzebne komponentowi.

Konwencja nazewnictwa zaczynająca się od `use` jest ważna. React rozpoznaje w ten sposób hooki i stosuje do nich zasady hooków.

Przykład prostego Custom Hooka:

```jsx
function useCounter() {
	const [count, setCount] = useState(0);
	const increment = () => setCount(c => c + 1);
	const decrement = () => setCount(c => c - 1);
	return { count, increment, decrement };
}
```

Możesz użyć `useCounter()` w dowolnym komponencie.

## Dlaczego Custom Hooks są przydatne?

Wyobraź sobie system szkolny bez Custom Hooks:

- `ListaUczniów.jsx` zawiera logikę pobierania uczniów z API.
- `ListaNauczycieli.jsx` zawiera taką samą logikę pobierania z API.
- `ListaKlas.jsx` zawiera taką samą logikę pobierania z API.

Powtarzanie tego samego kodu w kilku miejscach narusza zasadę DRY (*Don't Repeat Yourself*). Jeśli trzeba zmienić np. obsługę błędów, należy zmienić kod w każdym komponencie.

Z Custom Hooks:

- `useFetch.js` zawiera jedną implementację logiki pobierania danych.
- `ListaUczniów.jsx` używa `useFetch` i wyświetla dane.
- `ListaNauczycieli.jsx` używa `useFetch` i wyświetla dane.
- `ListaKlas.jsx` używa `useFetch` i wyświetla dane.

Zmianę wprowadzasz raz, w jednym pliku.

## Zasady Custom Hooks — Rules of Hooks

Custom Hooks muszą przestrzegać tych samych zasad co zwykłe hooki:

1. Zawsze zaczynaj nazwę od `use`, np. `useStudents`, `useFetch`, `useLocalStorage`.
2. Wywołuj hooki tylko na najwyższym poziomie funkcji — nie wewnątrz `if`, `for` itp.
3. Wywołuj hooki tylko w komponentach React lub innych hookach, a nie w zwykłych funkcjach.
4. Każde wywołanie Custom Hooka tworzy oddzielny, niezależny stan. Dwa komponenty używające tego samego hooka nie dzielą stanu.

Niepoprawny przykład — hook wewnątrz instrukcji `if`:

```jsx
function useExample() {
	if (warunek) {
		const [state, setState] = useState(); // Błąd: hook wewnątrz if
	}
}
```

## Kiedy tworzyć Custom Hook?

Stwórz Custom Hook, gdy:

- Ten sam kod, np. `useState` i `useEffect`, pojawia się w kilku komponentach.
- Chcesz wydzielić skomplikowaną logikę, aby uprościć komponent.
- Chcesz przetestować logikę niezależnie od widoku.
- Logika dotyczy zachowania, a nie wyglądu, np. pobierania danych lub walidacji.

Nie twórz Custom Hooka, gdy:

- Logika jest prosta i używana tylko raz.
- Potrzebujesz tylko funkcji pomocniczej, która nie używa hooków Reacta — wystarczy wtedy zwykła funkcja.

## Schemat tworzenia Custom Hooka

Każdy Custom Hook ma podobny schemat:

```jsx
// 1. Nazwa zaczyna się od 'use'
function useNazwaHooka(parametryWejściowe) {
	// 2. Używamy wbudowanych hooków
	const [stan, setStan] = useState(wartośćPoczątkowa);

	// 3. Dodajemy efekty lub funkcje
	useEffect(() => {
		// logika efektu
	}, [zależności]);

	const funkcjaPomocnicza = () => {
		// logika
	};

	// 4. Zwracamy to, czego potrzebuje komponent
	return { stan, funkcjaPomocnicza };
}
```

## `useState` w Custom Hooku

**Skrót:** `useState(wartośćPoczątkowa)`
**Opis:** przechowuje stan wewnątrz hooka. Działa tak samo jak w komponencie.

Przykład:

```jsx
function useToggle(wartoscPoczątkowa = false) {
	// Stan przechowujący wartość true/false
	const [wartosc, setWartosc] = useState(wartoscPoczątkowa);

	// Funkcja odwracająca aktualną wartość
	const toggle = () => setWartosc(poprzednia => !poprzednia);

	return [wartosc, toggle]; // Zwracamy tablicę, podobnie jak useState
	// Wynik początkowy: [false, funkcjaToggle]
}
```

Użycie w komponencie:

```jsx
function KomponentMenu() {
	const [menuOtwarte, toggleMenu] = useToggle(false);
	return (
		<div>
			<button onClick={toggleMenu}>Menu</button>
			{menuOtwarte && <nav>Nawigacja</nav>}
		</div>
	);
}
```

## `useEffect` w Custom Hooku

**Skrót:** `useEffect(funkcja, [zależności])`
**Opis:** wykonuje efekty uboczne, np. pobieranie danych, wewnątrz hooka.

Przykład hooka śledzącego szerokość okna:

```jsx
function useWindowWidth() {
	const [szerokosc, setSzerokosc] = useState(window.innerWidth);
	// Początkowa wartość to aktualna szerokość okna przeglądarki

	useEffect(() => {
		const handleResize = () => setSzerokosc(window.innerWidth);
		window.addEventListener('resize', handleResize);

		// Usuwamy nasłuchiwanie, gdy komponent jest niszczony
		return () => window.removeEventListener('resize', handleResize);
	}, []); // Pusta tablica: efekt uruchamia się tylko przy montowaniu

	return szerokosc; // np. 1440
}
```

**Zadanie:** Stwórz Custom Hook `useDocumentTitle`, który przyjmuje tekst i ustawia go jako tytuł karty przeglądarki (`document.title = tekst`). Użyj `useEffect` wewnątrz hooka.

## Zwracanie wartości z Custom Hooka

Custom Hook może zwracać dowolną wartość: pojedynczą wartość, obiekt, tablicę lub funkcję.

Konwencje zwracania:

1. **Tablica** — gdy zwracasz wartość i setter albo wartość i funkcję `toggle`:

```jsx
return [wartosc, setWartosc]; // const [val, setVal] = useHook()
```

2. **Obiekt** — gdy zwracasz wiele różnych wartości:

```jsx
return { dane, loading, error, odśwież };
// const { dane, loading } = useHook()
```

3. **Pojedyncza wartość** — gdy hook oblicza jedną rzecz:

```jsx
return obliczonaWartosc; // const wartosc = useHook()
```

Przykład zwracania obiektu:

```jsx
import { useState } from 'react';

function useFetch(url) {
	const [dane, setDane] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// ... logika pobierania

	return { dane, loading, error };
	// Użycie: const { dane, loading, error } = useFetch('/api/uczniowie')
}
```

## Przykład 1 — `useLocalStorage`: zapisywanie danych w przeglądarce

`localStorage` to miejsce w przeglądarce, w którym możemy zapisywać dane pozostające tam nawet po odświeżeniu strony. Ten hook działa jak `useState`, ale dodatkowo synchronizuje dane z `localStorage`.

`src/hooks/useLocalStorage.js`:

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(klucz, wartoscPoczatkowa) {
	// Sprawdzamy, czy w localStorage jest już wartość
	const [przechowywanaWartosc, setPrzechowywanaWartosc] = useState(() => {
		try {
			const element = window.localStorage.getItem(klucz);
			// Jeśli wartość istnieje, parsujemy JSON; w przeciwnym razie używamy początkowej
			return element ? JSON.parse(element) : wartoscPoczatkowa;
		} catch (blad) {
			console.warn('Błąd odczytu z localStorage:', blad);
			return wartoscPoczatkowa;
		}
	});

	// Synchronizujemy stan z localStorage przy każdej zmianie wartości
	useEffect(() => {
		try {
			window.localStorage.setItem(klucz, JSON.stringify(przechowywanaWartosc));
		} catch (blad) {
			console.warn('Błąd zapisu do localStorage:', blad);
		}
	}, [klucz, przechowywanaWartosc]);

	// Zwracamy to samo co useState, aby hook można było używać w taki sam sposób
	return [przechowywanaWartosc, setPrzechowywanaWartosc];
}

export default useLocalStorage;
```

Użycie w komponencie szkoły:

```jsx
import useLocalStorage from './hooks/useLocalStorage';

function UstawieniaUżytkownika() {
	const [motyw, setMotyw] = useLocalStorage('motyw-szkoła', 'jasny');
	const [język, setJęzyk] = useLocalStorage('język-szkoła', 'pl');

	return (
		<div>
			<p>Aktualny motyw: {motyw}</p>
			<button onClick={() => setMotyw('ciemny')}>Ciemny motyw</button>
			<button onClick={() => setMotyw('jasny')}>Jasny motyw</button>
		</div>
	);
	// Po odświeżeniu strony motyw zostanie zachowany
}
```

### Zadanie do przykładu 1

Używając hooka `useLocalStorage`, stwórz komponent `UlubioneKlasy`, który:

- Wyświetla listę ulubionych klas ucznia, np. `['1A', '2B']`.
- Ma przycisk „Dodaj klasę”, który pokazuje pole `input`.
- Zapisuje ulubione klasy w `localStorage` pod kluczem `ulubione-klasy`.
- Zachowuje listę klas po odświeżeniu strony.

## Przykład 2 — `useFetch`: pobieranie danych z API

Ten hook przydaje się w systemie szkolnym, w którym dane pobieramy z serwera. Zamiast powtarzać kod `fetch` oraz obsługę `error` i `loading` w każdym komponencie, używamy jednego hooka.

`src/hooks/useFetch.js`:

```jsx
import { useState, useEffect, useCallback } from 'react';

function useFetch(url) {
	const [dane, setDane] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// useCallback zapobiega nieskończonej pętli — fetchDane nie zmienia się przy każdym renderze
	const fetchDane = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const odpowiedz = await fetch(url);
			if (!odpowiedz.ok) {
				throw new Error(`Błąd HTTP: ${odpowiedz.status}`);
			}

			const json = await odpowiedz.json();
			setDane(json);
		} catch (blad) {
			setError(blad.message);
		} finally {
			setLoading(false);
		}
	}, [url]);

	useEffect(() => {
		fetchDane();
	}, [fetchDane]); // Uruchamiamy ponownie, gdy zmieni się URL

	return { dane, loading, error, odśwież: fetchDane };
}

export default useFetch;
```

Użycie w komponentach szkoły:

```jsx
function ListaUczniów() {
	const { dane: uczniowie, loading, error, odśwież } = useFetch('/api/uczniowie');

	if (loading) return <p>Ładowanie uczniów...</p>;
	if (error) return <p>Błąd: {error} <button onClick={odśwież}>Spróbuj ponownie</button></p>;

	return (
		<ul>
			{uczniowie?.map(uczeń => (
				<li key={uczeń.id}>{uczeń.imię} {uczeń.nazwisko} — Klasa: {uczeń.klasa}</li>
			))}
		</ul>
	);
}

function ListaNauczycieli() {
	// Każde wywołanie hooka ma własny stan
	const { dane: nauczyciele, loading, error } = useFetch('/api/nauczyciele');

	if (loading) return <p>Ładowanie nauczycieli...</p>;
	if (error) return <p>Błąd: {error}</p>;

	return (
		<ul>
			{nauczyciele?.map(n => (
				<li key={n.id}>{n.imię} {n.nazwisko} — {n.przedmiot}</li>
			))}
		</ul>
	);
}
```

### Zadanie do przykładu 2

Używając hooka `useFetch`, stwórz komponent `SzczegolyUcznia`, który:

- Przyjmuje props `id` (numer ID ucznia).
- Pobiera dane z URL `/api/uczniowie/{id}` za pomocą `useFetch`.
- Wyświetla stan ładowania podczas pobierania.
- Wyświetla komunikat błędu, jeśli coś pójdzie nie tak.
- Po załadowaniu wyświetla imię, nazwisko, klasę i oceny ucznia.
- Ma przycisk „Odśwież”, który ponownie pobiera dane.

## Przykład 3 — `useForm`: obsługa formularzy szkolnych

Formularze są ważną częścią systemu szkolnego, np. przy dodawaniu uczniów i ocen. Ten hook upraszcza obsługę wartości, walidacji i wysyłania formularza.

`src/hooks/useForm.js`:

```jsx
import { useState } from 'react';

function useForm(wartosciPoczatkowe, walidacja) {
	const [wartosci, setWartosci] = useState(wartosciPoczatkowe);
	const [bledy, setBledy] = useState({});
	const [wysylanie, setWysylanie] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setWartosci(poprzednie => ({
			...poprzednie, // Kopiujemy wszystkie poprzednie wartości
			[name]: value // Nadpisujemy tylko zmienione pole
		}));

		if (bledy[name]) {
			setBledy(poprzednie => ({ ...poprzednie, [name]: undefined }));
		}
	};

	const handleSubmit = async (e, callbackPoWysłaniu) => {
		e.preventDefault();

		if (walidacja) {
			const bledyWalidacji = walidacja(wartosci);
			if (Object.keys(bledyWalidacji).length > 0) {
				setBledy(bledyWalidacji);
				return;
			}
		}

		setWysylanie(true);
		try {
			await callbackPoWysłaniu(wartosci);
			setWartosci(wartosciPoczatkowe);
		} finally {
			setWysylanie(false);
		}
	};

	const resetuj = () => {
		setWartosci(wartosciPoczatkowe);
		setBledy({});
	};

	return { wartosci, bledy, wysylanie, handleChange, handleSubmit, resetuj };
}

export default useForm;
```

Użycie w komponencie szkoły:

```jsx
import useForm from './hooks/useForm';

function walidujUcznia(wartosci) {
	const bledy = {};
	if (!wartosci.imie) bledy.imie = 'Imię jest wymagane';
	if (!wartosci.nazwisko) bledy.nazwisko = 'Nazwisko jest wymagane';
	if (!wartosci.klasa) bledy.klasa = 'Wybierz klasę';
	return bledy;
}

function FormularzDodawaniaUcznia() {
	const { wartosci, bledy, wysylanie, handleChange, handleSubmit } = useForm(
		{ imie: '', nazwisko: '', klasa: '' },
		walidujUcznia
	);

	const zapiszUcznia = async (dane) => {
		await fetch('/api/uczniowie', {
			method: 'POST',
			body: JSON.stringify(dane)
		});
		alert('Uczeń dodany!');
	};

	return (
		<form onSubmit={(e) => handleSubmit(e, zapiszUcznia)}>
			<input
				name="imie"
				value={wartosci.imie}
				onChange={handleChange}
				placeholder="Imię ucznia"
			/>
			{bledy.imie && <span style={{color: 'red'}}>{bledy.imie}</span>}

			<input
				name="nazwisko"
				value={wartosci.nazwisko}
				onChange={handleChange}
				placeholder="Nazwisko ucznia"
			/>
			{bledy.nazwisko && <span style={{color: 'red'}}>{bledy.nazwisko}</span>}

			<button type="submit" disabled={wysylanie}>
				{wysylanie ? 'Zapisuję...' : 'Dodaj ucznia'}
			</button>
		</form>
	);
}
```

### Zadanie do przykładu 3

Używając hooka `useForm`, stwórz formularz `FormularzOceny`, który:

- Ma pola: uczeń (`select`), ocena (`select` z wartościami 1–6), przedmiot (`input`) i komentarz (`textarea`).
- Sprawdza, czy uczeń i ocena są wybrani.
- Pokazuje błędy pod polami z brakującymi danymi.
- Podczas wysyłania wyświetla „Zapisuję ocenę...”.
- Po zapisaniu pokazuje „Ocena zapisana!” i resetuje formularz.

## Zadania

Odpowiedzi zapisz w plikach `zadanie-X.js`, gdzie `X` to numer zadania, w katalogu:

`W:\numerKlasy\przedmiot\data-nazwaPlikuBezRozszerzenia\ImieNazwisko\`

Przykład: `W:\1a\algorytmy\20260325-10-tabliceJednowymiarowe\JanKowalski\zadanie-1.js`.

Nie dodawaj katalogu `node_modules` ani innych zbędnych, szczególnie dużych, katalogów — prześlij tylko pliki z rozwiązaniami.

### Zadanie 1 — Łatwe — `useToggle`

Stwórz Custom Hook `useToggle`, który:

- Przyjmuje opcjonalny parametr `wartoscPoczatkowa`, domyślnie `false`.
- Zwraca tablicę `[wartosc, toggle]`, podobnie jak `useState`.
- Funkcja `toggle` odwraca wartość (`true` → `false`, `false` → `true`).

Użyj go w komponencie `PrzelacznikWidoku`, który wyświetla przycisk „Pokaż szczegóły” lub „Ukryj szczegóły”. Gdy szczegóły są widoczne, pokaż dodatkowe informacje o uczniu. Tekst przycisku powinien zależeć od stanu.

Przykład użycia:

```jsx
const [widoczny, toggle] = useToggle(false);
// widoczny = false
toggle();
// widoczny = true
toggle();
// widoczny = false
```

### Zadanie 2 — Łatwe–średnie — `useCounter`

Stwórz Custom Hook `useCounter`, który zarządza licznikiem. Hook przyjmuje obiekt konfiguracyjny z opcjami:

- `start` — wartość początkowa, domyślnie `0`.
- `min` — minimalna wartość, domyślnie `0`.
- `max` — maksymalna wartość, domyślnie `0`.
- `krok` — o ile zmieniamy wartość, domyślnie `1`.

Hook zwraca `{ licznik, zwieksz, zmniejsz, resetuj }`.

Użyj go w komponencie `LicznikObecnosci`, który:

- Liczy obecnych uczniów na zajęciach (min. 0, maks. 35, krok 1).
- Wyświetla aktualną liczbę.
- Ma przyciski `+` (`zwieksz`) i `-` (`zmniejsz`).
- Wyłącza przyciski (`disabled`) po osiągnięciu min. lub maks.
- Ma przycisk „Resetuj”, który ustawia licznik na 0.

**Wskazówka:** aby sprawdzić min. i maks., zwróć je z hooka lub sprawdź w komponencie.

### Zadanie 3 — Średnie — `useDebounce`

Debounce to technika opóźniania wykonania operacji. Jest przydatna, gdy użytkownik szybko wpisuje tekst w wyszukiwarce — nie chcemy odpytywać API po każdej literze, tylko po chwili przerwy w pisaniu.

Stwórz Custom Hook `useDebounce(wartosc, opoznienie)`, który:

- Przyjmuje wartość i opóźnienie w milisekundach.
- Zwraca opóźnioną wersję wartości.
- Aktualizuje wartość dopiero po upływie zadanego czasu od ostatniej zmiany.

**Wskazówka:** użyj `useEffect` z `setTimeout` i `clearTimeout` w funkcji cleanup.

Schemat działania:

```jsx
function useDebounce(wartosc, opoznienie) {
	const [opoznionaWartosc, setOpoznionaWartosc] = useState(wartosc);

	useEffect(() => {
		const timer = setTimeout(() => {
			setOpoznionaWartosc(wartosc);
		}, opoznienie);

		return () => clearTimeout(timer); // Czyścimy timer
	}, [wartosc, opoznienie]);

	return opoznionaWartosc;
}
```

Użyj hooka w komponencie `WyszukiwarkaUczniow`:

- Dodaj pole do wpisywania imienia ucznia.
- Wyniki wyszukiwania pojawiają się 500 ms po zakończeniu pisania.
- Podczas wpisywania pokazuj „Wpisz imię ucznia...”.
- Zasymuluj wyniki (nie potrzebujesz prawdziwego API):
	- `Jan` → `['Jan Kowalski 1A', 'Jan Nowak 2B']`.
	- `Anna` → `['Anna Wiśniewska 3A']`.
	- Inny tekst → `[]`.

### Zadanie 4 — Średnie — `usePrevious`

Czasem chcemy wiedzieć, jaka była poprzednia wartość stanu, np. uczeń miał ocenę 4, a teraz ma 5 — to poprawa.

Stwórz Custom Hook `usePrevious(wartosc)`, który:

- Przyjmuje dowolną wartość.
- Zwraca poprzednią wartość, sprzed ostatniego renderu.
- Przy pierwszym renderze zwraca `undefined`.

**Wskazówka:** użyj `useRef` do przechowywania poprzedniej wartości. `useRef` nie powoduje ponownego renderowania komponentu, ale zachowuje wartość.

Schemat:

```jsx
function usePrevious(wartosc) {
	const ref = useRef();
	useEffect(() => {
		ref.current = wartosc; // Zapisujemy aktualną wartość jako poprzednią po renderze
	}, [wartosc]);
	return ref.current; // Zwracamy wartość sprzed tego renderu
}
```

Użyj hooka w komponencie `HistoriaOcen`, który wyświetla aktualną i poprzednią ocenę ucznia, pokazuje strzałkę w górę (poprawa) lub w dół (pogorszenie) oraz ma przyciski zmiany oceny: 1, 2, 3, 4, 5 i 6.

### Zadanie 5 — Trudne — `useApi`

Stwórz rozbudowany Custom Hook `useApi`, który obsługuje operacje CRUD (*Create, Read, Update, Delete*) na zasobach API szkoły.

Hook przyjmuje `baseUrl`, np. `/api/uczniowie`, i zwraca:

- `dane` — aktualny stan danych.
- `loading` — informację, czy trwa operacja.
- `error` — ewentualny błąd.
- `pobierzWszystkich()` — `GET /baseUrl`.
- `pobierzPoId(id)` — `GET /baseUrl/{id}`.
- `utwórz(dane)` — `POST /baseUrl`.
- `aktualizuj(id, dane)` — `PUT /baseUrl/{id}`.
- `usuń(id)` — `DELETE /baseUrl/{id}`.

Każda operacja powinna ustawiać `loading` na `true` przed wykonaniem, aktualizować stan `dane`, obsługiwać błędy (`setError`) i ustawiać `loading` na `false` po zakończeniu.

Użyj hooka w komponencie `ZarządzanieUczniami`, który wyświetla listę uczniów, ma przycisk „Odśwież”, formularz dodawania ucznia oraz przycisk „Usuń” przy każdym uczniu. Uwzględnij stany ładowania i błędów dla każdej operacji.

Zasymuluj opóźnienie API:

```jsx
await new Promise(resolve => setTimeout(resolve, 500));
```

### Zadanie 6 — Bardzo trudne — `useStepForm`

Stwórz Custom Hook `useStepForm` do obsługi wieloetapowego formularza, np. rejestracji nowego ucznia.

Hook przyjmuje tablicę kroków (etapów), gdzie każdy krok jest obiektem:

```jsx
{
	id: 'dane-osobowe',
	pola: ['imię', 'nazwisko', 'dataUrodzenia'],
	walidacja: (wartosci) => { /* zwraca obiekt błędów lub {} */ }
}
```

Hook zwraca:

- `aktualnyKrok` — numer aktualnego kroku (0, 1, 2...).
- `aktualnaKonfiguracja` — obiekt konfiguracji aktualnego kroku.
- `wartosci` — wszystkie wartości formularza.
- `bledy` — błędy dla aktualnego kroku.
- `handleChange` — obsługę zmiany pola.
- `nastepnyKrok()` — przejście do następnego kroku po walidacji.
- `poprzedniKrok()` — powrót do poprzedniego kroku.
- `wyslij(callback)` — walidację ostatniego kroku i wywołanie callbacka ze wszystkimi danymi.
- `postep` — procent ukończenia (0–100).
- `czyOstatni` — informację, czy jesteśmy na ostatnim kroku.
- `czyPierwszy` — informację, czy jesteśmy na pierwszym kroku.
- `resetuj()` — reset całego formularza.

Zaimplementuj komponent `RejestracjaUcznia` z trzema krokami:

1. **Dane osobowe:** imię, nazwisko, data urodzenia, PESEL.
2. **Dane kontaktowe:** e-mail rodzica, telefon, adres.
3. **Dane szkolne:** wybrana klasa, profil (mat-fiz, hum, biol-chem), język obcy.

Każdy krok wymaga wypełnienia wszystkich pól. Formularz pokazuje pasek postępu. Na ostatnim kroku zamiast przycisku „Następny” wyświetl przycisk „Zarejestruj”. Po wysłaniu pokaż podsumowanie wszystkich danych ucznia.

**Wskazówka:** przechowuj `aktualnyKrok` jako licznik w `useState`, wartości jako jeden duży obiekt w `useState`, a błędy osobno dla każdego kroku.

## Podsumowanie lekcji — Custom Hooks

Custom Hooks to jeden z ważnych wzorców w React.

Kluczowe zasady:

- Custom Hook to zwykła funkcja JavaScript, której nazwa zaczyna się od `use`.
- Może używać wbudowanych hooków, np. `useState`, `useEffect`, `useRef` i `useContext`.
- Każde wywołanie hooka tworzy oddzielny, niezależny stan.
- Zwraca dane lub funkcje potrzebne komponentowi: obiekt, tablicę albo pojedynczą wartość.

Zasady hooków:

- Wywołuj hooki na najwyższym poziomie, a nie wewnątrz `if`, `for` czy `switch`.
- Wywołuj hooki tylko w komponentach React lub innych hookach.
- Nazwa hooka musi zaczynać się od `use`.

Warto tworzyć Custom Hook, gdy ten sam kod `useState` i `useEffect` pojawia się w kilku miejscach, logika jest skomplikowana lub chcesz ją testować niezależnie od widoku.

Hooki omawiane na lekcji:

- `useLocalStorage` — stan synchronizowany z pamięcią przeglądarki.
- `useFetch` — pobieranie danych z API z obsługą `loading` i `error`.
- `useForm` — obsługa formularzy z walidacją.
- `useToggle` — przełącznik `true`/`false`.
- `useCounter` — licznik z konfigurowalnymi granicami.
- `useDebounce` — opóźnianie wartości, przydatne w wyszukiwarkach.
- `usePrevious` — zapamiętywanie poprzedniej wartości.
- `useApi` — operacje CRUD dla zasobów API.
- `useStepForm` — obsługa formularza wieloetapowego.

Wzorce zwracania wartości:

- Tablica `[wartosc, setter]` — gdy zależy nam na prostym destrukturyzowaniu jak w `useState`.
- Obiekt `{ dane, loading, error }` — gdy zwracamy wiele różnych wartości.
- Pojedyncza wartość — gdy hook oblicza jedną rzecz.

Custom Hooks pozwalają wyciągać logikę z komponentów. Dzięki nim komponenty są prostsze, zajmują się wyświetlaniem, a logika może być wielokrotnie używana i łatwo testowana. W profesjonalnych projektach React folder `hooks/` z Custom Hookami jest standardem.
