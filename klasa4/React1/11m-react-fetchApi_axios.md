# React: Fetch API i Axios

## Cele lekcji

Poznasz pobieranie danych z API w React oraz nauczysz się informować o ładowaniu,
wyniku i błędzie. Jest to ważne, ponieważ odpowiedź serwera przychodzi
asynchronicznie.

## Co będziesz umieć po tej lekcji?

- Wyjaśnić rolę API, żądania HTTP i odpowiedzi JSON.
- Używać `async/await`, `try/catch` i `useEffect`.
- Pobrać dane za pomocą Fetch API lub Axios.
- Obsługiwać stany ładowania, danych i błędu.
- Sprawdzać żądania w narzędziach deweloperskich przeglądarki.

---

## Informacje

### Ogólne informacje

Komponent React wysyła żądanie HTTP do API, otrzymuje odpowiedź, zapisuje dane
w stanie, a React ponownie renderuje widok. Komunikacja sieciowa jest
asynchroniczna, więc podczas oczekiwania interfejs powinien pokazać ładowanie.

- API (interfejs programistyczny aplikacji) - sposób komunikacji aplikacji.
- Żądanie HTTP - prośba o wykonanie operacji przez serwer.
- JSON - tekstowy format reprezentowania danych.

### Promise i async/await

`Promise`, czyli obietnica, reprezentuje wynik operacji dostępny w przyszłości.
`await` czeka na wynik wewnątrz funkcji `async`, a `try/catch` obsługuje błędy.

```js
async function pobierzWpis() {
	try {
		// Oczekuje na odpowiedź serwera.
		const odpowiedz = await fetch(
			"https://jsonplaceholder.typicode.com/posts/1"
		);
		if (!odpowiedz.ok) {
			throw new Error(`Błąd HTTP: ${odpowiedz.status}`);
		}
		// Odczytuje treść JSON i wypisuje tytuł wpisu.
		const wpis = await odpowiedz.json();
		console.log(wpis.title);
	} catch (blad) {
		// Pokazuje informację, gdy żądanie lub odczyt danych się nie powiedzie.
		console.error("Nie udało się pobrać danych.", blad);
	}
}

// Wywołanie rozpoczyna pobieranie; wynikiem jest tytuł wpisu w konsoli.
pobierzWpis();
```

### Fetch API i Axios

Fetch jest dostępny w przeglądarce bez instalacji. Nie odrzuca obietnicy dla
statusów HTTP takich jak 404, dlatego należy sprawdzić `response.ok`. Axios
wymaga instalacji, umieszcza dane w `response.data` i domyślnie zgłasza błąd dla
statusów spoza zakresu 2xx.

### useEffect i stany żądania

`useEffect` może rozpocząć pobieranie po zamontowaniu komponentu. Pusta tablica
zależności `[]` oznacza brak zależności efektu od zmiennych komponentu. W trybie
Strict Mode efekt może zostać ponownie uruchomiony podczas pracy deweloperskiej.
Żądania odczytujące dane powinny być bezpieczne do powtórzenia.

- Ładowanie - żądanie trwa.
- Dane - żądanie zakończyło się powodzeniem.
- Błąd - nie udało się uzyskać danych.

---

## Przydatne funkcje i składnia

### Fetch API: fetch, response.ok i response.json

#### Opis

`fetch(adres)` wysyła żądanie. Po otrzymaniu odpowiedzi sprawdź `response.ok`,
a następnie odczytaj treść przez asynchroniczne `response.json()`.

#### Składnia

```js
const odpowiedz = await fetch(adres);
if (!odpowiedz.ok) {
	throw new Error(`Błąd HTTP: ${odpowiedz.status}`);
}
const dane = await odpowiedz.json();
```

#### Przykład

Komponent pobiera maksymalnie pięć wpisów. Podczas pobierania pokazuje
komunikat, po powodzeniu tytuły, a po błędzie informację o niepowodzeniu.

```jsx
import { useEffect, useState } from "react";

function PostList() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		async function loadPosts() {
			try {
				// Pobiera maksymalnie pięć wpisów z podanego API.
				const response = await fetch(
					"https://jsonplaceholder.typicode.com/posts?_limit=5"
				);
				// Fetch wymaga jawnego sprawdzenia statusu HTTP.
				if (!response.ok) {
					throw new Error(`Błąd HTTP: ${response.status}`);
				}
				// Odczytuje JSON i zapisuje otrzymane wpisy w stanie.
				const data = await response.json();
				setPosts(data);
			} catch (requestError) {
				// Zapisuje błąd, aby komponent mógł go pokazać.
				setError(requestError.message);
			} finally {
				// Kończy ładowanie niezależnie od wyniku żądania.
				setLoading(false);
			}
		}

		// Uruchamia pobieranie po zamontowaniu komponentu.
		loadPosts();
	}, []);

	if (loading) return <p>Ładowanie...</p>;
	if (error) return <p role="alert">Błąd: {error}</p>;

	return (
		<ul>
			{posts.map((post) => (
				<li key={post.id}>{post.title}</li>
			))}
		</ul>
	);
}

export default PostList;
```

Wywołanie następuje po zamontowaniu komponentu. Oczekiwany wynik: najpierw
"Ładowanie...", a po powodzeniu lista do pięciu tytułów. Błąd HTTP lub
połączenia powoduje wyświetlenie komunikatu błędu.

#### Zadanie

[ŁATWE] Zmień element listy tak, aby obok tytułu pokazywał identyfikator wpisu.
Zachowaj obsługę ładowania i błędu. Nie podawaj gotowego rozwiązania.

### Axios: axios.get i response.data

#### Opis

Axios trzeba zainstalować w projekcie. Metoda `axios.get(adres)` pobiera dane,
które znajdują się we właściwości `response.data`.

#### Składnia

```js
const odpowiedz = await axios.get(adres);
const dane = odpowiedz.data;
```

#### Przykład

Komponent pobiera listę użytkowników. Po powodzeniu wyświetla imię, adres
e-mail i miasto; wynik zależy od danych zwróconych przez API.

```jsx
import axios from "axios";
import { useEffect, useState } from "react";

function UserList() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		async function loadUsers() {
			try {
				// Pobiera użytkowników z publicznego API.
				const response = await axios.get(
					"https://jsonplaceholder.typicode.com/users"
				);
				// Axios udostępnia treść odpowiedzi we właściwości data.
				setUsers(response.data);
			} catch (requestError) {
				// Rozróżnia status HTTP od braku odpowiedzi serwera.
				setError(
					requestError.response?.status
						? `Błąd HTTP: ${requestError.response.status}`
						: "Nie udało się połączyć z serwerem."
				);
			} finally {
				// Kończy ładowanie także po błędzie.
				setLoading(false);
			}
		}

		// Uruchamia pobieranie po zamontowaniu.
		loadUsers();
	}, []);

	if (loading) return <p>Ładowanie użytkowników...</p>;
	if (error) return <p role="alert">{error}</p>;

	return (
		<ul>
			{users.map((user) => (
				<li key={user.id}>
					{user.name} - {user.email} - {user.address.city}
				</li>
			))}
		</ul>
	);
}

export default UserList;
```

Błędny adres lub odpowiedź z błędem powoduje wyświetlenie komunikatu.

#### Zadanie

[ŚREDNIE] Zainstaluj Axios poleceniem `npm install axios`. Wyświetl przy każdym
użytkowniku nazwę firmy zamiast miasta. Przetestuj błędny adres i przywróć
poprawny. Nie podawaj gotowego rozwiązania.

### Narzędzia deweloperskie przeglądarki

#### Opis

Zakładka Network pokazuje żądania, status HTTP i treść odpowiedzi. Błąd HTTP
oznacza, że serwer odpowiedział statusem niepowodzenia, na przykład 404. Błąd
połączenia oznacza, że odpowiedź nie dotarła do aplikacji.

#### Sposób sprawdzenia

Otwórz narzędzia deweloperskie, wybierz Network, odśwież aplikację i wybierz
żądanie API, aby sprawdzić status oraz odpowiedź JSON.

#### Przykład danych wejściowych i wyniku

```text
Żądanie: GET https://jsonplaceholder.typicode.com/posts?_limit=5
Status: 200
Wynik: odpowiedź zawiera tablicę pięciu wpisów JSON.
```

Status 200 oznacza powodzenie i umożliwia odczyt danych.

#### Zadanie

[TRUDNE] Zmień adres na błędny, sprawdź wynik w Network i porównaj go z
komunikatem aplikacji. Następnie przywróć prawidłowy adres. Nie podawaj
gotowego rozwiązania.

---

## Zadania

### Zadanie 1: Lista wpisów

[ŁATWE] Przygotuj komponent pobierający przez Fetch API maksymalnie pięć wpisów
po zamontowaniu. Wyświetl tytuły, komunikat "Ładowanie..." przed odpowiedzią
oraz komunikat błędu w razie niepowodzenia. Przetestuj powodzenie i błąd.

### Zadanie 2: Katalog użytkowników

[ŚREDNIE] W parze przygotuj katalog użytkowników pobierany przez Axios w
`useEffect`. Pokaż imię, adres e-mail i miasto oraz stany ładowania i błędu.
Użyj `map` i stabilnego `key`. Przetestuj nieprawidłowy adres, a potem przywróć
poprawny. Zainstaluj Axios poleceniem `npm install axios`.

### Zadanie 3: Testowanie i diagnozowanie

[TRUDNE] Sprawdź żądanie w Network. Zapisz status odpowiedzi i opisz, czym różni
się błąd HTTP od błędu połączenia. Upewnij się, że interfejs pokazuje właściwy
stan w każdym przypadku.

### Zadanie 4: Wyszukiwanie użytkowników

[EKSPERT] Rozbuduj katalog użytkowników o kontrolowane pole wyszukiwania. Filtruj
pobraną listę po nazwie i e-mailu bez rozróżniania wielkości liter. Pokaż
komunikat, gdy nie ma dopasowań. Nie wysyłaj nowego żądania przy każdej zmianie
tekstu. Sprawdź puste pole, fragment nazwy i tekst bez dopasowania.

---

## Podsumowanie

### Kluczowe wnioski

- Pobieranie danych przez sieć jest asynchroniczne.
- `async/await` ułatwia zapis operacji oczekujących na odpowiedź.
- Fetch wymaga sprawdzenia `response.ok`; JSON odczytuje się przez
  `response.json()`.
- Axios udostępnia dane w `response.data` i domyślnie zgłasza błędy statusów
  spoza zakresu 2xx.
- `useEffect` może rozpocząć pobieranie po zamontowaniu komponentu.
- Interfejs powinien rozróżniać ładowanie, dane i błąd.

### Najczęstsze błędy

- Pominięcie sprawdzenia `response.ok` w Fetch.
- Pominięcie `await` przy odczycie JSON.
- Użycie `response.data` w Fetch zamiast `response.json()`.
- Brak `key` przy renderowaniu listy.
- Niewyłączenie ładowania po błędzie.

### Dobre praktyki

- Obsługuj błędy przez `try/catch` i kończ ładowanie w `finally`.
- Pokazuj użytkownikowi aktualny stan żądania.
- Sprawdzaj status i treść odpowiedzi w Network.
- Testuj powodzenie, błędny status oraz brak połączenia.
- Formatuj kod rozszerzeniami ESLint i Prettier.

### Co dalej?

Rozbuduj pobieranie o paginację lub szczegóły pojedynczego wpisu. Porównaj
czytelność obsługi błędów i danych w Fetch API oraz Axios.
