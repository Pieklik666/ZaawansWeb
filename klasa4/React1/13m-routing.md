# React: Routing z React Router

## Cele lekcji

Na tej lekcji poznasz routing w aplikacjach SPA (Single Page Application) i nauczysz się
tworzyć wiele widoków w jednej aplikacji React. Dowiesz się, jak powiązać adres URL
z komponentem, jak budować nawigację bez przeładowania strony oraz jak odczytywać parametry
z adresu. Routing jest podstawą niemal każdej rzeczywistej aplikacji webowej.

## Co będziesz umieć po tej lekcji?

- Wyjaśnisz, czym jest routing w aplikacji SPA i czym różni się od zwykłego linku HTML.
- Skonfigurujesz trasy za pomocą `BrowserRouter`, `Routes` i `Route`.
- Zbudujesz nawigację z użyciem `Link`, która nie pzeładowuje strony.
- Odczytasz parametr ścieżki URL za pomocą `useParams`.
- Przejdziesz do innej trasy programowo za pomocą `useNavigate`.

---

# Informacje

## Ogólne informacje

Aplikacja SPA ładuje jeden dokument HTML, a kolejne widoki tworzy React w przeglądarce.
Adres w pasku przeglądarki może się zmieniać, dzięki czemu użytkownik widzi, gdzie się
znajduje, i może korzystać z przycisków wstecz i dalej. Routing łączy ścieżkę URL
z odpowiednim komponentem.

Przykłady:

- Trasa (route) - powiązanie ścieżki URL z komponentem, który ma zostać wyświetlony
- Ścieżka (path) - fragment adresu po domenie, np. `/about`
- Parametr ścieżki (path parameter) - zmienny fragment adresu, np. `/tasks/7`, gdzie `7` to wartość parametru

## BrowserRouter

`BrowserRouter` - komponent, który włącza routing w aplikacji i synchronizuje
stan widoku z adresem w pasku przeglądarki. Powinien obejmować część aplikacji korzystającą
z routingu.

```jsx
// BrowserRouter musi obejmować wszystkie elementy korzystające z routingu
<BrowserRouter>
	<App />
</BrowserRouter>
```

## Routes i Route

`Routes` - komponent grupujący trasy; wybiera pierwszą trasę pasującą do adresu.
`Route` - komponent opisujący pojedynczą trasę: ścieżkę `path` i komponent `element`.

```jsx
<Routes>
	{/* Dla adresu "/" wyświetli się komponent Home */}
	<Route path="/" element={<Home />} />
	{/* Dla adresu "/about" wyświetli się komponent About */}
	<Route path="/about" element={<About />} />
</Routes>
```

## Link

`Link` - komponent do nawigacji wewnątrz aplikacji. W przeciwieństwie do znacznika
`<a href="...">` nie wysyła nowego żądania do serwera, tylko zmienia widok React.

## useNavigate

`useNavigate` - hook zwracający funkcję, która przechodzi do innej trasy
z kodu JavaScript, np. po wysłaniu formularza.

## useParams

`useParams` - hook zwracający obiekt z parametrami ścieżki. Wartości parametrów
są zawsze tekstem (string), nawet jeśli wyglądają jak liczby.

---

# Przydatne funkcje / składnia / itd

## Link

### Opis

`Link` tworzy odnośnik do trasy w aplikacji React. Zmiana widoku odbywa się bez przeładowania
strony, a adres w pasku przeglądarki jest aktualizowany.

### Składnia

```jsx
<Link to="/sciezka">Tekst odnośnika</Link>
```

### Przykład

```jsx
import { Link } from "react-router-dom";

function Menu() {
	return (
		<nav>
			{/* Kliknięcie przenosi do "/" bez przeładowania strony */}
			<Link to="/">Start</Link>
			{/* Kliknięcie przenosi do "/about" bez przeładowania strony */}
			<Link to="/about">O aplikacji</Link>
		</nav>
	);
}

export default Menu;

// Wynik: w menu pojawią się dwa odnośniki. Po kliknięciu "O aplikacji"
// w pasku adresu zobaczysz "/about", a strona nie zostanie przeładowana.
```

### Zadanie

Napisz komponent `Menu` z trzema odnośnikami: `Start` (`/`), `Zadania` (`/tasks`)
i `Pomoc` (`/help`). Sprawdź, czy kliknięcie zmienia adres w pasku przeglądarki.

## Routes i Route

### Opis

`Routes` grupuje trasy, a `Route` określa, który komponent ma być wyświetlony dla danej ścieżki.

### Składnia

```jsx
<Routes>
	<Route path="/sciezka" element={<Komponent />} />
</Routes>
```

### Przykład

```jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";

function Home() {
	return <h1>Strona główna</h1>;
}

function About() {
	return <h1>O aplikacji</h1>;
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Adres "/" pokazuje komponent Home */}
				<Route path="/" element={<Home />} />
				{/* Adres "/about" pokazuje komponent About */}
				<Route path="/about" element={<About />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

// Wynik: pod adresem "/" zobaczysz "Strona główna",
// a pod adresem "/about" zobaczysz "O aplikacji".
```

### Zadanie

Dodaj trasę `/contact` z komponentem `Contact`, który wyświetla nagłówek `Kontakt`.
Sprawdź, czy po wpisaniu adresu `/contact` w przeglądarce widok się zmienia.

## useNavigate

### Opis

`useNavigate` zwraca funkcję, która zmienia trasę z kodu, np. po kliknięciu przycisku
lub po zatwierdzeniu formularza.

### Składnia

```jsx
const navigate = useNavigate();
navigate("/sciezka");
```

### Przykład

```jsx
import { useNavigate } from "react-router-dom";

function SaveButton() {
	const navigate = useNavigate();

	function handleClick() {
		// Przejście do trasy "/tasks" po kliknięciu przycisku
		navigate("/tasks");
	}

	return <button onClick={handleClick}>Zapisz</button>;
}

export default SaveButton;

// Wynik: po kliknięciu przycisku "Zapisz" adres zmieni się na "/tasks".
```

### Zadanie

Napisz przycisk `Wróć na start`, który po kliknięciu przechodzi do trasy `/`.
Sprawdź, czy zmiana adresu następuje bez przeładowania strony.

## useParams

### Opis

`useParams` odczytuje wartości parametrów zapisanych w ścieżce trasy. Parametr zapisuje się
w `Route` z dwukropkiem, np. `/tasks/:taskId`.

### Składnia

```jsx
const { nazwaParametru } = useParams();
```

### Przykład

```jsx
import { useParams } from "react-router-dom";

function TaskDetails() {
	// Odczyt parametru taskId z adresu, np. z "/tasks/7"
	const { taskId } = useParams();

	// Wartość jest tekstem, np. "7"
	return <h1>Szczegóły zadania: {taskId}</h1>;
}

export default TaskDetails;

// Wynik: dla adresu "/tasks/7" zobaczysz "Szczegóły zadania: 7".
```

### Zadanie

Dodaj trasę `/users/:userId` z komponentem, który wyświetla tekst `Użytkownik: ` i wartość
parametru `userId`. Sprawdź adresy `/users/1` i `/users/anna`.

---

# Przykłady

## Aplikacja z menu i dwoma widokami

### Opis

Przykład pokazuje strukturę małej aplikacji: komponent `App` z `BrowserRouter`,
menu nawigacyjne i trasy do dwóch widoków.

### Składnia

```jsx
<BrowserRouter>
	<nav>{/* odnośniki Link */}</nav>
	<Routes>{/* trasy Route */}</Routes>
</BrowserRouter>
```

### Przykład

```jsx
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

function Home() {
	return <h1>Strona główna</h1>;
}

function About() {
	return <h1>O aplikacji</h1>;
}

function App() {
	return (
		<BrowserRouter>
			<nav>
				{/* Odnośniki zmieniają widok bez przeładowania strony */}
				<Link to="/">Start</Link>
				<Link to="/about">O aplikacji</Link>
			</nav>
			<Routes>
				{/* Każda trasa wskazuje ścieżkę i komponent */}
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

// Wynik: po wejściu na "/" widoczna jest "Strona główna".
// Po kliknięciu "O aplikacji" pojawia się "O aplikacji", a adres to "/about".
```

### Zadanie

Dodaj do tej aplikacji komponent `Contact` z trasą `/contact` i odnośnik w menu.
Sprawdź, czy wszystkie trzy widoki działają poprawnie.

## Lista zadań z przejściem do szczegółów

### Opis

Przykład łączy formularz, `useNavigate` i trasę z parametrem. Po podaniu identyfikatora
użytkownik trafia na stronę szczegółów zadania.

### Składnia

```jsx
navigate(`/tasks/${identyfikator}`);
```

### Przykład

```jsx
import { useState } from "react";
import {
	BrowserRouter,
	Link,
	Route,
	Routes,
	useNavigate,
	useParams,
} from "react-router-dom";

function Home() {
	const [taskId, setTaskId] = useState("");
	const navigate = useNavigate();

	function openTask(event) {
		// Blokada domyślnego przeładowania strony przy wysyłaniu formularza
		event.preventDefault();
		// Przejście do szczegółów tylko, gdy identyfikator nie jest pusty
		if (taskId.trim()) {
			navigate(`/tasks/${encodeURIComponent(taskId.trim())}`);
		}
	}

	return (
		<>
			<h1>Lista zadań</h1>
			<form onSubmit={openTask}>
				<label htmlFor="taskId">Identyfikator zadania</label>
				<input
					id="taskId"
					value={taskId}
					onChange={(event) => setTaskId(event.target.value)}
				/>
				<button type="submit">Otwórz</button>
			</form>
		</>
	);
}

function TaskDetails() {
	// Odczyt parametru taskId z adresu
	const { taskId } = useParams();
	return <h1>Szczegóły zadania: {taskId}</h1>;
}

function App() {
	return (
		<BrowserRouter>
			<nav>
				<Link to="/">Start</Link>
			</nav>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/tasks/:taskId" element={<TaskDetails />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

// Wynik: po wpisaniu "7" i kliknięciu "Otwórz" adres to "/tasks/7",
// a na stronie pojawia się "Szczegóły zadania: 7".
```

### Zadanie

Zmień przykład tak, aby po wysłaniu pustego formularza nie następowało przejście,
a w konsoli przeglądarki pojawiał się komunikat `Podaj identyfikator`.
Sprawdź działanie dla pustego pola i dla wartości `3`.

---

# Zadania

## Zadanie 1: Widoki i nawigacja [ŁATWE]

Dodaj widoki `Home` i `Help`, skonfiguruj trasy `/` i `/help` oraz dwa odnośniki `Link`.
Uruchom aplikację i sprawdź, czy przechodzenie między widokami nie przeładowuje całej strony.

Pytania pomocnicze: Czy `BrowserRouter` obejmuje elementy nawigacji i trasy?
Czy `to` w `Link` odpowiada ścieżce z `Route`? Co zmienia się w pasku adresu po kliknięciu?

## Zadanie 2: Trasa z parametrem [ŚREDNIE]

Rozbuduj aplikację o trasę `/tasks/:taskId`. Komponent szczegółów ma odczytać parametr
za pomocą `useParams` i wyświetlić identyfikator zadania. Dodaj formularz lub przycisk,
który po podaniu identyfikatora przechodzi do szczegółów przez `useNavigate`.
Sprawdź co najmniej dwa identyfikatory.

Pytania pomocnicze: Jak zapisuje się zmienny fragment ścieżki? Skąd komponent pobiera `taskId`?
Jaki typ ma wartość parametru? Co się stanie dla pustego identyfikatora?

## Zadanie 3: Edycja zadania [TRUDNE]

Dodaj trasę `/tasks/:taskId/edit` z komponentem edycji. Odczytaj `taskId`, pozwól wpisać
tytuł zadania, a po zatwierdzeniu użyj `useNavigate` do przejścia z powrotem do szczegółów
danego zadania. Dodaj trasę `*` dla nieznanych adresów z komunikatem 404 i linkiem
do `/`. Dane mogą pozostać lokalne; nie jest wymagane połączenie z API.

Pytania pomocnicze: Czy ścieżka edycji jest bardziej szczegółowa od trasy szczegółów?
Czy kolejność deklaracji tras wpływa na ich dopasowanie w `Routes`?
Jak zachować ten sam identyfikator po zapisaniu? Jak obsłużyć pusty tytuł i nieznany adres?

## Zadanie 4: Walidacja i powrót [EXPERT]

Rozszerz widok edycji z zadania 3 o walidację tytułu: tytuł musi mieć co najmniej 3 znaki.
Dla krótszego tytułu wyświetl komunikat o błędzie i nie wykonuj przejścia. Dodaj przycisk
`Anuluj`, który za pomocą `useNavigate(-1)` wraca na poprzednią stronę w historii przeglądarki.
Przetestuj działanie przycisku wstecz przeglądarki po przejściu między kilkoma trasami.

---

# Podsumowanie

## Kluczowe wnioski

- Routing łączy adres URL z komponentem i pozwala tworzyć wiele widoków w jednej aplikacji SPA.
- `BrowserRouter` obejmuje aplikację, `Routes` grupuje trasy, a `Route` opisuje pojedynczą trasę.
- `Link` i `useNavigate` zmieniają widok bez przeładowania strony.
- `useParams` zwraca parametry ścieżki jako tekst.

## Najczęstsze błędy

- Użycie zwykłego `<a href>` zamiast `Link`, co powoduje przeładowanie strony.
- Brak `:` przed nazwą parametru w `path`, np. `/tasks/taskId` zamiast `/tasks/:taskId`.
- Umieszczenie komponentów z routingiem poza `BrowserRouter`.
- Niezgodność `to` w `Link` z `path` w `Route`.

## Dobre praktyki

- Testuj adresy zarówno przez nawigację w aplikacji, jak i przez bezpośrednie wpisanie w pasku adresu.
- Obsługuj nieznane adresy trasą `*`.
- Formatuj kod skrótem Shift + Alt + F w VS Code i zwracaj uwagę na podkreślenia ESLint.
- Dodawaj komentarze wyjaśniające działanie tras i hooków.

## Co dalej?

Sprawdź dokumentację React Router i poeksperymentuj z zagnieżdżonymi trasami (`Outlet`)
oraz trasami z wieloma parametrami, np. `/tasks/:taskId/comments/:commentId`.
