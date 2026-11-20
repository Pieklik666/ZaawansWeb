# Strukturalny wzorzec projektowy: Dekorator (Decorator)

**Przedmiot:** Projektowanie, programowanie i testowanie aplikacji (INF.04)
**Poziom:** klasa 4 technikum programistycznego
**Temat:** Klasyczny wzorzec Dekorator (GoF) i dekoratory metod w TypeScript

## Cele nauki

Po zapoznaniu się z materiałem potrafisz:

- wyjaśnić problem eksplozji klas i zasadę kompozycji ponad dziedziczeniem;
- zaprojektować dekorator GoF zgodny ze wspólnym interfejsem komponentu;
- rozszerzać zachowanie obiektów bez modyfikowania istniejącego kodu;
- odróżnić wzorzec GoF od składni dekoratorów `@` w TypeScript;
- napisać dekorator metody, który zachowuje `this`, argumenty i wynik metody.

## 1. Problem: eksplozja klas

Załóżmy, że sklep obsługuje zamówienia z opcjonalnymi dodatkami: pakowaniem na prezent i ekspresową dostawą. Przy rozwiązaniu opartym wyłącznie na dziedziczeniu mogłyby powstać klasy `GiftWrapOrder`, `ExpressOrder` i `GiftWrapAndExpressOrder`. Każda kolejna niezależna opcja zwiększa liczbę kombinacji. Dla `n` opcji może być ich nawet `2ⁿ`.

Taka konstrukcja utrudnia rozwój programu: pojawia się wiele podobnych klas, a zmiana wspólnej logiki może wymagać modyfikowania wielu miejsc. Dekorator pozwala dokładać opcje do konkretnego obiektu w czasie działania programu (*runtime*), bez tworzenia klasy dla każdej kombinacji.

### Kompozycja ponad dziedziczenie

Zamiast definiować wszystkie warianty w hierarchii klas, obiekt może **zawierać referencję do innego obiektu** i delegować mu część pracy. Wzorzec Dekorator składa obiekty w łańcuch, w którym każdy dekorator dodaje własne zachowanie.

Przykłady podobnego sposobu myślenia w web developmencie to łańcuchy middleware w Express.js, interceptory HTTP w Angularze (`HttpInterceptorFn`) oraz opakowywanie komponentów w React.

## 2. Klasyczny Dekorator (GoF)

Wzorzec składa się z:

1. **Komponentu** – wspólnego interfejsu dla obiektu bazowego i dekoratorów.
2. **Komponentu konkretnego** – podstawowej implementacji, np. standardowego zamówienia.
3. **Dekoratora bazowego** – przechowuje komponent i deleguje do niego wywołania.
4. **Dekoratorów konkretnych** – dodają odpowiedzialność, np. koszt i opis dodatku.

Każdy dekorator implementuje ten sam interfejs co opakowywany obiekt. Dzięki temu kod klienta może korzystać z obiektu bazowego i udekorowanego w ten sam sposób.

### Przykład: wycena zamówienia

```typescript
interface IOrder {
	getCost(): number;
	getDescription(): string;
}

class StandardOrder implements IOrder {
	constructor(private readonly basePrice: number = 100) {}

	getCost(): number {
		return this.basePrice;
	}

	getDescription(): string {
		return "Zamówienie standardowe";
	}
}

abstract class OrderDecorator implements IOrder {
	constructor(protected readonly order: IOrder) {}

	getCost(): number {
		return this.order.getCost();
	}

	getDescription(): string {
		return this.order.getDescription();
	}
}

class GiftWrapDecorator extends OrderDecorator {
	getCost(): number {
		return super.getCost() + 15;
	}

	getDescription(): string {
		return `${super.getDescription()} + pakowanie prezentowe (15 zł)`;
	}
}

class ExpressShippingDecorator extends OrderDecorator {
	getCost(): number {
		return super.getCost() + 25;
	}

	getDescription(): string {
		return `${super.getDescription()} + dostawa ekspresowa (25 zł)`;
	}
}

let order: IOrder = new StandardOrder(100);
order = new GiftWrapDecorator(order);
order = new ExpressShippingDecorator(order);

console.log(order.getDescription());
console.log(`Do zapłaty: ${order.getCost()} zł`); // 140 zł
```

Wywołanie `getCost()` przechodzi przez kolejne warstwy: dekorator dostawy pobiera koszt od dekoratora pakowania, a ten od zamówienia bazowego. Każda warstwa dodaje własną opłatę.

**Pytanie kontrolne:** Dlaczego dekorator i komponent muszą udostępniać ten sam interfejs?
**Odpowiedź:** Klient może obsługiwać obiekt bazowy i dowolnie udekorowany bez sprawdzania jego konkretnego typu.

### Open/Closed Principle (OCP)

Zasada OCP mówi, że moduł powinien być **otwarty na rozszerzenia, ale zamknięty na modyfikacje**. Nową opcję zamówienia można dodać jako kolejną klasę dekoratora implementującą `IOrder`. Nie trzeba zmieniać `StandardOrder` ani istniejących dekoratorów.

Kolejność dekorowania może wpływać na kolejność elementów w opisie. W tym przykładzie dodatki są stałymi kwotami, więc kolejność nie zmienia ceny. Przy rabatach procentowych kolejność może mieć znaczenie.

### Dekorator GoF w Angularze

W Angularze wzorzec można zastosować w serwisach wstrzykiwanych przez DI. Dekorator jest serwisem implementującym ten sam kontrakt (tu: klasę abstrakcyjną jako token DI) i opakowującym inny serwis.

```typescript
import { Component, Injectable, inject } from "@angular/core";

abstract class OrderService {
	abstract getCost(): number;
	abstract getDescription(): string;
}

@Injectable({ providedIn: "root" })
class StandardOrderService extends OrderService {
	getCost(): number {
		return 100;
	}

	getDescription(): string {
		return "Zamówienie standardowe";
	}
}

@Injectable()
class GiftWrapOrderService extends OrderService {
	private readonly inner = inject(StandardOrderService);

	getCost(): number {
		return this.inner.getCost() + 15;
	}

	getDescription(): string {
		return `${this.inner.getDescription()} + pakowanie prezentowe (15 zł)`;
	}
}

@Component({
	selector: "app-order", // <app-order />
	standalone: true,
	providers: [{ provide: OrderService, useClass: GiftWrapOrderService }],
	template: `<p>{{ order.getDescription() }}: {{ order.getCost() }} zł</p>`,
})
export class OrderComponent {
	order = inject(OrderService);
}
```

Komponent zależy wyłącznie od abstrakcji `OrderService`. Dekorator można podmienić w `providers` bez zmiany kodu komponentu.

Innym przykładem w Angularze jest interceptor HTTP – interceptory tworzą łańcuch, w którym każdy opakowuje kolejne wywołanie `next`, dodając zachowanie (np. nagłówek autoryzacji):

```typescript
import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authReq = req.clone({
		setHeaders: { Authorization: "Bearer token" },
	});
	return next(authReq);
};

// app.config.ts
// provideHttpClient(withInterceptors([authInterceptor]))
```

## 3. Dekoratory `@` w TypeScript

Nie należy utożsamiać dwóch pojęć:

- **Dekorator GoF** to wzorzec obiektowy: instancje implementują wspólny interfejs i opakowują się nawzajem w czasie działania.
- **Dekorator TypeScript (`@`)** to składnia metaprogramowania służąca do opisywania lub modyfikowania klas i ich elementów. Angular używa jej m.in. do oznaczania komponentów, serwisów i właściwości (`@Component`, `@Injectable`, `@Input`, `@Output`).

Szczegóły sygnatury dekoratora zależą od używanego trybu i wersji TypeScript. Poniższy przykład używa **legacy method decorators** z `PropertyDescriptor` (konfiguracja `experimentalDecorators`, domyślnie używana w projektach Angular).

### `PropertyDescriptor`

Dekorator metody legacy otrzymuje:

- `target` – prototyp klasy dla metody instancyjnej;
- `propertyKey` – nazwę dekorowanej metody;
- `descriptor` – deskryptor właściwości, którego `value` wskazuje oryginalną funkcję.

Deskryptor może zawierać m.in. pola `value`, `writable`, `enumerable` i `configurable`. Aby opakować metodę, zachowujemy oryginał, a następnie zastępujemy `descriptor.value` funkcją pośredniczącą.

### Dekorator `@LogTime`

```typescript
function LogTime(
	target: any,
	propertyKey: string,
	descriptor: PropertyDescriptor
): PropertyDescriptor {
	const originalMethod = descriptor.value;

	descriptor.value = function (this: unknown, ...args: unknown[]) {
		const start = performance.now();
		console.log(`Rozpoczęto: ${propertyKey}`);

		try {
			const result = originalMethod.apply(this, args);
			const duration = (performance.now() - start).toFixed(2);
			console.log(`Zakończono: ${propertyKey} w ${duration} ms`);
			return result;
		} catch (error) {
			const duration = (performance.now() - start).toFixed(2);
			console.error(`Błąd w ${propertyKey} po ${duration} ms`);
			throw error;
		}
	};

	return descriptor;
}

class HeavyCalculator {
	@LogTime
	calculateFactorial(n: number): number {
		let result = 1;
		for (let i = 2; i <= n; i++) result *= i;
		return result;
	}
}
```

Zastosowanie w komponencie Angulara:

```typescript
@Component({
	selector: "app-calc",
	standalone: true,
	template: `<button (click)="calculate()">Oblicz</button>`,
})
export class CalcComponent {
	@LogTime
	calculate(): number {
		let result = 1;
		for (let i = 2; i <= 20; i++) result *= i;
		return result;
	}
}
```

Funkcja zastępcza jest zwykłą funkcją, aby `this` wskazywało obiekt, na którym wywołano metodę. `apply(this, args)` przekazuje oryginalnej metodzie zarówno kontekst, jak i dowolną liczbę argumentów. W przypadku wyjątku dekorator loguje błąd i ponownie go zgłasza.

> **Uwaga:** Przykład mierzy czas synchronicznego wykonania. Dla metody asynchronicznej trzeba poczekać na rozstrzygnięcie zwróconego `Promise`, aby zmierzyć cały czas operacji.

## 4. Ćwiczenia

### Zadanie 1 – Kompozycja bez `extends`

Zaprojektuj `AuditedUserProfile`, które przyjmuje instancję `UserProfile`, przechowuje ją w polu `private readonly`, dodaje `createdAt: Date` i zwraca raport obejmujący dane profilu oraz datę utworzenia.

```typescript
class UserProfile {
	constructor(public username: string, public email: string) {}

	getDisplayData(): string {
		return `Użytkownik: ${this.username} (${this.email})`;
	}
}
```

**Pytania:** Jak przekazać obiekt bazowy do konstruktora? Dlaczego referencja jest `private readonly`?

### Zadanie 2 – Implementacja `@LogTime`

Napisz dekorator mierzący czas metody przez `performance.now()`. Zaloguj nazwę i czas działania, poprawnie przekaż `this` oraz argumenty, a w razie błędu zaloguj awarię i ponownie rzuć wyjątek. Użyj go na metodzie komponentu Angulara.

**Code review:** Wyjaśnij, dlaczego zastępowanie metody funkcją strzałkową może spowodować utratę właściwego `this`.

### Zadanie 3 – Własny dekorator zamówienia

Dodaj do przykładu `IOrder` trzeci dekorator, np. `CarbonNeutralDecorator` zwiększający cenę o 5 zł i dopisujący informację o neutralnej dostawie. Uruchom go w łańcuchu, nie zmieniając klas bazowych.

### Zadanie 4 – Interceptor w Angularze

Napisz `HttpInterceptorFn` o nazwie `loggingInterceptor`, który loguje metodę i adres każdego żądania, a następnie przekazuje żądanie dalej przez `next`. Zarejestruj go przez `provideHttpClient(withInterceptors([...]))`.

## 5. Pytania podsumowujące

1. Jaki problem rozwiązuje dekorator w porównaniu z tworzeniem klasy dla każdej kombinacji opcji?
2. Co gwarantuje wspólny interfejs komponentu i dekoratora?
3. W jaki sposób nowy dekorator wspiera OCP?
4. Jaką rolę pełnią `descriptor.value` i `originalMethod.apply(this, args)`?
5. Czym różni się wzorzec GoF od dekoratora metody TypeScript?
