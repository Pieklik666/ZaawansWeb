// ============================================================================
// WZORZEC CZYNNOŚCIOWY OBSERVER (TypeScript)
//
// Importy: plik nie wymaga zewnętrznych bibliotek ani modułów – korzysta
// wyłącznie z wbudowanych typów i klas języka TypeScript/JavaScript.
//
// Uruchomienie:
//   1. Kompilacja:  tsc 07p-wzorzecCzynnosciowyObserver.ts
//                   node 07p-wzorzecCzynnosciowyObserver.js
//   2. Bezpośrednio: npx ts-node 07p-wzorzecCzynnosciowyObserver.ts
// ============================================================================

// ============================================================================
// LEKCJA 1: KONTRAKTY, TYPY BAZOWE I GENERYCZNY MECHANIZM OBSERVER
// ============================================================================

/**
 * @description Kontrakt obserwatora generycznego. Odbiera zdarzenia typu TEvent od podmiotu.
 * @architectural-note Chroni przed sztywnym sprzężeniem podmiotu z konkretnymi klasami odbiorców.
 * @inf04-relevance Interfejsy i luźne powiązanie to częsty temat pytań o projektowanie obiektowe.
 */
interface IObserver<TEvent> {
	update(event: TEvent): void;
}

/**
 * @description Kontrakt podmiotu: rejestracja (attach), wyrejestrowanie (detach) i rozgłaszanie (notify).
 * @architectural-note Chroni przed brakiem możliwości dynamicznej zmiany listy odbiorców w czasie działania.
 * @inf04-relevance Znajomość struktury GoF Observer (relacja 1:N) jest wymagana w dokumentacji UML.
 */
interface ISubject<TEvent> {
	attach(observer: IObserver<TEvent>): void;
	detach(observer: IObserver<TEvent>): void;
	notify(event: TEvent): void;
}

/**
 * @description Bazowa, generyczna implementacja podmiotu przechowująca obserwatorów w prywatnej tablicy.
 * Zapobiega duplikatom przy rejestracji.
 * @architectural-note Chroni przed problemem Lapsed Listener: detach usuwa referencję, więc
 * Garbage Collector może zwolnić obserwatora.
 * @inf04-relevance Pokazuje zarządzanie cyklem życia obiektów i zasobów w Node.js.
 */
class Subject<TEvent> implements ISubject<TEvent> {
	private observers: IObserver<TEvent>[] = [];

	/**
	 * @description Rejestruje obserwatora, jeśli nie został jeszcze dodany.
	 * @architectural-note Chroni przed wielokrotnym powiadamianiem tego samego odbiorcy.
	 * @inf04-relevance Walidacja danych wejściowych w metodach publicznych.
	 */
	public attach(observer: IObserver<TEvent>): void {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
		}
	}

	/**
	 * @description Wyrejestrowuje obserwatora.
	 * @architectural-note Chroni przed wyciekami pamięci (Lapsed Listener).
	 * @inf04-relevance Odpowiedzialne zwalnianie zasobów.
	 */
	public detach(observer: IObserver<TEvent>): void {
		const index: number = this.observers.indexOf(observer);
		if (index !== -1) {
			this.observers.splice(index, 1);
		}
	}

	/**
	 * @description Rozgłasza zdarzenie do wszystkich obserwatorów (iteracja po kopii tablicy).
	 * @architectural-note Kopia chroni przed błędami, gdy obserwator odłącza się w trakcie powiadamiania.
	 * @inf04-relevance Bezpieczna iteracja po kolekcjach modyfikowanych w pętli.
	 */
	public notify(event: TEvent): void {
		for (const observer of [...this.observers]) {
			observer.update(event);
		}
	}

	/**
	 * @description Zwraca liczbę zarejestrowanych obserwatorów (diagnostyka wycieków).
	 * @architectural-note Pozwala wykryć nieodpięte subskrypcje.
	 * @inf04-relevance Testowanie aplikacji – weryfikacja stanu wewnętrznego.
	 */
	public getObserverCount(): number {
		return this.observers.length;
	}
}

// ============================================================================
// ZADANIE 1: ANTYWZORZEC – SZTYWNE SPRZĘŻENIE (PRZED ZMIANĄ)
// ============================================================================

namespace AntiPattern {
	/**
	 * @description Symulowany klient SMS (in-memory).
	 * @architectural-note Konkretna zależność zaszyta w logice biznesowej.
	 * @inf04-relevance Przykład klasy zewnętrznego podsystemu.
	 */
	export class SmsClient {
		public async sendClientSms(orderId: string, text: string): Promise<void> {
			console.log(`  [SMS] ${orderId}: ${text}`);
		}
	}

	/**
	 * @description Symulowany serwis e-mail.
	 * @architectural-note Konkretna zależność zaszyta w logice biznesowej.
	 * @inf04-relevance Przykład klasy zewnętrznego podsystemu.
	 */
	export class EmailService {
		public async sendHtmlUpdate(orderId: string, status: string): Promise<void> {
			console.log(`  [EMAIL] ${orderId}: ${status}`);
		}
	}

	/**
	 * @description Symulowany powiadamiacz Slack.
	 * @architectural-note Konkretna zależność zaszyta w logice biznesowej.
	 * @inf04-relevance Przykład klasy zewnętrznego podsystemu.
	 */
	export class SlackNotifier {
		public async postToOrdersChannel(message: string): Promise<void> {
			console.log(`  [SLACK] ${message}`);
		}
	}

	/**
	 * @description Serwis zamówień ze sztywnym sprzężeniem (Tight Coupling).
	 * DŁUG TECHNOLOGICZNY: nowy kanał lub rezygnacja z kanału wymaga edycji tej klasy;
	 * klient nie może wybrać kanałów; klasa zmienia się z dwóch powodów (naruszenie SRP i OCP).
	 * @architectural-note Pokazuje błąd, któremu zapobiega wzorzec Observer.
	 * @inf04-relevance Rozpoznawanie antywzorców w kodzie to typowe zadanie egzaminacyjne.
	 */
	export class OrderService {
		private readonly sms = new SmsClient();
		private readonly email = new EmailService();
		private readonly slack = new SlackNotifier();

		public async changeOrderStatus(orderId: string, newStatus: string): Promise<void> {
			console.log(`  Zmieniam status zamówienia ${orderId} na: ${newStatus}`);
			await this.sms.sendClientSms(orderId, `Twój status: ${newStatus}`);
			await this.email.sendHtmlUpdate(orderId, newStatus);
			await this.slack.postToOrdersChannel(`Alert: Zamówienie ${orderId} -> ${newStatus}`);
		}
	}
}

// ============================================================================
// ZADANIE 2: OBSERWATOR – ŚLEDZENIE STATUSU ZAMÓWIENIA
// ============================================================================

/**
 * @description Dozwolone statusy zamówienia (unia literałów).
 * @architectural-note Chroni przed literówkami w statusach (brak dowolnych stringów).
 * @inf04-relevance Zawężanie typów w TypeScript.
 */
type OrderStatus = "NOWE" | "OPLACONE" | "WYSLANE" | "DOSTARCZONE";

/**
 * @description DTO zdarzenia zmiany statusu zamówienia.
 * @architectural-note Niemutowalny obiekt transferu chroni przed modyfikacją danych przez obserwatorów.
 * @inf04-relevance Typowanie domenowe zamiast luźnych parametrów string.
 */
interface OrderStatusEvent {
	readonly orderId: string;
	readonly status: OrderStatus;
	readonly timestamp: string;
}

/**
 * @description Podmiot śledzący status zamówień; nie zna konkretnych obserwatorów.
 * @architectural-note Odwraca zależność: zmiana kanałów nie wymaga edycji tej klasy.
 * @inf04-relevance Zastosowanie zasad SRP i OCP w praktyce.
 */
class OrderStatusTracker extends Subject<OrderStatusEvent> {
	private currentStatus: OrderStatus = "NOWE";

	/**
	 * @description Zmienia status zamówienia i powiadamia obserwatorów.
	 * @architectural-note Powiadomienie następuje bezpośrednio po zmianie stanu.
	 * @inf04-relevance Wzorzec push zamiast pollingu.
	 */
	public changeStatus(orderId: string, status: OrderStatus): void {
		this.currentStatus = status;
		this.notify({ orderId, status: this.currentStatus, timestamp: new Date().toISOString() });
	}
}

/**
 * @description Obserwator wysyłający symulowany SMS do klienta.
 * @architectural-note Niezależny od podmiotu – zna tylko interfejs.
 * @inf04-relevance Dodawanie funkcji bez modyfikacji istniejącego kodu.
 */
class CustomerSmsObserver implements IObserver<OrderStatusEvent> {
	public update(event: OrderStatusEvent): void {
		console.log(`  [SMS] Zamówienie ${event.orderId}: ${event.status}`);
	}
}

/**
 * @description Obserwator systemu magazynowego – reaguje tylko na statusy wymagające pakowania.
 * @architectural-note Logika reakcji jest po stronie obserwatora, nie podmiotu.
 * @inf04-relevance Rozdzielenie odpowiedzialności.
 */
class WarehouseSystemObserver implements IObserver<OrderStatusEvent> {
	public update(event: OrderStatusEvent): void {
		if (event.status === "OPLACONE") {
			console.log(`  [MAGAZYN] Rozpocznij pakowanie zamówienia ${event.orderId}`);
		}
	}
}

/**
 * @description Obserwator dziennika audytu zapisujący historię zdarzeń.
 * @architectural-note Zapewnia ślad zmian bez ingerencji w logikę zamówień.
 * @inf04-relevance Logowanie i audyt to element jakości aplikacji.
 */
class AuditLogObserver implements IObserver<OrderStatusEvent> {
	private readonly logHistory: string[] = [];

	public update(event: OrderStatusEvent): void {
		const entry = `[LOG][${event.timestamp}] Zamówienie ${event.orderId} -> Nowy status: ${event.status}`;
		this.logHistory.push(entry);
		console.log(`  ${entry}`);
	}

	public getHistory(): readonly string[] {
		return this.logHistory;
	}
}

// ============================================================================
// ZADANIE 3: SILNIK AUKCYJNY (WYKLUCZENIE AUTORA OFERTY)
// ============================================================================

/**
 * @description Zdarzenie nowej, najwyższej oferty.
 * @architectural-note Zawiera autora, by filtrowanie było możliwe bez znajomości klas obserwatorów.
 * @inf04-relevance Projektowanie DTO.
 */
interface BidEvent {
	readonly itemId: string;
	readonly newHighestBid: number;
	readonly bidderId: string;
}

/**
 * @description Obserwator licytującego, identyfikowany przez bidderId.
 * @architectural-note Identyfikator pozwala odłączyć użytkownika i wykluczyć autora oferty.
 * @inf04-relevance Rozszerzanie interfejsu o dane potrzebne do reguł biznesowych.
 */
interface IAuctionObserver extends IObserver<BidEvent> {
	getBidderId(): string;
}

/**
 * @description Konkretny licytujący; zapisuje otrzymane powiadomienia.
 * @architectural-note Zależy tylko od interfejsu.
 * @inf04-relevance Implementacja interfejsów.
 */
class BidderObserver implements IAuctionObserver {
	private readonly received: string[] = [];

	constructor(private readonly bidderId: string) {}

	public getBidderId(): string {
		return this.bidderId;
	}

	public update(event: BidEvent): void {
		const message = `[${this.bidderId}] Nowa oferta na ${event.itemId}: ${event.newHighestBid} zł (od ${event.bidderId})`;
		this.received.push(message);
		console.log(`  ${message}`);
	}

	public getReceivedCount(): number {
		return this.received.length;
	}
}

/**
 * @description Przedmiot aukcji: waliduje oferty, aktualizuje cenę i powiadamia wszystkich poza autorem.
 * @architectural-note Walidacja przed zmianą stanu chroni przed niespójnością danych.
 * @inf04-relevance Reguły biznesowe + wzorzec w jednym module.
 */
class AuctionItem {
	private observers: IAuctionObserver[] = [];

	constructor(private readonly itemId: string, private currentPrice: number) {}

	public attach(observer: IAuctionObserver): void {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
		}
	}

	public detach(bidderId: string): void {
		this.observers = this.observers.filter(obs => obs.getBidderId() !== bidderId);
	}

	public getObserverCount(): number {
		return this.observers.length;
	}

	/**
	 * @description Składa ofertę; zwraca true, gdy kwota jest wyższa od aktualnej.
	 * @architectural-note Odrzucona oferta nie zmienia stanu ani nie wywołuje powiadomień.
	 * @inf04-relevance Walidacja danych wejściowych.
	 */
	public placeBid(bidderId: string, bidAmount: number): boolean {
		if (!Number.isFinite(bidAmount) || bidAmount <= this.currentPrice) {
			return false;
		}
		this.currentPrice = bidAmount;
		this.notify(bidderId);
		return true;
	}

	private notify(lastBidderId: string): void {
		const event: BidEvent = { itemId: this.itemId, newHighestBid: this.currentPrice, bidderId: lastBidderId };
		for (const observer of [...this.observers]) {
			if (observer.getBidderId() !== lastBidderId) {
				observer.update(event);
			}
		}
	}
}

// ============================================================================
// KOD KLIENCKI – SYMULACJA
// ============================================================================

/**
 * @description Uruchamia scenariusze: antywzorzec, Observer, aukcję (sukces i błąd) oraz test detach.
 * @architectural-note Pokazuje dynamiczną zmianę listy odbiorców w czasie działania.
 * @inf04-relevance Testowanie ręczne zachowania aplikacji.
 */
async function main(): Promise<void> {
	console.log("=== ZADANIE 1: Antywzorzec (sztywne sprzężenie) ===");
	await new AntiPattern.OrderService().changeOrderStatus("ZAM-1", "OPLACONE");

	console.log("\n=== ZADANIE 2: Observer – status zamówienia ===");
	const tracker = new OrderStatusTracker();
	const sms = new CustomerSmsObserver();
	const warehouse = new WarehouseSystemObserver();
	const audit = new AuditLogObserver();
	tracker.attach(sms);
	tracker.attach(warehouse);
	tracker.attach(audit);
	tracker.changeStatus("ZAM-2", "OPLACONE");
	console.log("-- Klient rezygnuje z SMS (detach) --");
	tracker.detach(sms);
	tracker.changeStatus("ZAM-2", "WYSLANE");
	console.log(`Wpisów w historii: ${audit.getHistory().length}, obserwatorów: ${tracker.getObserverCount()}`);

	console.log("\n=== ZADANIE 3: Aukcja na żywo ===");
	const item = new AuctionItem("LAPTOP-7", 1000);
	const anna = new BidderObserver("Anna");
	const jan = new BidderObserver("Jan");
	const ola = new BidderObserver("Ola");
	item.attach(anna);
	item.attach(jan);
	item.attach(ola);
	console.log("Anna licytuje 1100:", item.placeBid("Anna", 1100));
	console.log("Jan licytuje 1200:", item.placeBid("Jan", 1200));
	console.log("Scenariusz brzegowy – Ola licytuje 1150 (za mało):", item.placeBid("Ola", 1150));
	console.log("-- Ola opuszcza aukcję (detach) --");
	item.detach("Ola");
	console.log("Anna licytuje 1300:", item.placeBid("Anna", 1300));
	console.log(`Obserwatorów aukcji: ${item.getObserverCount()}; Anna otrzymała: ${anna.getReceivedCount()}, Ola: ${ola.getReceivedCount()}`);
}

main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.log(`Błąd krytyczny: ${message}`);
});
