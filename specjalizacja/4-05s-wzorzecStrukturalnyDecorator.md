# SCENARIUSZ ZAJĘĆ: Strukturalny wzorzec projektowy: Dekorator (Decorator)

## 1. Metryczka

* **Przedmiot:** Projektowanie, programowanie i testowanie aplikacji (Kwalifikacja INF.04).
* **Odbiorcy:** Uczniowie 4 klasy technikum programistycznego.
* **Czas trwania:** 2 jednostki lekcyjne (2 × 45 minut – blok zintegrowany).
* **Temat:** Wzorzec projektowy strukturalny **Dekorator (Decorator)** w architekturze obiektowej oraz dekoratory TypeScript w Angularze.
* **Metody pracy:** miniwykład problemowy, dyskusja, analiza eksplozji klas i zasady OCP, wspólne programowanie na tablicy, peer review oraz praca z dokumentacją i asystentami AI.
* **Środki dydaktyczne:** tablica i markery; smartfony z TypeScript Handbook i Angular Docs; wydrukowane karty zadań i bilety wyjściowe.

## 2. Cele lekcji

### Wiedza

Uczeń:
* wyjaśnia dług technologiczny wynikający z nadmiernego dziedziczenia i zasadę **„Kompozycja ponad dziedziczenie”**;
* opisuje wzorzec Dekorator GoF jako dynamiczne rozszerzanie odpowiedzialności obiektu przez kompozycję;
* rozróżnia Dekorator GoF od dekoratorów TypeScript/Angular, które dostarczają metadane frameworkowi;
* wyjaśnia działanie `PropertyDescriptor` w klasycznym dekoratorze metody TypeScript.

### Umiejętności

Uczeń potrafi:
* zaimplementować wzorzec GoF w TypeScript z użyciem interfejsów i kompozycji;
* napisać dekorator metody `@LogTime`, zachowując argumenty i kontekst `this`;
* wyjaśnić rolę `@Component`, `@Input` i kompozycji komponentów w Angularze;
* konfigurować obiekty biznesowe zgodnie z OCP oraz krytycznie oceniać sugestie AI.

## 3. Lekcja 1: Teoria i koncepcje (45 min)

### Etap 1: Eksplozja klas i pułapka dziedziczenia [0–10 min]

* **Scenariusz:** aplikacja sklepu internetowego w Angularze obsługuje zamówienia (`Order`). Opcje dodatkowe to `GiftWrap` i `ExpressShipping`.
* **Pytanie:** „Jak rozwiązalibyście to przez dziedziczenie?” Możliwe propozycje: `GiftWrapOrder`, `ExpressShippingOrder` oraz `GiftWrapAndExpressShippingOrder`.
* **Rozszerzenie problemu:** ubezpieczenie, dostawa weekendowa i dedykacja powodują dalszy wzrost liczby kombinacji. Przy `n` niezależnych cech może powstać do `2^n` wariantów.
* **Wniosek:** eksplozja klas utrudnia rozwój i testowanie oraz sprzyja naruszaniu OCP.
* **Analogie z Angulara:**
	* Kompozycja mniejszych komponentów pozwala budować widoki z wielokrotnie używanych elementów, zamiast tworzyć osobną klasę dla każdej kombinacji funkcji.
	* Dyrektywy mogą zmieniać zachowanie lub wygląd elementu, a potoki przekształcają wartości w widoku. To analogie rozszerzania zachowania, ale nie są same w sobie wzorcem GoF.

### Etap 2: Dekorator GoF – kompozycja zamiast dziedziczenia [10–25 min]

* Dekorator implementuje ten sam interfejs co dekorowany obiekt i przechowuje referencję do obiektu tego interfejsu.
* **Diagram na tablicy:**
	1. Interfejs `IOrder`: `getCost(): number`, `getDescription(): string`.
	2. `StandardOrder implements IOrder`: koszt 100 zł i opis „Zamówienie standardowe”.
	3. Abstrakcyjny `OrderDecorator implements IOrder` z polem `order: IOrder` przekazywanym w konstruktorze.
	4. `GiftWrapDecorator` i `ExpressShippingDecorator`, które delegują wywołania i dodają własny koszt.
	5. Rysunek warstw: `StandardOrder` w środku, następnie `GiftWrap`, na zewnątrz `ExpressShipping`.
* **Pytanie kontrolne:** „Dlaczego dekorator musi implementować ten sam interfejs co komponent?” Odpowiedź: klient może korzystać z obiektu bazowego i opakowanego bez zmiany kodu zależnego od interfejsu.
* **Aktywizacja:** prompt do AI: „Wyjaśnij różnicę między dziedziczeniem a kompozycją w TypeScript i podaj przykład użycia kompozycji komponentów w Angularze”.

### Etap 3: Dekoratory TypeScript i Angular [25–40 min]

* **Dekorator GoF:** wzorzec obiektowy, który opakowuje pojedynczy obiekt i rozszerza jego zachowanie w runtime.
* **Dekorator TypeScript (`@`):** składnia metaprogramowania. W Angularze `@Component`, `@Input` i `@Injectable` dostarczają frameworkowi metadane i wiążą klasę z mechanizmami Angulara. Nie są automatycznie dekoratorami GoF.
* Przykład komponentu Angular:

```typescript
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-order-summary',
	standalone: true,
	template: `<p>{{ title }}: {{ total }} PLN</p>`
})
export class OrderSummaryComponent {
	@Input() title = 'Podsumowanie zamówienia';
	@Input() total = 0;
}
```

* **Klasyczny dekorator metody TypeScript:** poniższa sygnatura używa starszego modelu dekoratorów z `PropertyDescriptor` (m.in. `experimentalDecorators`). Nowszy model dekoratorów ma inne sygnatury — nie należy ich mieszać.

```typescript
function MojeRozszerzenie(
	target: any,
	propertyKey: string,
	descriptor: PropertyDescriptor
): PropertyDescriptor {
	// target - prototyp klasy
	// propertyKey - nazwa metody
	// descriptor - opis właściwości, m.in. value, writable, enumerable, configurable
	return descriptor;
}
```

* Aby przechwycić wywołanie, należy zachować oryginalną metodę (`const originalMethod = descriptor.value`) i podmienić `descriptor.value`. Funkcja zastępcza musi zachować dynamiczny `this`.

### Etap 4: Quiz ustny [40–45 min]

1. „Dekorator GoF wymaga wielokrotnego dziedziczenia.” – **Fałsz**, opiera się na kompozycji.
2. „Dekorator GoF może rozszerzyć zachowanie pojedynczego obiektu w runtime.” – **Prawda**.
3. „Funkcja strzałkowa jest bezpiecznym wrapperem metody, jeśli potrzebujemy zachować `this` instancji.” – **Fałsz**, nie otrzymuje `this` z wywołania metody.
4. „`@Component` jest tym samym co dekorator GoF.” – **Fałsz**, dostarcza Angularowi metadane.

## 4. Lekcja 2: Ćwiczenia (45 min)

### Zadanie 1: Kompozycja w TypeScript [0–10 min]

**Polecenie:** bez `extends` i bez modyfikowania `UserProfile` napisz `AuditedUserProfile`, która przyjmuje profil, dodaje `createdAt` i zwraca pełny raport. Omów, dlaczego referencja jest `private readonly`.

```typescript
class UserProfile {
	constructor(public username: string, public email: string) {}

	public getDisplayData(): string {
		return `Użytkownik: ${this.username} (${this.email})`;
	}
}

class AuditedUserProfile {
	public readonly createdAt: Date;

	constructor(private readonly baseProfile: UserProfile) {
		this.createdAt = new Date();
	}

	public getDisplayData(): string {
		return `${this.baseProfile.getDisplayData()} | Rejestracja: ${this.createdAt.toISOString()}`;
	}

	public get rawProfile(): UserProfile {
		return this.baseProfile;
	}
}
```

### Zadanie 2: Dekorator metody `@LogTime` [10–25 min]

**Polecenie:** zmierz czas wykonania metody przez `performance.now()`, zaloguj nazwę i czas, a w razie błędu zaloguj awarię i ponownie rzuć wyjątek. Użyj `...args` i `.apply()`.

```typescript
function LogTime(
	target: any,
	propertyKey: string,
	descriptor: PropertyDescriptor
): PropertyDescriptor {
	const originalMethod = descriptor.value;

	descriptor.value = function (...args: any[]) {
		const start = performance.now();
		console.log(`--> [LOG] Rozpoczęto wywołanie: ${propertyKey}`);

		try {
			const result = originalMethod.apply(this, args);
			const duration = (performance.now() - start).toFixed(2);
			console.log(`<-- [LOG] Zakończono: ${propertyKey} w czasie: ${duration} ms`);
			return result;
		} catch (error) {
			const duration = (performance.now() - start).toFixed(2);
			console.error(`<!> [BŁĄD] Metoda: ${propertyKey} przerwana po: ${duration} ms`);
			throw error;
		}
	};

	return descriptor;
}

class HeavyCalculator {
	@LogTime
	public calculateFactorial(n: number): number {
		let result = 1;
		for (let i = 2; i <= n; i++) result *= i;
		return result;
	}
}
```

* **Pytania:** Gdzie zachować oryginał? Jak przekazać dynamiczną liczbę parametrów i instancję jako `this`?
* **Prompt do AI:** „Dlaczego funkcja strzałkowa użyta jako wrapper metody może zgubić kontekst `this`? Pokaż poprawne użycie `apply`”.
* Powyższy przykład mierzy wywołania synchroniczne; pomiar metod zwracających `Promise` wymaga zakończenia pomiaru po rozstrzygnięciu obietnicy.
* W Angularze własny `@LogTime` pozostaje dekoratorem TypeScript. Nie jest wbudowanym mechanizmem Angulara; zgodność zależy od konfiguracji TypeScript i używanego modelu dekoratorów.

### Zadanie 3: Wycena zamówień – GoF Decorator [25–40 min]

**Polecenie:** zbuduj interfejs `IOrder`, komponent `StandardOrder`, bazowy `OrderDecorator` oraz dekoratory: pakowanie (+15 PLN) i wysyłka ekspresowa (+25 PLN). Następnie zaprojektuj własny dekorator bez modyfikowania istniejących klas.

```typescript
interface IOrder {
	getCost(): number;
	getDescription(): string;
}

class StandardOrder implements IOrder {
	constructor(private readonly basePrice: number = 100) {}

	public getCost(): number {
		return this.basePrice;
	}

	public getDescription(): string {
		return 'Zamówienie bazowe';
	}
}

abstract class OrderDecorator implements IOrder {
	constructor(protected readonly decoratedOrder: IOrder) {}

	public getCost(): number {
		return this.decoratedOrder.getCost();
	}

	public getDescription(): string {
		return this.decoratedOrder.getDescription();
	}
}

class GiftWrapDecorator extends OrderDecorator {
	public static readonly PRICE = 15;

	public getCost(): number {
		return super.getCost() + GiftWrapDecorator.PRICE;
	}

	public getDescription(): string {
		return `${super.getDescription()} + pakowanie prezentowe [${GiftWrapDecorator.PRICE} PLN]`;
	}
}

class ExpressShippingDecorator extends OrderDecorator {
	public static readonly PRICE = 25;

	public getCost(): number {
		return super.getCost() + ExpressShippingDecorator.PRICE;
	}

	public getDescription(): string {
		return `${super.getDescription()} + wysyłka ekspresowa [${ExpressShippingDecorator.PRICE} PLN]`;
	}
}

let myOrder: IOrder = new StandardOrder(150);
myOrder = new GiftWrapDecorator(myOrder);
myOrder = new ExpressShippingDecorator(myOrder);

console.log(myOrder.getDescription());
console.log(`Łączna kwota do zapłaty: ${myOrder.getCost()} PLN`); // 190 PLN
```

**Pytania:** Dlaczego `OrderDecorator` jest abstrakcyjny? Czy kolejność opakowania wpływa na opis lub cenę?

## 5. Exit Ticket [40–45 min]

Uczniowie pracują samodzielnie przez 4 minuty.

1. Wyjaśnij w jednym lub dwóch zdaniach, jak wzorzec Dekorator realizuje OCP.
2. Wskaż błąd w poniższym dekoratorze i uzasadnij jego skutki.

```typescript
function MeasureExecution(target: any, key: string, descriptor: PropertyDescriptor) {
	const original = descriptor.value;
	descriptor.value = (...args: any[]) => {
		console.log(`Wywołano: ${key}`);
		return original(...args);
	};
}
```

**Klucz odpowiedzi:** nowe funkcjonalności dodaje się przez nowe klasy dekoratorów bez modyfikowania komponentu i istniejących dekoratorów. Funkcja strzałkowa nie zachowuje dynamicznego `this`; wrapper powinien użyć zwykłej funkcji i wywołania `original.apply(this, args)`. W pełnym dekoratorze należy także zwrócić `descriptor`.

**Punktacja:** 2 punkty – ocena bardzo dobra z aktywności; 1 punkt – ocena dostateczna; 0 punktów – powtórzenie zagadnienia `this`.

## 6. Materiały dla uczniów (do wydruku)

### Karta zadań

Imię i nazwisko / zespół: ..................................................... Klasa: 4Tp
Data: ................................. Stanowisko / ławka: nr ..........

**Zadanie 1 – Kompozycja:** zaprojektuj `AuditedUserProfile`, która opakowuje `UserProfile`, nie używa `extends` i dodaje `createdAt: Date`.

Miejsce na rozwiązanie:



**Zadanie 2 – `@LogTime`:** napisz dekorator metody mierzący czas. Pamiętaj o `PropertyDescriptor`, `this`, wyjątkach i `apply`.

Miejsce na rozwiązanie:



**Zadanie 3 – GoF Decorator:** zaprojektuj własny dekorator zamówienia.
Nazwa: ........................................ Koszt: ........ PLN
Zmiana opisu: ........................................................................

Miejsce na szkic klasy:



---

### Exit Ticket

Imię i nazwisko: ............................................................... Klasa: 4Tp
Data: ........................................ Czas: 4 minuty

**1.** Jak wzorzec Dekorator realizuje OCP?

....................................................................................................

**2.** Wskaż błąd w dekoratorze `MeasureExecution` pokazanym w sekcji Exit Ticket i uzasadnij odpowiedź.

....................................................................................................

Punktacja: [ ] Pytanie 1 (0–1 pkt)  [ ] Pytanie 2 (0–1 pkt)  Suma: ..... / 2 pkt  Ocena: ........
