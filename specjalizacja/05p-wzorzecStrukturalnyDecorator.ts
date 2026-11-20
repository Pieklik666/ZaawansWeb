// #region Budowa dekoratora metody
function MojeRozszerzenieDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	// target - prototyp klasy
	// propertyKey - nazwa metody (np. 'obliczWartosc')
	// descriptor - obiekt kontrolujący zachowanie właściwości
}
interface SamochodInterface {
	private kola: number;
	public getKola(): number;
	public setKola(iloscKol: number): SamochodInterface;
}
// definicja wyjątku ZlaIloscKolException
class Samochod {
	private kola: number;
	public getKola(): number {
		return this.kola;
	}
	public setKola(iloscKol: number): SamochodInterface {
		if (iloscKol > 10) {
			throw ZlaIloscKolException;
		}
		this.kola = iloscKol;

		return this;
	}
}
function samochodSZyberdachDecorator(target: any) {
	otworzSzyberdach()
}

const samochod = new Samochod();
@samochodSZyberdachDecorator(samochod);
// samochod
// 	.setKola(4)
// 	.setDrzwi(5);
// samochod.kola = 9999999999999999999;
// #endregion


// #region Kompozycja pola
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
// #endregion


// #region Implementacja dekoratora @LogTime
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

// Przykład użycia zaprezentowany przez uczniów na tablicy:
class HeavyCalculator {
	@LogTime
	public calculateFactorial(n: number): number {
		let result = 1;
		for (let i = 2; i <= n; i++) {
			result *= i;
		}
		return result;
	}
}
// #endregion


// #region Elastyczny system wyceny zamówień
// 1. Wspólny kontrakt
interface IOrder {
	getCost(): number;
	getDescription(): string;
}

// 2. Komponent konkretny
class StandardOrder implements IOrder {
	constructor(private readonly basePrice: number = 100) {}

	public getCost(): number {
		return this.basePrice;
	}

	public getDescription(): string {
		return "Zamówienie bazowe";
	}
}

// 3. Bazowy dekorator
abstract class OrderDecorator implements IOrder {
	constructor(protected readonly decoratedOrder: IOrder) {}

	public getCost(): number {
		return this.decoratedOrder.getCost();
	}

	public getDescription(): string {
		return this.decoratedOrder.getDescription();
	}
}

// 4. Konkretne dekoratory
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

// 5. Kod klienta (Demonstracja runtime wrapping)
let myOrder: IOrder = new StandardOrder(150);
myOrder = new GiftWrapDecorator(myOrder);
myOrder = new ExpressShippingDecorator(myOrder);

console.log(myOrder.getDescription());
// Wynik: Zamówienie bazowe + pakowanie prezentowe [15 PLN] + wysyłka ekspresowa [25 PLN]
console.log(`Łączna kwota do zapłaty: ${myOrder.getCost()} PLN`);
// Wynik: 190 PLN
// #endregion


// #region
function BrokenDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
	const orig = descriptor.value;
	descriptor.value = (...args: any[]) => {
		console.log("Przed wywołaniem");
		return orig(...args);
	};
}
// #endregion


// #region samochod
interface SamochodInterface {
	private kola;
	public getKola();
	public setKola(ilosc);
}
class Samochod implements SamochodInterface {
	private kola = 4;
	public getKola() {
		return this.kola
	}
	public setKola(ilosc) {
		this.kola = ilosc;
	}
}

class DodajZapasDecorator implements SamochodInterface {
	private iloscZapasu = 1
	constructor(private readonly samochod: SamochodInterface) {
	}
	setKola(ilosc) {
		this.samochod.setKola(ilosc + this.iloscZapasu);
	}
	getKola() {
		return this.samochod.getKola() - this.iloscZapasu
	}
}
const samochod = new Samochod;
const samochodUdekorowany = new DodajZapasDecorator(samochod);
samochodUdekorowany.setKola(4)
// #endregion






// W języku TypeScript termin dekorator funkcjonuje w dwóch głównych kontekstach: jako funkcyjny mechanizm składniowy języka (adnotacje ze znakiem @, gdzie dekoratorem zawsze z definicji jest funkcja) oraz jako klasyczny wzorzec projektowy Dekorator (GoF) (gdzie dekorator implementuje się bezpośrednio jako osobną klasę rozszerzającą zachowanie obiektu bazowego).

// #region Dekorator jako funkcja: Pomiar czasu wykonania metody (@LogTime)
// Składniowy dekorator TypeScript jest funkcją, która przyjmuje referencję do metody oraz metadane kontekstu (ClassMethodDecoratorContext w standardzie TS 5.0+), zwracając opakowaną funkcję zastępczą.
// Zastosowanie: Profilowanie wydajności i audyt operacji bez zaśmiecania metody kodem pomiarowym.

function LogTime(
  originalMethod: (...args: any[]) => any,
  context: ClassMethodDecoratorContext
) {
  return function (this: any, ...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const duration = (performance.now() - start).toFixed(2);
    console.log(`[${String(context.name)}] Wykonano w ${duration} ms`);
    return result;
  };
}

class OrderService {
  @LogTime
  calculateTotal(items: number[]): number {
    return items.reduce((sum, item) => sum + item, 0);
  }
}
// #endregion

// #region Dekorator jako funkcja: Fabryka dekoratora z obsługą błędów (@CatchError)
// Fabryka to funkcja zwracająca właściwą funkcję dekorującą, co umożliwia parametryzowanie logiki dekoratora w momencie deklaracji.
// Zastosowanie: Zapewnienie bezpiecznych wartości domyślnych (fallback) i izolacja obsługi wyjątków w warstwie I/O.

function CatchError(fallbackValue: any = null) {
  return function (
    originalMethod: (...args: any[]) => any,
    context: ClassMethodDecoratorContext
  ) {
    return function (this: any, ...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        console.error(`Błąd w metodzie ${String(context.name)}:`, error);
        return fallbackValue;
      }
    };
  };
}

class ApiService {
  @CatchError([])
  fetchCatalog(): string[] {
    throw new Error("Brak połączenia z siecią");
  }
}
// #endregion

// #region Dekorator jako klasa: Szyfrowanie danych (Wzorzec projektowy GoF)
// W klasycznym wzorcu projektowym GoF dekorator jest klasą, która implementuje wspólny interfejs z obiektem dekorowanym i przyjmuje ten obiekt w konstruktorze (kompozycja zamiast dziedziczenia).
// Zastosowanie: Dynamiczne dodawanie nowych odpowiedzialności (np. szyfrowanie, kompresja) do obiektów w trakcie działania programu.

interface DataSource {
  writeData(data: string): void;
  readData(): string;
}

class FileDataSource implements DataSource {
  private content = "";
  writeData(data: string): void { this.content = data; }
  readData(): string { return this.content; }
}

// Klasa będąca dekoratorem
class EncryptionDecorator implements DataSource {
  constructor(protected wrappee: DataSource) {}

  writeData(data: string): void {
    const encrypted = Buffer.from(data).toString("base64");
    this.wrappee.writeData(encrypted);
  }

  readData(): string {
    const raw = this.wrappee.readData();
    return Buffer.from(raw, "base64").toString("utf-8");
  }
}

// Użycie:
const secureStorage: DataSource = new EncryptionDecorator(new FileDataSource());
secureStorage.writeData("Poune dane transakcyjne");
// #endregion

// #region Dekorator jako klasa: Pamięć podręczna / Cache (Wzorzec projektowy GoF)
// Klasa dekorująca opakowuje repozytorium danych, transparentnie dodając warstwę buforowania wyników dla identycznych zapytań bez ingerencji w kod źródłowy bazy.
// (Gdyby pod pojęciem „dekorator jest klasą” krył się syntaktyczny dekorator klasy ze znakiem @, w TypeScript jest to funkcja dekorująca konstruktor klasy, np.
// function Frozen(constructor: Function) { Object.freeze(constructor.prototype); }).

interface UserRepository {
  getUser(id: string): string;
}

class DatabaseUserRepository implements UserRepository {
  getUser(id: string): string {
    return `Dane użytkownika ${id} z bazy SQL`;
  }
}

// Klasa będąca dekoratorem dodającym pamięć podręczną
class CachingUserRepositoryDecorator implements UserRepository {
  private cache = new Map<string, string>();

  constructor(private innerRepo: UserRepository) {}

  getUser(id: string): string {
    if (!this.cache.has(id)) {
      this.cache.set(id, this.innerRepo.getUser(id));
    }
    return this.cache.get(id)!;
  }
}

// Użycie:
const userRepo: UserRepository = new CachingUserRepositoryDecorator(
  new DatabaseUserRepository()
);
// #endregion
