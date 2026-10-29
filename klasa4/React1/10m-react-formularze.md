# Formularze w React

## Wstęp

Cel lekcji:

W tej lekcji nauczysz się, jak tworzyć i obsługiwać formularze w React. Formuły to jeden z najczęściej używanych elementów w aplikacjach webowych — logowanie, rejestracja, dodawanie uczniów do systemu szkolnego... wszędzie są formularze!
V
React ma swój wyjątkowy sposób pracy z formularzami, który różni się od zwykłego HTML.

### Co będziesz umiał po tej lekcji

- Rozumieć różnicę między komponentem kontrolowanym a niekontrolowanym
- Tworzyć formularze z polami input, textarea i select
- Obsługiwać zmiany w polach formularza za pomocą stanu (useState)
- Walidować dane wpisane przez użytkownika
- Korzystać z biblioteki React Hook Form, która upraszcza pracę z formularzami
- Budować formularze dla Systemu Zarządzania Szkołą (np. dodawanie ucznia, logowanie)

---

## Informacje

### Komponent kontrolowany (Controlled Component)

W zwykłym HTML formularz „sam zarządza” swoimi danymi — wpisujesz coś w pole i przeglądarka to pamięta. W React robi się to inaczej.

Komponent kontrolowany to taki, w którym to React (a dokładnie stan — useState) przechowuje aktualne wartości pól formularza. Każda zmiana w polu input aktualizuje stan, a stan aktualizuje to, co jest wyświetlane w polu.

Schemat działania:

1. Użytkownik pisze
2. Wywołuje się `onChange`
3. `setState` aktualizuje stan
4. React rerenderuje
5. Input pokazuje nową wartość

To daje nam pełną kontrolę nad danymi formularza w każdej chwili!

### Komponent niekontrolowany (Uncontrolled Component)

To przeciwieństwo kontrolowanego — React nie zarządza wartością pola. Zamiast tego używamy `useRef()`, żeby „zajrzeć” do pola tylko wtedy, gdy potrzebujemy (np. przy wysyłaniu formularza).

Kiedy używać?

- Gdy integrujemy React z bibliotekami spoza Reacta
- Gdy potrzebujemy prostego formularza bez walidacji
- Generalna zasada: preferuj komponenty kontrolowane — masz lepszą kontrolę

### Kluczowe pojęcia

- `value` — atrybut, który przypisuje polu wartość ze stanu React
- `onChange` — zdarzenie wywoływane za każdym razem, gdy użytkownik coś wpisuje
- `onSubmit` — zdarzenie wywoływane gdy formularz jest wysyłany (kliknięcie przycisku lub Enter)
- `event.preventDefault()` — funkcjonalność natywna przeglądarek, zapobiega domyślnemu zachowaniu przeglądarki (np. przeładowanie strony)
- `walidacja` — sprawdzanie, czy dane wpisane przez użytkownika są poprawne
- `React Hook Form` — popularna biblioteka upraszczająca formularze w React

### Dlaczego `event.preventDefault()` jest ważne?

Domyślnie, gdy formularz HTML jest wysyłany, przeglądarka przeładowuje stronę. W React (Single Page Application) nie chcemy przeładowań — chcemy obsłużyć dane sami. Dlatego zawsze wywołujemy `event.preventDefault()` w funkcji obsługującej `onSubmit`.

---

## Przydatne funkcje

### `useState` — zarządzanie stanem pól formularza

Składnia:

```javascript
const [wartosc, fnUstawWartosc] = useState(wartoscPoczatkowa);
```

Przykład:

```javascript
import { useState } from 'react';

const [imie, setImie] = useState('');
// imie - aktualna wartość pola
// setImie - funkcja do aktualizacji wartości
// '' - wartość początkowa stanu
```

Wynik:

Po uruchomieniu komponentu, zmienna `imie` jest pustym stringiem. Gdy użytkownik wpisze „Anna”, `setImie("Anna")` zaktualizuje stan.

Zadanie praktyczne — `useState`

Utwórz stan dla pola `email` z wartością początkową: pusty string. Następnie stwórz stan dla pola `haslo` również pusty string.

### `onChange` — obsługa zmian w polach formularza

Funkcja `onChange` jest wywoływana po każdym naciśnięciu klawisza. Parametr `e` (event) zawiera informacje o zdarzeniu, w tym `e.target.value` — aktualną wartość pola.

Przykład:

```jsx
<input
	type="text"
	value={imie}
	onChange={(e) => setImie(e.target.value)}
/>
```

Wynik:

Każda zmiana w polu tekstowym natychmiast aktualizuje stan `imie`. React rerenderuje komponent i wyświetla nową wartość w polu.

Zadanie praktyczne — `onChange`

Napisz input typu `email` z `value` powiązanym ze stanem `email` oraz `onChange` aktualizującym ten stan. Dodaj placeholder `Wpisz swój email`.

### `onSubmit` — obsługa wysyłania formularza

Przykład:

```javascript
const handleSubmit = (e) => {
	e.preventDefault();
	console.log('Formularz wysłany:', { imie, email });
};

<form onSubmit={handleSubmit}>
	...
	<button type="submit">Wyślij</button>
</form>
```

Wynik:

Po kliknięciu „Wyślij”, funkcja `handleSubmit` jest wywoływana. Strona NIE przeładowuje się, a dane są dostępne w stanie.

Zadanie praktyczne — `onSubmit`

Napisz funkcję `handleSubmit`, która zapobiega domyślnemu zachowaniu formularza i wyświetla w konsoli obiekt z polami `email` i `haslo`.

### `select` — lista rozwijana

W React obsługujemy `select` podobnie jak `input` — poprzez `value` i `onChange`.

Przykład:

```javascript
const [klasa, setKlasa] = useState('1A');

<select value={klasa} onChange={(e) => setKlasa(e.target.value)}>
	<option value="1A">Klasa 1A</option>
	<option value="1B">Klasa 1B</option>
	<option value="2A">Klasa 2A</option>
</select>
```

Wynik:

Lista rozwijana pokazuje aktualną wartość ze stanu `klasa`. Gdy użytkownik wybierze inną opcję, stan zostanie zaktualizowany.

Zadanie praktyczne — `select`

Stwórz listę rozwijaną z opcjami: `"5"`, `"6"`, `"7"`, `"8"` reprezentującymi numery klas szkolnych. Połącz ją ze stanem `numerKlasy`.

### `textarea` — pole wieloliniowe

Działa tak samo jak `input` — używamy `value` i `onChange`.

Przykład:

```jsx
const [uwagi, setUwagi] = useState('');

<textarea
	value={uwagi}
	onChange={(e) => setUwagi(e.target.value)}
	rows={4}
	placeholder="Wpisz uwagi o uczniu..."
/>
```

Wynik:

Wieloliniowe pole tekstowe z 4 wierszami, kontrolowane przez stan `uwagi`.

Zadanie praktyczne — `textarea`

Stwórz `textarea` dla pola `opis` z placeholderem `Opisz swój problem...` i połącz je ze stanem o nazwie `opis`.

### `useRef` — komponent niekontrolowany

Kiedy używać:

- Gdy potrzebujesz dostępu do wartości pola tylko przy wysłaniu formularza
- Gdy integrujesz React z bibliotekami spoza Reacta
- Gdy chcesz uniknąć rerenderowania przy każdej zmianie pola (np. duże formularze)

Kiedy nie używać:

- Gdy potrzebujesz kontroli nad wartością w czasie rzeczywistym (np. walidacja na bieżąco)
- Gdy chcesz, aby React zarządzał danymi formularza i rerenderował przy zmianach
- Generalna zasada: preferuj komponenty kontrolowane — masz lepszą kontrolę nad danymi i UI

Zalety:

- Mniej kodu — nie musisz pisać `onChange` i `useState` dla każdego pola
- Szybsze działanie przy dużych formularzach (mniej rerenderów)
- Prostsza integracja z bibliotekami spoza Reacta, które oczekują bezpośredniego dostępu do DOM

Wady:

- Brak kontroli nad wartością w czasie rzeczywistym
- Trudniejsze testowanie i debugowanie
- Mniej spójne z filozofią Reacta (kontrola stanu przez komponenty)

Jak używać `useRef`?

1. Importuj `useRef`: `import { useRef } from 'react';`
2. Stwórz referencję: `const inputRef = useRef();`
3. Przypisz ją do pola: `<input ref={inputRef} />`
4. Odczytaj wartość: `inputRef.current.value`

Przykład:

```javascript
import { useRef } from 'react';

function FormularzNiekontrolowany() {
	const inputRef = useRef();

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Wartość pola:', inputRef.current.value);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input type="text" ref={inputRef} placeholder="Wpisz coś..." />
			<button type="submit">Wyślij</button>
		</form>
	);
}
```

Wynik:

Po kliknięciu „Wyślij”, w konsoli pojawi się aktualna wartość pola tekstowego. Nie ma kontroli nad wartością w czasie rzeczywistym — tylko przy wysłaniu.

Zadanie praktyczne — `useRef`

Utwórz formularz z jednym polem tekstowym i przyciskiem „Pokaż wartość”. Użyj `useRef`, aby po kliknięciu przycisku wyświetlić aktualną wartość pola w konsoli.

---

## Przykłady

### Przykład 1 — Prosty formularz logowania

Budujemy formularz logowania do Systemu Zarządzania Szkołą. Pola: `email`, `hasło`. Przycisk: „Zaloguj się”.

Kod JSX:

```jsx
import { useState } from 'react';

function FormularzLogowania() {
	const [email, setEmail] = useState('');
	const [haslo, setHaslo] = useState('');
	const [komunikat, setKomunikat] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!email || !haslo) {
			setKomunikat('Wypełnij wszystkie pola!');
			return;
		}

		setKomunikat(`Zalogowano jako: ${email}`);
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Logowanie do systemu szkolnego</h2>

			<div>
				<label htmlFor="email">Email:</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="twoj@email.pl"
				/>
			</div>

			<div>
				<label htmlFor="haslo">Hasło:</label>
				<input
					id="haslo"
					type="password"
					value={haslo}
					onChange={(e) => setHaslo(e.target.value)}
					placeholder="Wpisz hasło"
				/>
			</div>

			{komunikat && <p>{komunikat}</p>}

			<button type="submit">Zaloguj się</button>
		</form>
	);
}
```

Wynik przykładu 1:

- Formularz z dwoma polami i przyciskiem
- Jeśli pola są puste i klikniesz „Zaloguj się” — pojawi się „Wypełnij wszystkie pola!”
- Jeśli wpisano dane — pojawi się „Zalogowano jako: [email]”
- Strona się NIE przeładowuje

Zadanie do przykładu 1:

Dodaj pole „Nazwa użytkownika” (typ `text`) przed polem email. Dodaj walidację sprawdzającą czy nazwa użytkownika ma co najmniej 3 znaki. Jeśli nie — wyświetl odpowiedni komunikat błędu.

### Przykład 2 — Formularz z jednym obiektem stanu

Zamiast tworzyć oddzielny `useState` dla każdego pola, możemy trzymać wszystkie dane formularza w jednym obiekcie. To przydatne, gdy formularz ma wiele pól.

```jsx
import { useState } from 'react';

function FormularzDodawaniaUcznia() {
	const [formData, setFormData] = useState({
		imie: '',
		nazwisko: '',
		klasa: '1A',
		uwagi: ''
	});

	const [bledy, setBledy] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((poprzedniStan) => ({
			...poprzedniStan,
			[name]: value
		}));
	};

	const waliduj = () => {
		const noweBledy = {};

		if (!formData.imie.trim()) {
			noweBledy.imie = 'Imię jest wymagane';
		}

		if (!formData.nazwisko.trim()) {
			noweBledy.nazwisko = 'Nazwisko jest wymagane';
		}

		if (formData.nazwisko.length < 2) {
			noweBledy.nazwisko = 'Nazwisko musi mieć co najmniej 2 znaki';
		}

		return noweBledy;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const wykryteBledy = waliduj();

		if (Object.keys(wykryteBledy).length > 0) {
			setBledy(wykryteBledy);
			return;
		}

		setBledy({});
		console.log('Dodano ucznia:', formData);

		setFormData({ imie: '', nazwisko: '', klasa: '1A', uwagi: '' });
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Dodaj nowego ucznia</h2>

			<div>
				<label htmlFor="imie">Imię:</label>
				<input
					id="imie"
					type="text"
					name="imie"
					value={formData.imie}
					onChange={handleChange}
				/>
				{bledy.imie && <span style={{ color: 'red' }}>{bledy.imie}</span>}
			</div>

			<div>
				<label htmlFor="nazwisko">Nazwisko:</label>
				<input
					id="nazwisko"
					type="text"
					name="nazwisko"
					value={formData.nazwisko}
					onChange={handleChange}
				/>
				{bledy.nazwisko && <span style={{ color: 'red' }}>{bledy.nazwisko}</span>}
			</div>

			<div>
				<label htmlFor="klasa">Klasa:</label>
				<select
					id="klasa"
					name="klasa"
					value={formData.klasa}
					onChange={handleChange}
				>
					<option value="1A">Klasa 1A</option>
					<option value="1B">Klasa 1B</option>
					<option value="2A">Klasa 2A</option>
					<option value="2B">Klasa 2B</option>
				</select>
			</div>

			<div>
				<label htmlFor="uwagi">Uwagi:</label>
				<textarea
					id="uwagi"
					name="uwagi"
					value={formData.uwagi}
					onChange={handleChange}
					rows={3}
					placeholder="Opcjonalne uwagi o uczniu..."
				/>
			</div>

			<button type="submit">Dodaj ucznia</button>
		</form>
	);
}
```

Wynik przykładu 2:

- Formularz z 4 polami (`imie`, `nazwisko`, `klasa`, `uwagi`)
- Przy próbie wysłania — uruchamiana jest walidacja
- Błędy wyświetlają się pod odpowiednimi polami na czerwono
- Po poprawnym wysłaniu — formularz się czyści, dane są w konsoli
- Kluczowa technika: operator resztowy (`...poprzedniStan`) przy aktualizacji obiektu

Zadanie do przykładu 2:

Dodaj do formularza pole „Numer telefonu rodzica” (`type="tel"`, `name="telefon"`). Dodaj walidację sprawdzającą czy numer ma dokładnie 9 cyfr. Wskazówka: użyj `/^\d{9}$/.test(formData.telefon)` do sprawdzenia.

### Przykład 3 — React Hook Form

React Hook Form to popularna biblioteka, która:

- Zmniejsza ilość kodu, który musisz pisać
- Automatycznie obsługuje walidację
- Jest bardzo wydajna (mniejsza liczba rerenderów)

Instalacja (w terminalu):

```bash
npm install react-hook-form
```

Kod JSX:

```jsx
import { useForm } from 'react-hook-form';

function FormularzKontaktowy() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm();

	const onSubmit = (data) => {
		console.log('Dane formularza:', data);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2>Formularz kontaktowy</h2>

			<div>
				<label>Imię:</label>
				<input
					{...register('imie', {
						required: 'Imię jest wymagane',
						minLength: {
							value: 2,
							message: 'Imię musi mieć co najmniej 2 znaki'
						}
					})}
					type="text"
					placeholder="Twoje imię"
				/>
				{errors.imie && <span style={{ color: 'red' }}>{errors.imie.message}</span>}
			</div>

			<div>
				<label>Email:</label>
				<input
					{...register('email', {
						required: 'Email jest wymagany',
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: 'Podaj poprawny adres email'
						}
					})}
					type="email"
					placeholder="twoj@email.pl"
				/>
				{errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
			</div>

			<div>
				<label>Wiadomość:</label>
				<textarea
					{...register('wiadomość', {
						required: 'Wiadomość jest wymagana',
						maxLength: {
							value: 500,
							message: 'Wiadomość może mieć maksymalnie 500 znaków'
						}
					})}
					rows={4}
					placeholder="Twoja wiadomość..."
				/>
				{errors.wiadomość && <span style={{ color: 'red' }}>{errors.wiadomość.message}</span>}
			</div>

			<button type="submit">Wyślij wiadomość</button>
		</form>
	);
}
```

Wynik przykładu 3:

- Formularz z automatyczną walidacją dzięki React Hook Form
- Znacznie mniej kodu niż w przykładzie 1 i 2
- Błędy pojawiają się pod polami po próbie wysłania
- Formularz wysyła się TYLKO gdy wszystkie dane są poprawne
- Kluczowy element: `{...register('nazwaPola', { reguły })}` — rejestruje pole z walidacją

Zadanie do przykładu 3:

Dodaj do formularza kontaktowego pole „Temat” (`type="text"`, `name="temat"`). Walidacja: wymagane, minimum 5 znaków, maksimum 100 znaków. Dodaj odpowiednie komunikaty błędów dla każdej reguły.

---

## Zadania praktyczne

### Zadanie 1 — Łatwe

Stwórz prosty komponent `FormularzImienia`, który:

- ma jedno pole tekstowe `input[type="text"]` dla imienia
- pod polem wyświetla na bieżąco wpisany tekst jako: `Witaj, [imie]!`
- gdy pole jest puste, wyświetl: `Wpisz swoje imię`

Wskazówka: użyj jednego `useState` i warunkowego renderowania (`operator ||` lub ternary)

### Zadanie 2 — Łatwe/Średnie

Stwórz formularz oceniania ucznia dla Systemu Zarządzania Szkołą. Formularz ma zawierać:

- pole tekstowe: imię i nazwisko ucznia
- lista rozwijana (`select`): ocena od 1 do 6
- pole `select`: przedmiot (`matematyka`, `polski`, `angielski`, `historia`, `biologia`)
- przycisk `Dodaj ocenę`

Po wysłaniu formularza wyświetl pod nim listę dodanych ocen w formacie:

`[Imie Nazwisko] - [Przedmiot]: [Ocena]`

Wskazówka: użyj tablicy w stanie do przechowywania listy wpisów.

### Zadanie 3 — Średnie

Zbuduj formularz rejestracji ucznia z walidacją (bez bibliotek — tylko `useState` i własna logika).

Pola formularza:

- Imie (wymagane, min. 2 znaki)
- Nazwisko (wymagane, min. 2 znaki)
- Email (wymagane, musi zawierać `@` i `.`)
- Hasło (wymagane, min. 8 znaków)
- Powtórz hasło (wymagane, musi być identyczne jak hasło)

Wymagania:

- pokaż czerwony komunikat błędu pod każdym niepoprawnym polem
- walidacja ma uruchamiać się przy próbie wysłania formularza
- po poprawnym wypełnieniu wyświetl zielony komunikat `Rejestracja zakończona pomyślnie!`
- wyczyść formularz po pomyślnej rejestracji

Wskazówka: użyj jednego obiektu stanu dla danych i jednego dla błędów.

### Zadanie 4 — Średnie/Trudne

Używając React Hook Form, stwórz formularz „Zgłoszenie nieobecności ucznia”.

Pola:

- Imie ucznia (wymagane, min. 2 znaki)
- Nazwisko ucznia (wymagane, min. 2 znaki)
- Klasa (`select`: `1A`, `1B`, `2A`, `2B`, `3A`, `3B`) — wymagane
- Data nieobecności (`input type="date"`) — wymagana
- Powód nieobecności (`textarea`) — wymagany, min. 10 znaków, max. 300 znaków
- Imie i nazwisko rodzica/opiekuna (wymagane)

Wymagania:

- pełna walidacja z odpowiednimi komunikatami
- po poprawnym wysłaniu wyświetl podsumowanie zgłoszenia (imię, klasa, data)
- dodaj przycisk „Wyczyść formularz”, który resetuje wszystkie pola

Wskazówka: użyj hooka `reset()` z `useForm()` i stanu do przechowywania podsumowania.

### Zadanie 5 — Trudne

Stwórz interaktywny „Kreator profilu ucznia” z wieloma krokami (multi-step form).

Formularz ma mieć 3 kroki:

#### Krok 1 — Dane podstawowe

- Imię, Nazwisko, Data urodzenia, Płeć (`radio button`: mężczyzna, kobieta, nie chcę podawać)

#### Krok 2 — Dane kontaktowe

- Email rodzica, Telefon rodzica (9 cyfr), Adres zamieszkania

#### Krok 3 — Dane szkolne

- Klasa (`select`), Poprzednia szkoła (opcjonalne), Uwagi dodatkowe (`textarea`, opcjonalne)

Wymagania:

- przyciski „Dalej” i „Wstecz” do nawigacji między krokami
- wyświetl aktualny krok (np. `Krok 1 z 3`)
- walidacja każdego kroku przed przejściem dalej
- na końcu wyświetl podsumowanie wszystkich wpisanych danych
- możliwość powrotu do wcześniejszego kroku i edycji danych

Wskazówka: użyj `useState` do śledzenia aktualnego kroku i osobnego stanu dla danych z każdego kroku lub jednego dużego obiektu.

### Zadanie 6 — Bardzo trudne

Stwórz zaawansowany System Dziennika Elektronicznego z dynamicznym formularzem.

Opis:

Nauczyciel wypełnia formularz wpisywania ocen. Może dynamicznie dodawać/usuwać uczniów z listy i wpisywać im oceny.

Wymagania:

- pole „Klasa” (`select`) i „Przedmiot” (`select`: min. 5 przedmiotów)
- dynamiczna lista uczniów — nauczyciel może kliknąć `+` aby dodać kolejnego ucznia
- każdy wiersz ucznia zawiera: imię i nazwisko (`input`), ocena (`select 1-6`), komentarz (`input`)
- przycisk `x` przy każdym uczniu usuwa go z listy (ale musi zostać min. 1)
- walidacja: klasa i przedmiot wymagane, każdy uczeń musi mieć imię/nazwisko i ocenę
- po wysłaniu wyświetl tabelę z wpisanymi ocenami
- dodaj funkcję „Eksportuj do JSON” — pobierz dane jako plik `.json` (wskazówka: użyj `Blob` i `URL.createObjectURL`)
- dodaj podsumowanie: średnia ocen z całej klasy

Wskazówka: użyj tablicy obiektów w stanie do przechowywania listy uczniów. Każdy obiekt: `{ id: Date.now(), imie: '', ocena: '1', komentarz: '' }`. Do aktualizacji konkretnego ucznia użyj `map()` po `id`.

---

## Podsumowanie

### Podsumowanie lekcji — Formularze w React

Tematy poznane na tej lekcji:

1. Komponenty kontrolowane
	- Wartość pola jest przechowywana w stanie React (`useState`)
	- Każda zmiana wywołuje `onChange`, co wywołuje `setState`, co daje wyrenderowanie nowej treści
	- Daje pełną kontrolę nad danymi formularza w każdym momencie

2. Obsługa różnych pól
	- `input`: `value + onChange`
	- `textarea`: `value + onChange` (identycznie jak `input`)
	- `select`: `value + onChange` (identycznie jak `input`, lecz z opcjami w środku)

3. Kluczowa zasada wysyłania formularza
	- ZAWSZE używaj `event.preventDefault()` w `onSubmit`. Bez tego strona przeładuje się i stracisz dane.

4. Technika jednego obiektu stanu
	- zamiast 5 osobnych `useState`, jeden obiekt `formData`
	- aktualizacja przez spread (`...poprzedniStan`): `{ ...poprzedniStan, [name]: value }`
	- wymaga atrybutu `name` na każdym polu HTML

5. Walidacja ręczna
	- funkcja `waliduj()` sprawdza pola i zwraca obiekt z błędami
	- błędy wyświetlamy warunkowo pod polami
	- przy braku błędów (`Object.keys(bledy).length === 0`) obsługujemy wysłanie

6. React Hook Form — biblioteka do formularzy
	- `npm install react-hook-form`
	- `useForm()` daje: `register`, `handleSubmit`, `formState`, `reset`
	- `register('nazwaPola', { reguły })` — rejestruje pole z walidacją
	- mniej kodu, lepsza wydajność, profesjonalne rozwiązanie

### Kluczowe różnice — ręczna obsługa vs React Hook Form

#### Ręczna obsługa

- Ilość kodu: dużo
- Rerenderowanie: przy każdym znaku
- Walidacja: własna logika
- Trudność nauki: pomaga zrozumieć React
- Używane w produkcji: rzadko (małe formularze)

#### React Hook Form

- Ilość kodu: mało
- Rerenderowanie: minimalne
- Walidacja: wbudowana
- Trudność nauki: łatwa po nauce podstaw
- Używane w produkcji: bardzo często

Rada: Naucz się najpierw ręcznej obsługi (lepiej rozumiesz co się dzieje), a dopiero potem używaj React Hook Form w projektach.

### Przydatne zasoby

- Dokumentacja React o formularzach: `react.dev/learn/reacting-to-input-with-state`
- React Hook Form: `react-hook-form.com`

---

## Dodatkowe notatki

- Preferuj komponenty kontrolowane w większości przypadków.
- `useRef` jest przydatne tylko wtedy, gdy nie potrzebujesz kontroli nad danymi w czasie rzeczywistym.
- W React formularze tworzy się przez stan, walidację i zdarzenia `onChange` / `onSubmit`.
- Dobrą praktyką jest oddzielanie logiki walidacji od renderowania UI.
- Nie zapominaj o `name` w polach formularza, jeśli używasz jednego obiektu stanu.
