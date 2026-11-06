# React: useCallback i useMemo (optymalizacja wydajności)

## Cele lekcji

Na tej lekcji poznasz mechanizmy, które pozwalają ograniczyć zbędne renderowanie komponentów
w React. Dowiesz się, czym różni się `useCallback` od `useMemo`, jak działa `React.memo`
oraz jak poprawnie dobierać tablicę zależności. Umiejętność optymalizacji jest ważna w większych
aplikacjach, gdzie każdy zbędny render obciąża przeglądarkę.

## Co będziesz umieć po tej lekcji?

- Wyjaśnisz, kiedy i dlaczego komponent React renderuje się ponownie.
- Rozróżnisz `useCallback` (memoizacja funkcji) od `useMemo` (memoizacja wartości).
- Zastosujesz `React.memo`, `useCallback` i `useMemo` w aplikacji TODO.
- Zdiagnozujesz zbędne rerendery za pomocą `console.log` i Profilera.
- Dobierzesz poprawną tablicę zależności.
- Ocenisz, kiedy memoizacja ma sens, a kiedy tylko zwiększa koszt.

---

# Informacje

## Ogólne informacje

Komponent React renderuje się ponownie, gdy zmieni się jego stan lub props. Zmiana stanu
w komponencie nadrzędnym powoduje renderowanie wszystkich jego dzieci, nawet tych, których dane
się nie zmieniły. Przykładowo, gdy w drzewie `App` -> `TodoList` -> `TodoItem` zmienisz stan
w `App`, wszystkie komponenty `TodoItem` zostaną wyrenderowane ponownie.

Przykłady:

- Re-render (re-render) - ponowne wywołanie funkcji komponentu i aktualizacja interfejsu
- Memoizacja (memoization) - zapamiętanie wyniku, aby nie liczyć go ponownie
- Referencja (reference) - adres obiektu w pamięci; dwie identyczne funkcje mają różne referencje

## Równość referencji

Funkcje i obiekty tworzone w komponencie są tworzone od nowa przy każdym renderze.
Porównanie `===` dla dwóch identycznych funkcji zwraca `false`:

```jsx
// Dwie funkcje o takim samym kodzie, ale różne referencje
const f1 = () => {};
const f2 = () => {};

console.log(f1 === f2); // Wynik: false
```

## React.memo

`React.memo` (memo) - funkcja opakowująca komponent. Porównuje propsy płytko i pomija render,
jeśli propsy się nie zmieniły. Nowa funkcja przekazana w propsach zawsze jest "zmianą",
dlatego sama w sobie unieważnia memoizację.

---

# Przydatne funkcje / składnia / itd

## useCallback

### Opis

`useCallback` zwraca tę samą referencję funkcji między renderami, dopóki nie zmienią się
wartości z tablicy zależności.

### Składnia

```jsx
const memoizedFn = useCallback(() => {
	// logika funkcji
}, [zaleznosc1, zaleznosc2]);
```

### Przykład

```jsx
import { useCallback, useState } from "react";

export default function Licznik() {
	const [liczba, setLiczba] = useState(0);

	// Funkcja tworzona raz; zależności puste, bo używamy funkcyjnej aktualizacji
	const zwieksz = useCallback(() => {
		setLiczba((poprzednia) => poprzednia + 1);
	}, []);

	// Przy każdym kliknięciu referencja zwieksz pozostaje ta sama
	return <button onClick={zwieksz}>Liczba: {liczba}</button>;
}
```

Wynik: po każdym kliknięciu przycisk pokazuje kolejną wartość (1, 2, 3...).
Funkcja `zwieksz` nie zmienia referencji między renderami.

### Zadanie

Napisz komponent `Termometr`, który zawiera przycisk "Ociepl" zwiększający temperaturę o 1 stopień.
Funkcję obsługi kliknięcia opakuj w `useCallback`. Sprawdź w konsoli, że zmiana temperatury działa
poprawnie.

## useMemo

### Opis

`useMemo` zapamiętuje wynik obliczeń i przelicza go tylko wtedy, gdy zmienią się wartości
z tablicy zależności.

### Składnia

```jsx
const memoizedValue = useMemo(() => obliczenia(a, b), [a, b]);
```

### Przykład

```jsx
import { useMemo, useState } from "react";

export default function Kwadraty() {
	const [n, setN] = useState(3);
	const [kolor, setKolor] = useState("niebieski");

	// Obliczenie wykonywane tylko wtedy, gdy zmieni się n
	const kwadrat = useMemo(() => {
		console.log("Liczenie kwadratu...");
		return n * n;
	}, [n]);

	// Zmiana koloru nie powoduje ponownego liczenia kwadratu
	return (
		<div style={{ color: kolor }}>
			<p>Kwadrat liczby {n}: {kwadrat}</p>
			<button onClick={() => setN(n + 1)}>Zwiększ n</button>
			<button onClick={() => setKolor("czerwony")}>Zmień kolor</button>
		</div>
	);
}
```

Wynik: w konsoli komunikat "Liczenie kwadratu..." pojawia się przy starcie i po kliknięciu
"Zwiększ n", ale nie po kliknięciu "Zmień kolor".

### Zadanie

Napisz komponent `Sumator`, który przechowuje tablicę liczb i wyświetla ich sumę. Sumę oblicz
w `useMemo`. Dodaj przycisk, który zmienia niezwiązany stan (np. tekst etykiety) i sprawdź
w konsoli, że suma nie jest liczona ponownie.

## React.memo

### Opis

`React.memo` pomija ponowny render komponentu, jeśli jego propsy są takie same jak
w poprzednim renderze. Używa do tego **porównania płytkiego**.

### Składnia

```jsx
const MojKomponent = memo(function MojKomponent(props) {
	// JSX komponentu
});
```

### Przykład

```jsx
import { memo } from "react";

// Komponent renderuje się ponownie tylko wtedy, gdy zmienią się propsy
const Etykieta = memo(function Etykieta({ tekst }) {
	console.log("Render Etykieta:", tekst);
	return <p>{tekst}</p>;
});

export default Etykieta;
```

Wynik: komunikat w konsoli pojawia się tylko wtedy, gdy zmienia się wartość `tekst`.

### Zadanie

Utwórz komponent `Naglowek` opakowany w `React.memo`, który przyjmuje prop `tytul`. Dodaj
`console.log` w ciele komponentu. Wyrenderuj go w komponencie nadrzędnym, który zmienia
swój własny stan niezwiązany z `tytul`. Zaobserwuj, ile razy loguje się komunikat.

---

## Porównanie głębokie w React.memo

### Opis

**Porównanie głębokie** sprawdza, czy wszystkie właściwości obiektu (w tym zagnieżdżone) są takie same. Do sprawdzenia głębokiego można użyć np. biblioteki `lodash` i funkcji `isEqual`.
Domyślnie React.memo używa porównania płytkiego. Można dostarczyć własną funkcję porównującą propsy, aby wykonać porównanie głębokie.

### Składnia

```jsx
const Komponent = memo(FunkcjaKomponentu, (prevProps, nextProps) => {
	return isEqual(prevProps, nextProps); // porównanie głębokie
});
```

### Przykład

```jsx
import { memo } from "react";
import isEqual from "lodash/isEqual";

const Komponent = memo(function Komponent({ dane }) {
	console.log("Render Komponent:", dane);
	return <p>{JSON.stringify(dane)}</p>;
}, (prevProps, nextProps) => {
	return isEqual(prevProps, nextProps); // porównanie głębokie
});

export default Komponent;
```

### Zadanie

Utwórz komponent `Komponent` przyjmujący prop `dane` będący obiektem. Opakuj go w `React.memo` z funkcją porównującą używającą `isEqual`. W komponencie nadrzędnym zmieniaj stan niezwiązany z `dane` i obserwuj, że `Komponent` nie renderuje się ponownie, jeśli `dane` pozostaje takie samo.

---

# Przykłady

## Filtrowanie listy z useMemo

### Opis

Filtrowanie dużej listy jest typowym zadaniem, które warto zapamiętać. Wynik zależy tylko od
listy i frazy wyszukiwania.

### Składnia

```jsx
const wynik = useMemo(() => filtruj(lista, fraza), [lista, fraza]);
```

### Przykład

```jsx
import { useMemo, useState } from "react";

const produkty = ["Jabłko", "Gruszka", "Banan", "Ananas"];

export default function Wyszukiwarka() {
	const [fraza, setFraza] = useState("");

	// Filtrowanie wykonywane tylko przy zmianie frazy
	const znalezione = useMemo(
		() =>
			produkty.filter((p) =>
				p.toLowerCase().includes(fraza.toLowerCase())
			),
		[fraza]
	);

	return (
		<div>
			<input value={fraza} onChange={(e) => setFraza(e.target.value)} />
			<ul>
				{znalezione.map((p) => (
					<li key={p}>{p}</li>
				))}
			</ul>
		</div>
	);
}
```

Wynik: po wpisaniu "an" lista pokazuje "Banan" i "Ananas".

### Zadanie

Dodaj do komponentu `Wyszukiwarka` licznik znalezionych produktów, obliczany w `useMemo`.

## Stabilna funkcja dla komponentu potomnego

### Opis

Gdy komponent potomny jest opakowany w `React.memo`, przekazanie mu funkcji z `useCallback`
pozwala uniknąć zbędnych renderów.

### Składnia

```jsx
const obsluga = useCallback((argument) => {
	// logika
}, [zaleznosc]);
```

### Przykład

```jsx
import { memo, useCallback, useState } from "react";

// Komponent przycisku, renderowany tylko przy zmianie propsów
const Przycisk = memo(function Przycisk({ onKlik, etykieta }) {
	console.log("Render Przycisk:", etykieta);
	return <button onClick={onKlik}>{etykieta}</button>;
});

export default function Panel() {
	const [licznik, setLicznik] = useState(0);
	const [tekst, setTekst] = useState("");

	// Referencja funkcji jest stabilna, więc Przycisk nie renderuje się przy zmianie tekstu
	const dodaj = useCallback(() => setLicznik((l) => l + 1), []);

	return (
		<div>
			<p>Licznik: {licznik}</p>
			<Przycisk onKlik={dodaj} etykieta="Dodaj" />
			<input value={tekst} onChange={(e) => setTekst(e.target.value)} />
		</div>
	);
}
```

Wynik: w konsoli komunikat "Render Przycisk: Dodaj" pojawia się tylko przy starcie.
Kliknięcie przycisku i wpisywanie tekstu nie powodują renderu `Przycisk`, ponieważ
jego propsy (`onKlik` i `etykieta`) się nie zmieniają.

### Zadanie

Dodaj do komponentu `Panel` drugi przycisk "Resetuj" z własną funkcją opakowaną w `useCallback`.
Sprawdź w konsoli, czy wpisywanie tekstu nie powoduje renderu żadnego z przycisków.

---

# Zadania

## Zadanie 1: [ŁATWE] Licznik z useCallback

Napisz komponent `Licznik`, który wyświetla liczbę i posiada przycisk "+1". Funkcję zwiększającą
opakuj w `useCallback`. Dodaj `console.log` w ciele komponentu i zaobserwuj, kiedy się loguje.

## Zadanie 2: [ŚREDNIE] Lista zadań z memoizacją

Zbuduj listę zadań z polem tekstowym do filtrowania. Wyodrębnij komponent `ElementListy`
opakowany w `React.memo`. Funkcje obsługi przekaż przez `useCallback`, a przefiltrowaną listę
oblicz w `useMemo`. Sprawdź w konsoli, czy zmiana filtra nie powoduje renderu elementów.

## Zadanie 3: [TRUDNE] Statystyki i motyw

Dodaj do aplikacji z zadania 2 funkcję liczącą statystyki (np. liczbę wykonanych zadań) ze sztucznym
opóźnieniem około 200 ms oraz przełącznik motywu jasny/ciemny. Za pomocą `useMemo` zapobiegnij
przeliczaniu statystyk przy zmianie motywu. Porównaj czas w Profilerze React DevTools z wersją
bez `useMemo`. Zapisz wnioski w komentarzu w kodzie.

## Zadanie 4: [EKSPERT] Diagnoza rerenderów

Otrzymasz aplikację z wieloma komponentami potomnymi, która renderuje się zbyt często.
Za pomocą Profilera React DevTools zidentyfikuj komponenty z niepotrzebnymi renderami.
Zastosuj `React.memo`, `useCallback` i `useMemo` tam, gdzie to uzasadnione, i wyjaśnij
w komentarzu, dlaczego w pozostałych miejscach memoizacja nie jest potrzebna.

---

# Podsumowanie

## Kluczowe wnioski

- Zmiana stanu w komponencie renderuje wszystkie jego dzieci.
- `useCallback` zapamiętuje funkcję, a `useMemo` zapamiętuje wynik obliczeń.
- `React.memo` działa razem z `useCallback`, bo stabilne referencje pozwalają pominąć render.
- Tablica zależności określa, kiedy memoizacja się unieważnia.

## Najczęstsze błędy

- Brak zależności w tablicy, np. użycie `todos` w `useCallback` bez wpisania go do zależności.
- Używanie `useCallback` bez `React.memo` w komponencie potomnym, co nic nie daje.
- Memoizacja prostych obliczeń, które są szybsze niż samo zapamiętanie wyniku.
- Ignorowanie ostrzeżeń ESLint (`react-hooks/exhaustive-deps`).

## Dobre praktyki

- Najpierw zmierz problem (console.log, Profiler), potem optymalizuj.
- Używaj funkcyjnej aktualizacji stanu (`prev => ...`), aby ograniczyć zależności.
- Formatuj kod skrótem Shift + Alt + F.
- Nie stosuj memoizacji wszędzie bez potrzeby.

## Co dalej?

Sprawdź dokumentację React dotyczącą hooków `useCallback`, `useMemo` oraz `React.memo`.
Przetestuj optymalizację w większej aplikacji i zmierz efekty w Profilerze React DevTools.
