# React: Zarządzanie stanem - Redux i Zustand

## Cele lekcji

Na tej lekcji poznasz problem przekazywania danych przez wiele komponentów (prop drilling)
oraz sposoby centralnego zarządzania stanem aplikacji. Nauczysz się tworzyć store w Zustand
oraz slice w Redux Toolkit. Zrozumiesz, dlaczego centralny stan upraszcza rozbudowane aplikacje.

## Co będziesz umieć po tej lekcji?

- Wyjaśnisz problem prop drilling i potrzebę centralnego zarządzania stanem.
- Opiszesz pojęcia: store, action, reducer, dispatch i selector.
- Utworzysz store w Zustand oraz slice w Redux Toolkit.
- Odczytasz stan w komponentach za pomocą `useSelector` i hooka ze store Zustand.
- Wyślesz akcje do store przez `dispatch` lub wywołanie funkcji akcji.
- Przetestujesz działanie aplikacji i prześledzisz zmiany stanu.


---


# Informacje


## Ogólne informacje

W małej aplikacji stan komponentu (`useState`) wystarcza. W większej aplikacji wiele
komponentów potrzebuje tych samych danych, np. zalogowanego użytkownika. Wtedy stan
trzeba udostępnić w jednym, wspólnym miejscu. Do tego służą biblioteki do zarządzania
stanem, np. Redux Toolkit i Zustand.

Przykłady:

- Stan lokalny (local state) - stan przechowywany w jednym komponencie, np. przez `useState`.
- Stan globalny (global state) - stan dostępny dla wielu komponentów z jednego miejsca.
- Store (magazyn stanu) - obiekt przechowujący stan aplikacji lub jej części.


## Prop drilling

Prop drilling (przekazywanie props przez wiele poziomów) - sytuacja, w której dane
przechodzą przez komponenty pośrednie, które same ich nie używają.

Drzewo komponentów: `App` -> `Layout` -> `Header` -> `UserBadge`.
Stan `user` znajduje się w `App`, ale `Layout` i `Header` przekazują go dalej, mimo że
nie korzystają z niego. Centralny store eliminuje ten problem: `UserBadge` pobiera
`user` bezpośrednio ze store.


## Store

Store (magazyn stanu) - centralne miejsce przechowujące stan całej aplikacji lub jej części.
Komponenty odczytują z niego dane i nie muszą przekazywać ich przez props.

Przykład: `{ count: 0 }` to store z jedną wartością liczbową.


## Action

Action (akcja) - obiekt lub funkcja opisująca, co ma się stać, np. `increment` lub
`addTodo`. Akcja sama nie zmienia stanu. Zawiera informację o zdarzeniu,
a ewentualne dane przenosi w polu `payload`.


## Reducer

Reducer (reduktor) - czysta funkcja, która na podstawie aktualnego stanu i akcji
zwraca nowy stan. Czysta funkcja nie modyfikuje argumentów i dla tych samych danych
zawsze zwraca ten sam wynik. Stan zmienia się wyłącznie przez akcje.


## Dispatch

Dispatch (wysłanie) - wywołanie akcji w celu uruchomienia reducera. Schemat przepływu:

component -> `dispatch(action)` -> reducer -> nowy stan w store -> ponowny render komponentów.

Analogia: store to centralna kasa banku, action to formularz wpłaty, a reducer to pracownik
aktualizujący saldo.


## Selector

Selector (selektor) - funkcja pobierająca z store tylko potrzebną część stanu, np.
`(state) => state.counter.value`. Komponent korzysta z selektora, aby odczytać dane.


## Redux Toolkit a Zustand

- Redux Toolkit - dużo konwencji, rozbudowany ekosystem, narzędzia deweloperskie
  (Redux DevTools). Wymaga providera (`Provider`) w głównym pliku aplikacji.
- Zustand - minimum kodu, brak providera, API oparte na funkcji `create`.
- Recoil - alternatywa oparta na modelu atomów i selektorów.


## Instalacja Redux i Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

## Instalacja Zustand

```bash
npm install zustand
```

---


# Przydatne funkcje / składnia / itd


## createSlice

### Opis

`createSlice` z Redux Toolkit tworzy slice - fragment stanu wraz z reducerami i akcjami.
Nazwy akcji są generowane automatycznie na podstawie nazw funkcji w `reducers`.
Dzięki bibliotece Immer można w reducerze zapisać zwykłą mutację stanu, np. `state.value += 1`.

### Składnia

```javascript
import { createSlice } from '@reduxjs/toolkit';

const nazwaSlice = createSlice({
  name: 'nazwa',     // nazwa slice, prefiks akcji
  initialState: {},  // stan początkowy
  reducers: {
    nazwaAkcji: (state, action) => {
      // zmiana stanu
    },
  },
});

export const { nazwaAkcji } = nazwaSlice.actions;
export default nazwaSlice.reducer;
```

### Przykład

```javascript
import { createSlice } from '@reduxjs/toolkit';

// Slice licznika: stan to obiekt z polem value
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    // Zwiększenie wartości o 1
    increment: (state) => {
      state.value += 1;
    },
  },
});

// Eksport akcji do użycia w komponentach
export const { increment } = counterSlice.actions;

// Eksport reducera do konfiguracji store
export default counterSlice.reducer;
```

Po wysłaniu akcji `increment()` pole `value` wzrasta z `0` do `1`.

### Zadanie

Utwórz slice `licznik` z polem `wartosc` ustawionym na `0`. Dodaj akcję `dodaj`,
która zwiększa wartość o 2. Wyeksportuj akcję i reducer.


## configureStore

### Opis

`configureStore` tworzy store Redux na podstawie słownika reducerów. Klucz w słowniku
staje się nazwą części stanu.

### Składnia

```javascript
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    nazwaStanu: nazwaReducer,  // klucz to nazwa części stanu
  },
});
```

### Przykład

```javascript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

// Store z jedną częścią stanu o nazwie counter
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// Odczytany stan ma postać: { counter: { value: 0 } }
console.log(store.getState());
```

Wynik w konsoli: `{ counter: { value: 0 } }`.

### Zadanie

Utwórz store z dwoma reducerami: `counter` i `todos`. Wypisz w konsoli wynik `getState()`.


## useSelector i useDispatch

### Opis

`useSelector` odczytuje dane ze store i ponownie renderuje komponent,
gdy wybrana wartość się zmieni.
`useDispatch` zwraca funkcję `dispatch`, którą wysyłasz akcje do store.
Oba hooki wymagają opakowania aplikacji w `Provider` z pakietu `react-redux`.

### Składnia

```javascript
import { useSelector, useDispatch } from 'react-redux';

const wartosc = useSelector((state) => state.nazwaStanu.pole);
const dispatch = useDispatch();
dispatch(nazwaAkcji());
```

### Przykład

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { increment } from './counterSlice';

function Licznik() {
  // Odczyt wartości licznika ze store
  const wartosc = useSelector((state) => state.counter.value);
  // Funkcja do wysyłania akcji
  const dispatch = useDispatch();

  return (
    <div>
      {/* Wyświetlenie aktualnej wartości */}
      <p>{wartosc}</p>
      {/* Kliknięcie wysyła akcję increment do store */}
      <button onClick={() => dispatch(increment())}>+1</button>
    </div>
  );
}
```

Po każdym kliknięciu przycisku wyświetlana wartość rośnie: `1`, `2`, `3`.

### Zadanie

Dodaj do komponentu `Licznik` przycisk `Reset`, który wysyła akcję `reset`.
Akcja powinna ustawiać wartość na `0`.


## create (Zustand)

### Opis

`create` z biblioteki Zustand tworzy hook, który daje dostęp do store. Store to obiekt
z danymi i funkcjami. Funkcja `set` aktualizuje stan i nie wymaga providera.

### Składnia

```javascript
import { create } from 'zustand';

export const useNazwaStore = create((set) => ({
  pole: 0,
  zmien: () => set((state) => ({ pole: state.pole + 1 })),
}));
```

### Przykład

```javascript
import { create } from 'zustand';

// Hook useCounterStore udostępnia stan i funkcje do jego zmiany
export const useCounterStore = create((set) => ({
  count: 0,
  // Funkcja set zmienia tylko pole count
  increment: () => set((state) => ({ count: state.count + 1 })),
  // Ustawienie licznika na wartość początkową
  reset: () => set({ count: 0 }),
}));
```

Po wywołaniu `increment()` pole `count` wzrasta z `0` do `1`.

### Zadanie

Utwórz store `useLicznikStore` z polem `count` i akcją `decrement`, która zmniejsza wartość
o 1. Sprawdź w konsoli wynik `useLicznikStore.getState()` po dwóch wywołaniach akcji.


## persist (Zustand)

### Opis

`persist` to middleware z pakietu `zustand/middleware`. Zapisuje stan w `localStorage`
przeglądarki, dzięki czemu dane zostają po odświeżeniu strony. Parametr `name`
określa klucz w `localStorage`.

### Składnia

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNazwaStore = create(
  persist(
    (set) => ({
      pole: 0,
    }),
    { name: 'klucz-storage' }
  )
);
```

### Przykład

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store zapisuje stan w localStorage pod kluczem counter-storage
export const useCounterStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    { name: 'counter-storage' }
  )
);
```

Po kliknięciu akcji `increment` i odświeżeniu strony wartość `count` pozostaje taka sama.

### Zadanie

Dodaj middleware `persist` do store `useLicznikStore` z zadania z sekcji `create`.
Sprawdź w DevTools przeglądarki (zakładka Application, sekcja Local Storage), czy stan jest zapisany.


---


# Przykłady


## Przykład 1: Licznik w Zustand

### Opis

Przykład pokazuje kompletny licznik z przyciskami zwiększania i resetowania.
Stan jest odczytywany w komponencie bez providera.

### Składnia

```javascript
const pole = useNazwaStore((state) => state.pole);
```

### Przykład

```javascript
import { useCounterStore } from './useCounterStore';

function Licznik() {
  // Pobranie wartości count i akcji ze store
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div>
      {/* Wyświetlenie wartości licznika */}
      <p>Licznik: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

Po kliknięciu `+1` trzy razy i `Reset` widoczna wartość to: `Licznik: 0`.

### Zadanie

Dodaj do komponentu przycisk `-`, który wywołuje akcję `decrement` i nie schodzi poniżej `0`.


## Przykład 2: Licznik w Redux Toolkit

### Opis

Przykład pokazuje, jak podłączyć store Redux do aplikacji przez `Provider`
i wyświetlić licznik w komponencie.

### Składnia

```javascript
<Provider store={store}>
  <App />
</Provider>
```

### Przykład

```javascript
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import Licznik from './Licznik';

// Provider udostępnia store wszystkim komponentom w aplikacji
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Licznik />
  </Provider>
);
```

Po uruchomieniu aplikacji na ekranie pojawia się licznik z wartością `0`.

### Zadanie

Przenieś licznik z przykładu 1 do store Redux Toolkit i sprawdź, czy działa
tak samo jak wersja w Zustand.


---


# Zadania


## Zadanie 1: [ŁATWE] Dekrementacja w Zustand

Praca samodzielna.

Dodaj do store Zustand akcję `decrement`, która zmniejsza licznik, nie schodząc poniżej `0`.
Dodaj przycisk `-` w komponencie.

Pytania pomocnicze:

- Czy komponent odświeża się po kliknięciu?
- Czy akcja została wyeksportowana i pobrana w komponencie?


## Zadanie 2: [ŚREDNIE] Lista zadań w Redux Toolkit

Praca w parach. Jedna osoba pisze kod, druga kontroluje błędy w konsoli i w Pylance.

Utwórz slice Redux Toolkit `todos` z akcjami `addTodo`, `toggleTodo` i `removeTodo`.
Stan to tablica obiektów `{ id, text, done }`. Podłącz store przez `Provider`
i wyświetl listę z użyciem `useSelector` i `useDispatch`.

Pytania pomocnicze:

- Co się stanie, gdy `addTodo` nie dostanie `payload`?
- Dlaczego `toggleTodo` szuka elementu po `id`, a nie po indeksie?


## Zadanie 3: [TRUDNE] Filtrowanie zadań w Zustand

Praca samodzielna.

Zbuduj listę zadań w Zustand z middleware `persist` (zapis w `localStorage`)
oraz filtrem `all`, `active` i `done`. Akcja `setFilter` zmienia aktywny filtr.
Komponent wyświetla tylko zadania pasujące do wybranego filtra.

Pytania pomocnicze:

- Dlaczego trzeba zwrócić nową tablicę (`map`), a nie zmieniać obiekt?
- Gdzie w DevTools przeglądarki sprawdzisz zapisany stan?


## Zadanie 4: [EXPERT] Selektor widocznych zadań w Redux Toolkit

Praca samodzielna.

Rozszerz slice `todos` z zadania 2 o filtr zadań (`all`, `active`, `done`) i akcję
`setFilter`. Napisz selektor, który zwraca tylko zadania pasujące do filtra.
Dodaj licznik aktywnych zadań, obliczany selektorem na podstawie stanu store.

Pytania pomocnicze:

- Dlaczego selektor nie powinien modyfikować stanu?
- Czy licznik aktywnych zadań powinien być zapisany w stanie, czy obliczany na bieżąco?


---


# Podsumowanie


## Kluczowe wnioski

- Prop drilling komplikuje kod, gdy dane są potrzebne w odległych komponentach.
- Store centralizuje stan, a komponenty odczytują go przez selektory.
- Stan zmienia się wyłącznie przez akcje obsługiwane przez czyste reducery.
- Zustand wymaga minimum kodu, a Redux Toolkit oferuje rozbudowane narzędzia.


## Najczęstsze błędy

- Zwracanie zmienionego stanu przez `return` i jednoczesna mutacja w reducerze.
- Brak `Provider` w aplikacji Redux.
- Zmienianie obiektu zamiast zwracania nowego obiektu w Zustand.
- Pominięcie eksportu akcji lub reducera.


## Dobre praktyki

- Nazywaj akcje czasownikami, np. `addTodo`, `toggleTodo`.
- Używaj selektorów zamiast odczytywać cały stan.
- Formatuj kod skrótem Shift + Alt + F i sprawdzaj podpowiedzi Pylance.
- Sprawdzaj zmiany stanu w DevTools.


## Co dalej?

- Przeczytaj dokumentację Redux Toolkit i Zustand.
- Sprawdź bibliotekę Recoil i porównaj ją z pozostałymi rozwiązaniami.
- Dodaj do swojego projektu middleware `persist` oraz narzędzia deweloperskie.
