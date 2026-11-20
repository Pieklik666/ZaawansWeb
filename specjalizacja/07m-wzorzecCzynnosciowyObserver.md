# Wzorzec projektowy: Obserwator (Observer)

## Materiał dla ucznia

**Przedmiot:** Projektowanie, programowanie i testowanie aplikacji — INF.04
**Temat:** Powiadamianie obiektów o zmianie stanu z użyciem wzorca Obserwator

## Cele

Po zapoznaniu się z materiałem potrafisz:

- wyjaśnić różnicę między odpytywaniem (polling) a powiadamianiem (push);
- opisać relację jeden-do-wielu między podmiotem a obserwatorami;
- wyjaśnić, jak interfejsy ograniczają powiązania między klasami;
- zaimplementować w TypeScript rejestrowanie, usuwanie i powiadamianie obserwatorów;
- wskazać, dlaczego należy usuwać niepotrzebne subskrypcje.

## 1. Polling czy powiadomienie?

Wyobraź sobie, że czekasz na dostawę produktu.

- **Polling (aktywne odpytywanie):** co chwilę pytasz sklep, czy produkt już dotarł. Powtarzane zapytania mogą obciążać system, nawet jeśli nic się nie zmieniło.
- **Push (powiadomienie):** zapisujesz się na powiadomienia, a sklep informuje cię, gdy produkt dotrze.

W programowaniu polling może oznaczać regularne sprawdzanie stanu w pętli lub timerze. Wzorzec Obserwator pozwala reagować na zmianę stanu bez ciągłego odpytywania. Podobną ideę wykorzystują zdarzenia w przeglądarce (`addEventListener`) oraz `EventEmitter` w Node.js.

## 2. Na czym polega wzorzec Obserwator?

**Obserwator (Observer)** to wzorzec, w którym jeden obiekt — **podmiot** (Subject) — przechowuje listę subskrybentów. Gdy jego stan się zmienia, powiadamia ich, wywołując uzgodnioną metodę, np. `update()`.

Relacja ma charakter **jeden-do-wielu (1:N)**:

```text
OrderStatusTracker (Subject)
        │ przechowuje listę
        ├────────> EmailObserver
        ├────────> SmsObserver
        └────────> DashboardObserver
```

Podmiot zna interfejs obserwatora, ale nie musi znać szczegółów jego działania. Nowy kanał powiadomień można dodać jako kolejną klasę-obserwator bez dopisywania jej obsługi do logiki podmiotu. Takie ograniczenie zależności nazywamy **luźnym powiązaniem**.

Podstawowe operacje:

- `attach(observer)` — dodaj obserwatora;
- `detach(observer)` — usuń obserwatora;
- `notify()` — powiadom zarejestrowanych obserwatorów;
- `update(...)` — reakcja obserwatora na powiadomienie.

## 3. Przykład w TypeScript

```typescript
interface ISubject {
	attach(observer: IObserver): void;
	detach(observer: IObserver): void;
	notify(): void;
}
class ProductStockTracker implements ISubject {
	private observers: IObserver[] = [];
	private stockCount = 0;
	public attach(observer: IObserver): void {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
		}
	}
	public detach(observer: IObserver): void {
		this.observers = this.observers.filter(item => item !== observer);
	}
	public setStock(count: number): void {
		this.stockCount = count;
		this.notify();
	}
	public notify(): void {
		for (const observer of this.observers) {
			observer.update(this.stockCount);
		}
	}
}
interface IObserver {
	update(stockCount: number): void;
}
class EmailAlert implements IObserver {
	public update(stockCount: number): void {
		console.log(`Nowy stan magazynowy: ${stockCount} szt.`);
	}
}
const tracker = new ProductStockTracker();
const emailAlert = new EmailAlert();
tracker.attach(emailAlert);
tracker.setStock(12); // EmailAlert otrzyma powiadomienie
tracker.detach(emailAlert);
```

### Jak działa przykład?

1. `EmailAlert` implementuje `IObserver`, więc udostępnia metodę `update()`.
2. `attach()` dodaje obserwatora do listy, nie dopuszczając do ponownego dodania tej samej instancji.
3. `setStock()` zmienia stan i wywołuje `notify()`.
4. `notify()` przechodzi po liście i przekazuje każdemu obserwatorowi nową wartość.
5. `detach()` usuwa obserwatora, który nie powinien już otrzymywać powiadomień.

## 4. Interfejsy i diagram klas

```text
<<interface>> ISubject                 <<interface>> IObserver
+ attach(observer)                      + update(context)
+ detach(observer)                              ▲
+ notify()                                      ┆ implementuje
      ▲                                         ├─────────────┐
      ┆ implementuje                            ┆             ┆
ProductStockTracker                         EmailAlert    SmsAlert
- observers: IObserver[]
- stockCount: number
```

Linia przerywana z pustym trójkątem oznacza realizację interfejsu. Podmiot zawiera kolekcję referencji do wielu obiektów typu `IObserver`.

**Observer a Facade:** Fasada udostępnia uproszczony interfejs do złożonego podsystemu. Obserwator służy do powiadamiania wielu zarejestrowanych obiektów o zmianie stanu.

## 5. Cykl życia subskrypcji i pamięć

Jeżeli podmiot nadal przechowuje referencję do obserwatora, obiekt ten może pozostać osiągalny dla mechanizmu zarządzania pamięcią (Garbage Collector). Problem może wystąpić, gdy subskrybent nie jest już potrzebny, np. po zamknięciu widoku. Pozostawiona subskrypcja może też powodować nieoczekiwane wywołania. Pamiętaj więc o `detach()` lub innym sposobie zakończenia subskrypcji.

## 6. Ćwiczenie 1 — audyt kodu

Przeanalizuj przykład. Niektóre fragmenty pominięto, ale struktura pokazuje sposób powiadamiania.

```typescript
class OrderService {
	private sms = new SmsNotificationClient();
	private email = new CustomerEmailService();
	private slack = new SlackAlertManager();

	public async changeStatus(orderId: string, status: string): Promise<void> {
		// Zapis nowego statusu zamówienia...
		await this.sms.send(orderId, status);
		await this.email.send(orderId, status);
		await this.slack.post(orderId, status);
	}
}
```

Odpowiedz w parze:

1. Co trzeba zmienić w `OrderService`, jeśli firma rezygnuje ze Slacka i dodaje powiadomienia push?
2. Dlaczego klient nie może w tej konstrukcji łatwo wybrać tylko jednego kanału powiadomień?
3. Jakie obowiązki powinny mieć interfejs podmiotu i interfejs obserwatora?
4. Zaproponuj, jak wzorzec Obserwator ograniczy zależność `OrderService` od konkretnych serwisów.

## 7. Ćwiczenie 2 — status zamówienia

Zaprojektuj system, w którym `OrderStatusTracker` powiadamia subskrybentów o zmianie statusu. Wybierz jedną formę pracy.

**A. Diagram UML** — umieść na diagramie:

- interfejsy `ISubject` i `IObserver`;
- klasę `OrderStatusTracker` z polami `observers: IObserver[]` i `currentStatus: string`;
- co najmniej dwa obserwatory, np. `CustomerSmsObserver` i `WarehouseSystemObserver`;
- relacje realizacji interfejsów oraz kolekcję obserwatorów.

**B. Kod TypeScript** — napisz interfejs obserwatora z metodą `update(orderId: string, status: string): void`, a następnie klasę `AuditLogObserver`, która przechowuje historię zmian.

```typescript
interface IOrderStatusObserver {
	update(orderId: string, status: string): void;
}

class AuditLogObserver implements IOrderStatusObserver {
	private history: string[] = [];

	public update(orderId: string, status: string): void {
		this.history.push(`Zamówienie ${orderId}: ${status}`);
	}

	public getHistory(): string[] {
		return [...this.history];
	}
}
```

## 8. Ćwiczenie 3 — aukcja na żywo

Obiekt `AuctionItem` zarządza ceną przedmiotu. Po poprawnej ofercie powiadamia wszystkich obserwatorów **oprócz osoby, która właśnie złożyła ofertę**.

Zaprojektuj kod tak, aby:

1. `placeBid()` akceptowało ofertę tylko wtedy, gdy jest wyższa od aktualnej ceny;
2. po zaakceptowaniu oferty aktualizowana była cena;
3. `notify()` pomijało obserwatora o identyfikatorze autora oferty.

Punkt wyjścia:

```typescript
interface IAuctionObserver {
	getBidderId(): string;
	update(itemId: string, newHighestBid: number): void;
}
```

**Pytanie do omówienia:** Co powinno się stać, gdy ta sama instancja obserwatora zostanie dołączona kilka razy?

## 9. Bilet wyjścia — sprawdź swoją wiedzę

Odpowiedz samodzielnie:

1. Wyjaśnij różnicę między pollingiem a powiadomieniem push.
2. Jaką rolę pełnią `attach()`, `detach()` i `notify()`?
3. Dlaczego pominięcie `detach()` może być problemem dla cyklu życia obiektu?
4. Czy `Subject` musi znać szczegóły działania konkretnego obserwatora? Uzasadnij.
5. Oceń swoje zrozumienie tematu w skali 1–5:

| Ocena | Opis |
|---:|---|
| 1 | Potrzebuję ponownego wyjaśnienia podstaw. |
| 2 | Rozumiem ideę, ale mam trudności z kodem. |
| 3 | Rozumiem role obiektów i potrzebuję jeszcze ćwiczeń. |
| 4 | Potrafię samodzielnie zaprojektować i napisać podstawową implementację. |
| 5 | Potrafię wyjaśnić wzorzec i pomóc innym. |
