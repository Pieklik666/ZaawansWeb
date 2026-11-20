 # Wzorzec projektowy Strategia (Strategy)

## Materiał dla ucznia — INF.04

**Temat:** Wydzielanie wymiennych algorytmów za pomocą wzorca Strategia
**Czas pracy:** 2 × 45 minut

### Cele

Po zajęciach potrafisz:

- wyjaśnić, kiedy rozbudowany `if-else` lub `switch` staje się trudny w utrzymaniu;
- wskazać kontekst, interfejs strategii i konkretne strategie;
- napisać w TypeScript interfejs strategii oraz klasę, która deleguje do niej obliczenia;
- zmienić strategię w czasie działania programu i narysować podstawowy diagram UML.

## 1. Na czym polega wzorzec Strategia?

Wyobraź sobie nawigację: cel podróży pozostaje ten sam, ale trasę można wyznaczyć dla samochodu, roweru lub podróży pieszej. Każdy wariant ma własny algorytm. Nawigacja nie musi zawierać całej logiki wszystkich tras w jednym, rozbudowanym bloku warunkowym — może korzystać z wybranego algorytmu.

**Strategia** to wzorzec czynnościowy, który definiuje rodzinę algorytmów, umieszcza każdy z nich w osobnej klasie i umożliwia ich wymianę. Jest to jeden z wzorców opisanych przez Gang of Four (GoF).

Wzorzec składa się z trzech elementów:

1. **Interfejs strategii** — wspólny kontrakt określający metodę algorytmu.
2. **Konkretne strategie** — osobne implementacje tego kontraktu.
3. **Kontekst** — obiekt przechowujący wybraną strategię i delegujący jej wykonanie.

Kontekst zna interfejs, ale nie musi znać szczegółów obliczeń konkretnej strategii.

### Zmiana strategii w trakcie działania

Kontekst może otrzymać strategię w konstruktorze albo udostępnić metodę, np. `setStrategy()`. Dzięki temu program może wybrać inną implementację bez przebudowywania samego kontekstu.

### Kiedy warto rozważyć ten wzorzec?

- Gdy istnieje kilka wariantów jednego zadania, np. obliczania rabatu lub kosztu dostawy.
- Gdy kolejne warianty powodują rozrost instrukcji warunkowych.
- Gdy algorytmy mają być testowane i rozwijane niezależnie.

Wzorzec nie zawsze jest potrzebny: dla jednego prostego wariantu dodatkowe klasy mogą niepotrzebnie komplikować projekt. Kosztem Strategii jest większa liczba klas oraz konieczność wyboru właściwej strategii.

## 2. Strategia w TypeScript

Poniższy przykład oblicza cenę po rabacie. Interfejs zapewnia wspólną metodę, a klasy realizują różne algorytmy.

```typescript
interface IDiscountStrategy {
	applyDiscount(price: number): number;
}

class RegularCustomerDiscount implements IDiscountStrategy {
	public applyDiscount(price: number): number {
		return price;
	}
}

class VipMemberDiscount implements IDiscountStrategy {
	public applyDiscount(price: number): number {
		return price * 0.85;
	}
}

class BlackFridayDiscount implements IDiscountStrategy {
	public applyDiscount(price: number): number {
		return price * 0.5;
	}
}

class OrderContext {
	constructor(private discountStrategy: IDiscountStrategy) {}

	public setStrategy(strategy: IDiscountStrategy): void {
		this.discountStrategy = strategy;
	}

	public checkout(cartValue: number): number {
		return this.discountStrategy.applyDiscount(cartValue);
	}
}

const order = new OrderContext(new RegularCustomerDiscount());
console.log(order.checkout(200)); // 200

order.setStrategy(new VipMemberDiscount());
console.log(order.checkout(200)); // 170
```

`OrderContext` przekazuje obliczenie do aktualnej strategii. Dodanie nowego algorytmu może polegać na utworzeniu kolejnej klasy implementującej `IDiscountStrategy`.

### Słowniczek kodu

- `implements IDiscountStrategy` — deklaruje, że klasa realizuje kontrakt interfejsu.
- `private` — pole jest dostępne wewnątrz klasy.
- `setStrategy()` — zastępuje używaną strategię.
- `this.discountStrategy.applyDiscount(...)` — deleguje obliczenie do strategii; konkretna metoda jest wywoływana polimorficznie.

## 3. Diagram UML

Przykładowy zapis relacji:

```text
                 <<interface>>
                IDiscountStrategy
                + applyDiscount(price): number
                   △              △
                   ┆               ┆
       VipMemberDiscount     RegularCustomerDiscount
                   ┆
                   ┆
              OrderContext ───────> IDiscountStrategy
              - discountStrategy
              + setStrategy(strategy): void
              + checkout(price): number
```

W UML linia przerywana z pustym trójkątem oznacza realizację interfejsu. Kontekst ma referencję do interfejsu strategii. Zależnie od sposobu rysowania diagramu pokaż tę relację jako asocjację lub zależność zgodnie z wymaganiami zadania.

## 4. Strategia a Fasada

- **Fasada** udostępnia prosty punkt wejścia do grupy usług lub podsystemów.
- **Strategia** pozwala wymieniać implementację jednego zadania, np. algorytm naliczania rabatu.

## 5. Karta pracy — analiza kosztów dostawy

Przeanalizuj kod. Zwróć uwagę, że klasa zawiera reguły kilku przewoźników.

```typescript
class ShippingCostCalculator {
	public calculateShipping(
		carrier: string,
		weightKg: number,
		distanceKm: number,
		isExpress: boolean
	): number {
		let finalCost = 0;

		switch (carrier.toUpperCase()) {
			case 'DHL':
				finalCost = 15 + weightKg * 1.8;
				if (distanceKm > 100) finalCost += (distanceKm - 100) * 0.4;
				if (isExpress) finalCost *= 1.3;
				break;
			case 'INPOST_PACZKOMAT':
				if (weightKg > 25) throw new Error('Przesyłka jest zbyt ciężka.');
				finalCost = 12.5 + (isExpress ? 5 : 0);
				break;
			case 'DPD_COURIER':
				finalCost = 18 + weightKg * 2.1;
				if (distanceKm > 200) finalCost += 25;
				break;
			case 'POCZTA_POLSKA':
				finalCost = 9.9 + weightKg * 0.95;
				break;
			default:
				throw new Error(`Nieobsługiwany przewoźnik: ${carrier}`);
		}

		return Math.round(finalCost * 100) / 100;
	}
}
```

Odpowiedz w parze:

1. Co trzeba zmienić, aby dodać nowego przewoźnika? Jakie ryzyko wiąże się z modyfikacją tej klasy?
2. Dlaczego reguły obliczeń poszczególnych przewoźników są trudniejsze do testowania niezależnie?
3. Zaproponuj sygnaturę metody interfejsu `IShippingStrategy`, która przyjmuje potrzebne dane i zwraca koszt.
4. Wskaż elementy kodu, które można przenieść do konkretnych strategii.

**Miejsce na odpowiedzi:**
....................................................................................................................
....................................................................................................................
....................................................................................................................

## 6. Zadania projektowe

### Zadanie A — rabaty w koszyku

Zaprojektuj rozwiązanie z interfejsem `IDiscountStrategy` i kontekstem `CartContext`. Dodaj strategie:

- `PercentageDiscount` — rabat procentowy;
- `FixedAmountDiscount` — rabat o stałą kwotę, cena końcowa nie może być ujemna;
- `NoDiscount` — brak rabatu.

**Wariant 1 — UML:** Narysuj diagram klas. Uwzględnij widoczność (`+`, `-`), interfejs, jego implementacje i relację kontekstu ze strategią.

**Wariant 2 — TypeScript:** Zapisz interfejs oraz klasy `CartContext` i co najmniej dwie strategie. Dodaj `setStrategy()`.

**Miejsce na diagram lub kod:**

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                                                                              │
│                                                                              │
│                                                                              │
│                                                                              │
│                                                                              │
│                                                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Zadanie B — płatności

Aplikacja sklepu obsługuje płatności kartą, BLIK-iem i przelewem online. Każda metoda wymaga innej procedury, ale kontekst potrzebuje jedynie informacji o powodzeniu oraz identyfikatorze transakcji.

1. Zaprojektuj interfejs `IPaymentStrategy` z asynchroniczną metodą `pay()`.
2. Zdefiniuj typ `PaymentResult` z polami `success: boolean` oraz `transactionId: string`.
3. Zapisz klasę `PaymentContext`, która deleguje płatność do strategii i umożliwia jej zmianę.
4. Dodaj `BlikPaymentStrategy`. W ćwiczeniu użyj wyłącznie symulacji — nie przetwarzaj prawdziwych danych ani płatności.
5. Wyjaśnij, jak dodać kolejną metodę płatności bez umieszczania jej algorytmu w `PaymentContext`.

**Szkic do uzupełnienia:**

```typescript
interface PaymentResult {
	success: boolean;
	transactionId: string;
}

interface IPaymentStrategy {
	pay(amount: number): Promise<PaymentResult>;
}

// Uzupełnij implementację strategii i kontekstu.
```

### Zadanie C — wybór strategii w aplikacji

Narysuj przepływ obsługi żądania `POST /api/checkout/pay`:

```text
Kontroler Express → wybór strategii na podstawie paymentMethod
                  → PaymentContext → wybrana strategia → PaymentResult
```

Zaznacz, gdzie wybierana jest strategia, a gdzie wykonywana jest płatność. Wybór implementacji jest osobną decyzją od delegowania działania przez kontekst.

## 7. Pytania kontrolne

1. Jaką rolę pełni interfejs strategii?
2. Czy można zmienić strategię podczas działania programu? Jak?
3. Co robi kontekst, gdy wywołuje `applyDiscount()`?
4. Jaki jest koszt stosowania wzorca Strategia?
5. Czym Strategia różni się od Fasady?

## 8. Bilet wyjścia

**Imię i nazwisko:** ....................................................................

1. Wyjaśnij, jak Strategia ogranicza rozbudowane instrukcje `switch-case`.

....................................................................................................................

2. Podaj sposób zmiany strategii w TypeScript podczas działania programu.

....................................................................................................................

3. Oceń swoje zrozumienie tematu (zakreśl): **1 — jeszcze ćwiczę · 2 · 3 · 4 · 5 — rozumiem i potrafię zastosować**
