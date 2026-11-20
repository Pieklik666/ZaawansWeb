 # Wzorzec projektowy Command (Polecenie)

## Po tej lekcji

Będziesz umieć:

- wyjaśnić role `Command`, `ConcreteCommand`, `Invoker`, `Receiver` i `Client`;
- odróżnić wzorzec Command od bezpośredniego wywołania logiki biznesowej;
- zaprojektować komendę z metodami `execute()` i `undo()`;
- opisać, jak historia komend może wspierać cofanie operacji;
- wskazać zalety i ograniczenia użycia komend w aplikacji.

## 1. Problem: kto wykonuje żądanie?

Wyobraź sobie, że tę samą operację biznesową (np. wygenerowanie faktury) można uruchomić z przycisku w aplikacji, endpointu REST albo zadania w tle. Jeśli cała logika znajduje się bezpośrednio w obsłudze przycisku lub kontrolerze, trudniej ją ponownie wykorzystać, testować, kolejkować i cofać.

Wzorzec **Command** zamienia żądanie w osobny obiekt. Obiekt przechowuje dane potrzebne do wykonania operacji i udostępnia wspólny sposób jej uruchomienia.

### Analogia: zamówienie w restauracji

- **Client** przygotowuje żądanie, np. wybiera danie.
- **Command** to zapisane zamówienie.
- **Invoker** przyjmuje lub przekazuje zamówienie, ale nie musi znać szczegółów jego realizacji.
- **Receiver** wykonuje właściwą pracę — w analogii jest nim kucharz.

## 2. Role we wzorcu

| Rola | Odpowiedzialność | Przykład |
|---|---|---|
| `Command` | Wspólny interfejs poleceń | `ICommand` |
| `ConcreteCommand` | Przechowuje dane i deleguje wykonanie | `AddToCartCommand` |
| `Invoker` | Uruchamia polecenie; może przechowywać historię | Przycisk, kolejka, `TransactionManager` |
| `Receiver` | Zawiera właściwą logikę biznesową | `CartReceiver`, `BankAccount` |
| `Client` | Tworzy komendę i łączy ją z odbiorcą | Kod konfigurujący aplikację |

```text
Client ── [ tworzy ] ──> ConcreteCommand ── [ wywołuje ] ──> Receiver
                                ^
               [ implementuje ] │
                                |
                              ICommand
                                ^
                  [ uruchamia ] │
                                |
                              Invoker
```

`Invoker` zna interfejs `ICommand`, ale nie musi znać konkretnego odbiorcy ani szczegółów operacji. Dane polecenia można przekazać w konstruktorze `ConcreteCommand`.

## 3. Interfejs w TypeScript

```typescript
interface ICommand {
	execute(): void;
	undo(): void;
}
```

Metody są bezargumentowe, ponieważ komenda otrzymuje potrzebne dane przy tworzeniu. Nie każda operacja musi jednak dać się cofnąć — w takim przypadku sposób obsługi `undo()` trzeba przemyśleć, zamiast zakładać, że cofnięcie zawsze jest możliwe.

### Command a Strategy

- **Strategy** pozwala wymieniać sposób wykonania algorytmu.
- **Command** reprezentuje konkretne żądanie jako obiekt; dzięki temu można je np. przechować, przekazać dalej lub umieścić w historii.

## 4. Gdzie wykorzystuje się Command?

- **Undo/Redo:** historia poleceń może pozwolić cofnąć lub ponowić operacje.
- **Kolejki zadań:** żądanie można przekazać do kolejki, a worker wykonać później. W praktycznym systemie dane przesyłane przez kolejkę muszą mieć format możliwy do serializacji; obiektów TypeScript nie należy traktować jak gotowych wiadomości sieciowych.
- **Dziennik audytowy:** można zapisywać informacje o wykonanej operacji, jej czasie i użytkowniku. Sam wzorzec Command nie jest tym samym co Event Sourcing.

### Pytanie do przemyślenia

Dlaczego komenda, która ma umożliwiać cofnięcie operacji, może potrzebować zapamiętać wcześniejszy stan **przed** zmianą?

## 5. Zadanie 1 — zaprojektuj interfejs

Zapisz interfejs `ICommand` w TypeScript z bezargumentowymi metodami `execute()` i `undo()`. Następnie sprawdź:

1. Czy metody przyjmują parametry?
2. Kiedy komenda otrzyma dane potrzebne do działania?
3. Czy każda możliwa komenda rzeczywiście może być cofnięta?

## 6. Zadanie 2 — koszyk zakupowy

Zaprojektuj komendę dodającą produkt do koszyka. Odbiorca `CartReceiver` zarządza liczbą sztuk każdego produktu.

### Wariant A: diagram UML

Narysuj diagram zawierający:

- `ICommand` z metodami `execute()` i `undo()`;
- `CartReceiver` z metodami `addItem(productId: string, quantity: number)` i `removeItem(productId: string, quantity: number)`;
- `AddToCartCommand` i `RemoveFromCartCommand`;
- `CartInvoker` przechowujący historię komend.

Zaznacz implementację interfejsu, asocjacje oraz widoczność pól i metod (`+`, `-`).

### Wariant B: kod

Uzupełnij lub zaimplementuj poniższy szkielet. Dodaj logikę `undo()` i przemyśl, co powinno się stać, gdy liczba sztuk jest niepoprawna.

```typescript
class CartReceiver {
	private items: Map<string, number> = new Map();

	public addItem(productId: string, quantity: number): void {
		const current = this.items.get(productId) ?? 0;
		this.items.set(productId, current + quantity);
	}

	public removeItem(productId: string, quantity: number): void {
		const current = this.items.get(productId) ?? 0;
		if (current <= quantity) {
			this.items.delete(productId);
		} else {
			this.items.set(productId, current - quantity);
		}
	}
}

class AddToCartCommand implements ICommand {
	constructor(
		private readonly cart: CartReceiver,
		private readonly productId: string,
		private readonly quantity: number,
	) {}

	public execute(): void {
		this.cart.addItem(this.productId, this.quantity);
	}

	public undo(): void {
		this.cart.removeItem(this.productId, this.quantity);
	}
}
```

**Przypadki do sprawdzenia:** ilość równa zero, ilość ujemna, usunięcie większej liczby sztuk niż znajduje się w koszyku, dwukrotne wywołanie `undo()`.

## 7. Zadanie 3 — transakcja bankowa

Zaprojektuj polecenie przelewające kwotę z konta źródłowego na docelowe. `TransactionManager` ma uruchamiać polecenia i umożliwiać wycofanie ostatniego poprawnie wykonanego przelewu.

### Wariant A: diagram sekwencji

Narysuj przepływ:

```text
Client → TransactionManager → TransferCommand → SourceAccount / TargetAccount
```

Uwzględnij wykonanie przelewu, zapis polecenia w historii i wywołanie `undo()` podczas rollbacku.

### Wariant B: implementacja

Napisz klasy `BankAccount`, `TransferCommand` i `TransactionManager`. Uwzględnij co najmniej:

- kontrolę dostępnych środków przed obciążeniem konta;
- informację, czy polecenie zostało wykonane;
- odmowę cofnięcia niewykonanej komendy lub cofnięcia jej drugi raz;
- przywrócenie komendy do historii, jeśli rollback się nie powiedzie.

Szkielet odbiorcy:

```typescript
class BankAccount {
	constructor(
		public readonly accountNumber: string,
		private balance: number,
	) {}

	public debit(amount: number): boolean {
		if (amount <= 0 || this.balance < amount) return false;
		this.balance -= amount;
		return true;
	}

	public credit(amount: number): void {
		if (amount <= 0) throw new Error("Kwota musi być dodatnia.");
		this.balance += amount;
	}

	public getBalance(): number {
		return this.balance;
	}
}
```

**Ważne:** to ćwiczenie pokazuje wzorzec projektowy, a nie kompletny system bankowy. Pomyśl, co powinno się stać, gdy zaksięgowanie na drugim koncie zawiedzie po obciążeniu pierwszego. W rzeczywistym systemie finansowym potrzebne są dodatkowe zabezpieczenia, trwała transakcyjność i obsługa współbieżności.

## 8. Przegląd kodu w parach

Wymieńcie się rozwiązaniami i oceńcie je konstruktywnie:

- Czy `Invoker` zależy od interfejsu, a nie od konkretnej komendy?
- Czy logika biznesowa znajduje się w `Receiver`?
- Czy komenda przechowuje wszystkie dane potrzebne do wykonania?
- Czy błędy i przypadki brzegowe są obsłużone?
- Czy `undo()` jest bezpieczne przy powtórnym wywołaniu?

## 9. Podsumowanie — sprawdź się

Odpowiedz ustnie lub pisemnie:

1. Czy `Invoker` musi znać szczegóły bazy danych? **Nie.**
2. Czy można dodać nową komendę bez zmiany kodu `Invoker`, jeśli korzysta on z `ICommand`? **Zwykle tak.**
3. Czy samo użycie Command automatycznie zapewnia bezpieczny rollback i trwały dziennik audytowy? **Nie.** Trzeba je zaprojektować.
4. Czym Command różni się od Strategy?
