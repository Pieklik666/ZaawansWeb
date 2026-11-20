/**
 * @description Dane rejestracji przekazywane przez klienta.
 * @architectural-note DTO nie ujawnia implementacji podsystemów.
 * @inf04-relevance Ćwiczy ścisłe typowanie danych wejściowych.
 */
interface RegisterDTO {
	readonly name: string;
	readonly email: string;
	readonly passwordPlain: string;
}

/**
 * @description Użytkownik zapisany w systemie.
 * @architectural-note Encja przechowuje skrót, nigdy hasło jawne.
 * @inf04-relevance Przykład typowania modelu domenowego.
 */
interface User {
	readonly id: string;
	readonly name: string;
	readonly email: string;
	readonly passwordHash: string;
}

/**
 * @description Kontrakt usługi skracającej hasła.
 * @architectural-note Abstrakcja uniezależnia aplikację od biblioteki kryptograficznej.
 * @inf04-relevance Pokazuje programowanie względem interfejsu.
 */
interface PasswordHasher {
	hash(password: string): Promise<string>;
}

/**
 * @description Kontrakt zapisu użytkowników.
 * @architectural-note Repozytorium oddziela persystencję od orkiestracji.
 * @inf04-relevance Ilustruje podział odpowiedzialności i typy generyczne utility.
 */
interface UserRepository {
	save(user: Omit<User, "id">): Promise<User>;
}

/**
 * @description Kontrakt wysyłki wiadomości aktywacyjnych.
 * @architectural-note Klient nie zależy od dostawcy poczty.
 * @inf04-relevance Przykład wymiennego podsystemu.
 */
interface EmailService {
	sendActivationEmail(email: string, token: string): Promise<void>;
}

/**
 * @description Kontrakt zapisu zdarzeń audytowych.
 * @architectural-note Logowanie pozostaje poza odpowiedzialnością kontrolera.
 * @inf04-relevance Uczy separacji usług aplikacyjnych.
 */
interface AuditLogger {
	logAction(message: string): Promise<void>;
}

/**
 * @description Kontrakt tworzenia tokenu aktywacyjnego.
 * @architectural-note Szczegóły tokenów nie są częścią fasady ani kontrolera.
 * @inf04-relevance Przykład dalszego podsystemu ukrywanego za fasadą.
 */
interface RegistrationTokenService {
	createToken(userId: string): string;
}

/**
 * @description Wynik rejestracji z rozróżnieniem sukcesu i błędu.
 * @architectural-note Unia dyskryminowana jest bezpieczniejsza niż niejednoznaczny boolean.
 * @inf04-relevance Ćwiczy typy unii i ich zawężanie.
 */
type RegistrationResult =
	| { readonly success: true; readonly user: User }
	| { readonly success: false; readonly message: string };

/**
 * @description Dydaktyczna implementacja hashera do symulacji in-memory.
 * @architectural-note To wyłącznie atrapa; produkcja wymaga sprawdzonego algorytmu haszującego.
 * @inf04-relevance Pokazuje implementację interfejsu oraz asynchroniczny kontrakt.
 */
class DemoPasswordHasher implements PasswordHasher {
	/**
	 * @description Wytwarza deterministyczny skrót demonstracyjny.
	 * @architectural-note Fasada deleguje haszowanie do odpowiedzialnego podsystemu.
 * @inf04-relevance Uczeń poznaje walidację i zwracanie Promise.
 */
	public async hash(password: string): Promise<string> {
		if (password.trim().length < 8) {
			throw new Error("Hasło musi mieć co najmniej 8 znaków.");
		}
		return `demo-hash-${password.length}-${password.split("").reverse().join("")}`;
	}
}

/**
 * @description Repozytorium przechowujące użytkowników w pamięci.
 * @architectural-note Ukrywa sposób przechowywania danych przed resztą aplikacji.
 * @inf04-relevance Przykład klasy pomocniczej i kolekcji typowanej.
 */
class InMemoryUserRepository implements UserRepository {
	private readonly users: User[] = [];
	private nextId = 1;

	/**
	 * @description Zapisuje użytkownika i pilnuje unikalności adresu e-mail.
	 * @architectural-note Odpowiedzialność persystencji nie jest dodawana do fasady.
	 * @inf04-relevance Ćwiczy asynchroniczną metodę, typ Omit i warunki.
	 */
	public async save(user: Omit<User, "id">): Promise<User> {
		if (this.users.some((stored) => stored.email === user.email)) {
			throw new Error(`Adres ${user.email} jest już zarejestrowany.`);
		}
		const saved: User = { ...user, id: `user-${this.nextId}` };
		this.nextId += 1;
		this.users.push(saved);
		return saved;
	}
}

/**
 * @description Symuluje wysyłanie poczty aktywacyjnej.
 * @architectural-note Dostawca transportu wiadomości jest ukryty za interfejsem.
 * @inf04-relevance Ilustruje podsystem, który fasada agreguje.
 */
class ConsoleEmailService implements EmailService {
	/**
	 * @description Loguje wysłanie wiadomości w konsoli.
	 * @architectural-note Klient nie musi znać API firmy mailingowej.
 * @inf04-relevance Pokazuje przekazanie pracy do osobnej klasy.
 */
	public async sendActivationEmail(email: string, token: string): Promise<void> {
		console.log(`[Email] Wysłano aktywację do ${email}; token=${token}`);
	}
}

/**
 * @description Symuluje rejestrowanie zdarzeń audytowych.
 * @architectural-note Format i miejsce logów są szczegółem podsystemu.
 * @inf04-relevance Pokazuje zależność przez kontrakt.
 */
class ConsoleAuditLogger implements AuditLogger {
	/**
	 * @description Zapisuje zdarzenie audytowe w konsoli.
	 * @architectural-note Fasada deleguje logowanie zamiast implementować je samodzielnie.
 * @inf04-relevance Ćwiczy jasno określoną odpowiedzialność metody.
 */
	public async logAction(message: string): Promise<void> {
		console.log(`[Audit] ${message}`);
	}
}

/**
 * @description Tworzy token aktywacyjny w symulacji.
 * @architectural-note Implementacja tokenu może być podmieniona bez zmian klienta.
 * @inf04-relevance Pokazuje dodatkowy ukrywany podsystem.
 */
class DemoTokenService implements RegistrationTokenService {
	/**
	 * @description Zwraca token powiązany z identyfikatorem użytkownika.
	 * @architectural-note Kontroler nie zna szczegółów generowania tokenów.
	 * @inf04-relevance Ćwiczy typowanie parametrów i wyniku.
	 */
	public createToken(userId: string): string {
		return `activation-${userId}`;
	}
}

/**
 * @description Zapewnia pojedynczy, prosty punkt wejścia do procesu rejestracji.
 * @architectural-note Fasada orkiestruje usługi, ale nie implementuje ich szczegółowej logiki.
 * @inf04-relevance Główna demonstracja strukturalnego wzorca GoF Fasada.
 */
class RegistrationFacade {
	/**
	 * @description Przyjmuje zależności podsystemów przez kontrakty.
 * @architectural-note Wstrzykiwanie zależności umożliwia podmianę usług i testy.
 * @inf04-relevance Ćwiczy konstruktor, modyfikatory i interfejsy.
 */
	public constructor(
		private readonly hasher: PasswordHasher,
		private readonly repository: UserRepository,
		private readonly email: EmailService,
		private readonly audit: AuditLogger,
		private readonly tokens: RegistrationTokenService
	) {}

	/**
	 * @description Waliduje dane i koordynuje haszowanie, zapis, token, e-mail oraz audyt.
	 * @architectural-note Nadmierna liczba niezwiązanych procesów zmieniłaby fasadę w God Object.
	 * @inf04-relevance Metoda publiczna fasady upraszcza API klienta.
	 */
	public async register(data: RegisterDTO): Promise<RegistrationResult> {
		try {
			if (data.name.trim() === "" || !data.email.includes("@")) {
				return { success: false, message: "Nieprawidłowe imię lub adres e-mail." };
			}
			await this.audit.logAction(`Rozpoczęcie rejestracji ${data.email}`);
			const passwordHash = await this.hasher.hash(data.passwordPlain);
			const user = await this.repository.save({
				name: data.name.trim(),
				email: data.email.trim().toLowerCase(),
				passwordHash
			});
			const token = this.tokens.createToken(user.id);
			await this.email.sendActivationEmail(user.email, token);
			await this.audit.logAction(`Zakończenie rejestracji ${user.id}`);
			return { success: true, user };
		} catch (error: unknown) {
			return { success: false, message: error instanceof Error ? error.message : "Nieznany błąd rejestracji." };
		}
	}
}

/**
 * @description Typowana odpowiedź kontrolera symulującego endpoint HTTP.
 * @architectural-note Odpowiedź nie ujawnia klientowi szczegółów podsystemów.
 * @inf04-relevance Pokazuje mapowanie wyniku aplikacji na status HTTP.
 */
interface HttpResponse {
	readonly statusCode: number;
	readonly body: { readonly success: boolean; readonly userId?: string; readonly error?: string };
}

/**
 * @description Kontroler korzystający tylko z fasady rejestracji.
 * @architectural-note Nie tworzy bezpośrednio hashera, bazy, mailera, loggera ani usługi tokenów.
 * @inf04-relevance Uwidacznia zależność klient → Fasada zamiast pięciu implementacji.
 */
class RegistrationController {
	/**
	 * @description Wstrzykuje jedyną zależność aplikacyjną kontrolera.
	 * @architectural-note Zmniejsza sprzężenie i ułatwia testowanie kontrolera.
	 * @inf04-relevance Przykład konstruktora i modyfikatora readonly.
	 */
	public constructor(private readonly facade: RegistrationFacade) {}

	/**
	 * @description Deleguje rejestrację i mapuje rezultat na odpowiedź HTTP.
	 * @architectural-note Orkiestracja procesu nie należy do warstwy routingu.
	 * @inf04-relevance Pokazuje współpracę kontrolera z fasadą.
	 */
	public async register(data: RegisterDTO): Promise<HttpResponse> {
		const result = await this.facade.register(data);
		return result.success
			? { statusCode: 201, body: { success: true, userId: result.user.id } }
			: { statusCode: 400, body: { success: false, error: result.message } };
	}
}

/**
 * @description Antywzorzec kontrolera tworzącego bezpośrednio wszystkie usługi rejestracji.
 * @architectural-note Wysokie sprzężenie, niska spójność i trudne testy stanowią dług technologiczny.
 * @inf04-relevance Kod służy do audytu i kontrastu z rozwiązaniem fasadowym.
 */
class LegacySpaghettiController {
	/**
	 * @description Rejestruje użytkownika, inicjalizując pięć podsystemów w kontrolerze.
	 * @architectural-note Zmiana dostawcy usługi wymaga modyfikacji kontrolera.
	 * @inf04-relevance Odwzorowuje zadanie rozgrzewkowe identyfikujące operatora new.
	 */
	public async registerUser(data: RegisterDTO): Promise<HttpResponse> {
		try {
			const hasher = new DemoPasswordHasher();
			const repository = new InMemoryUserRepository();
			const mailer = new ConsoleEmailService();
			const logger = new ConsoleAuditLogger();
			const tokens = new DemoTokenService();
			await logger.logAction(`Legacy start: ${data.email}`);
			const passwordHash = await hasher.hash(data.passwordPlain);
			const user = await repository.save({ name: data.name, email: data.email, passwordHash });
			await mailer.sendActivationEmail(user.email, tokens.createToken(user.id));
			return { statusCode: 201, body: { success: true, userId: user.id } };
		} catch (error: unknown) {
			return {
				statusCode: 500,
				body: { success: false, error: error instanceof Error ? error.message : "Nieznany błąd." }
			};
		}
	}
}

/**
 * @description Dane wejściowe procesu realizacji zamówienia.
 * @architectural-note DTO oddziela żądanie klienta od protokołów zewnętrznych API.
 * @inf04-relevance Ćwiczy ścisłe typowanie danych procesu biznesowego.
 */
interface OrderRequest {
	readonly orderId: string;
	readonly itemId: string;
	readonly userId: string;
	readonly amount: number;
}

/**
 * @description Kontrakt magazynu obsługującego rezerwację i zwolnienie towaru.
 * @architectural-note Jawna operacja kompensacyjna pozwala odtworzyć spójność po odmowie płatności.
 * @inf04-relevance Odpowiada integracji z WarehouseAPI w scenariuszu.
 */
interface WarehouseAPI {
	reserveStock(itemId: string): Promise<boolean>;
	releaseStock(itemId: string): Promise<void>;
}

/**
 * @description Kontrakt obciążania i zwracania płatności.
 * @architectural-note Szczegóły operatora są ukryte przed klientem fasady.
 * @inf04-relevance Przykład abstrakcji zewnętrznego systemu.
 */
interface PaymentGateway {
	charge(userId: string, amount: number): Promise<boolean>;
	refund(userId: string, amount: number): Promise<void>;
}

/**
 * @description Kontrakt API kurierskiego do tworzenia listu przewozowego.
 * @architectural-note Integracja przewoźnika jest wymiennym podsystemem.
 * @inf04-relevance Ilustruje agregowanie wielu interfejsów przez fasadę.
 */
interface ShippingAPI {
	generateWaybill(orderId: string): Promise<string>;
}

/**
 * @description Typ wyniku checkoutu obejmujący sukces i szczegóły błędu.
 * @architectural-note Typ jawnie ujawnia etap awarii i ewentualny problem kompensacji.
 * @inf04-relevance Ćwiczy modelowanie wyników unią dyskryminowaną.
 */
type OrderResult =
	| { readonly success: true; readonly trackingNumber: string }
	| { readonly success: false; readonly stage: string; readonly message: string; readonly compensationError?: string };

/**
 * @description Atrapa magazynu działająca w pamięci.
 * @architectural-note Nie wymaga prawdziwego serwera ani biblioteki zewnętrznej.
 * @inf04-relevance Umożliwia demonstrację rezerwacji i kompensacji.
 */
class DemoWarehouse implements WarehouseAPI {
	private readonly reservations = new Set<string>();

	/**
	 * @description Rezerwuje towar, o ile jest dostępny w scenariuszu symulacji.
	 * @architectural-note Reguła magazynowa pozostaje poza fasadą.
	 * @inf04-relevance Pokazuje prostą implementację asynchronicznego podsystemu.
	 */
	public async reserveStock(itemId: string): Promise<boolean> {
		if (itemId.trim() === "" || itemId.startsWith("out-of-stock")) {
			return false;
		}
		this.reservations.add(itemId);
		console.log(`[Magazyn] Zarezerwowano ${itemId}.`);
		return true;
	}

	/**
	 * @description Zwalnia rezerwację produktu.
	 * @architectural-note Jest krokiem kompensacyjnym po nieudanej płatności lub dostawie.
	 * @inf04-relevance Odpowiada kluczowemu wymaganiu transakcji integracyjnej.
	 */
	public async releaseStock(itemId: string): Promise<void> {
		this.reservations.delete(itemId);
		console.log(`[Magazyn] Zwolniono rezerwację ${itemId}.`);
	}
}

/**
 * @description Atrapa bramki płatniczej z kontrolowaną odmową.
 * @architectural-note Testowe zachowanie nie wymaga połączenia z operatorem płatności.
 * @inf04-relevance Pozwala sprawdzić obie gałęzie algorytmu fasady.
 */
class DemoPayment implements PaymentGateway {
	/**
	 * @description Akceptuje dodatnią kwotę z wyjątkiem klienta testowego payment-declined.
	 * @architectural-note Szczegóły operatora pozostają za kontraktem.
	 * @inf04-relevance Demonstruje asynchroniczny wynik operacji zewnętrznej.
	 */
	public async charge(userId: string, amount: number): Promise<boolean> {
		if (!Number.isFinite(amount) || amount <= 0) {
			throw new Error("Kwota musi być dodatnia i skończona.");
		}
		const accepted = userId !== "payment-declined";
		console.log(`[Płatność] ${accepted ? "Przyjęto" : "Odrzucono"} ${amount} dla ${userId}.`);
		return accepted;
	}

	/**
	 * @description Symuluje zwrot obciążenia po błędzie kolejnego etapu.
	 * @architectural-note Kompensacja nie jest atomową transakcją rozproszoną.
	 * @inf04-relevance Rozszerza podstawowy wariant o obsługę błędów integracyjnych.
	 */
	public async refund(userId: string, amount: number): Promise<void> {
		console.log(`[Płatność] Zwrócono ${amount} dla ${userId}.`);
	}
}

/**
 * @description Atrapa zewnętrznej usługi kurierskiej.
 * @architectural-note Format odpowiedzi przewoźnika nie wycieka do kontrolera.
 * @inf04-relevance Reprezentuje trzeci podsystem ukryty przez fasadę.
 */
class DemoShipping implements ShippingAPI {
	/**
	 * @description Generuje numer śledzenia albo zgłasza błąd dla zamówienia testowego.
	 * @architectural-note Błędy zewnętrzne są obsługiwane na poziomie orkiestracji.
	 * @inf04-relevance Ćwiczy wyjątki w asynchronicznym procesie.
	 */
	public async generateWaybill(orderId: string): Promise<string> {
		if (orderId.startsWith("shipping-failure")) {
			throw new Error("System kurierski jest niedostępny.");
		}
		const trackingNumber = `TRACK-${orderId}`;
		console.log(`[Kurier] Wygenerowano ${trackingNumber}.`);
		return trackingNumber;
	}
}

/**
 * @description Upraszcza checkout, koordynując magazyn, płatności i kuriera.
 * @architectural-note Przy awarii fasada kompensuje wykonane kroki; nie zastępuje usług biznesowych.
 * @inf04-relevance Zaawansowany przykład Fasady i transakcji kompensacyjnej.
 */
class OrderProcessingFacade {
	/**
	 * @description Wstrzykuje trzy podsystemy zewnętrzne przez interfejsy.
	 * @architectural-note Wstrzykiwanie zależności zmniejsza sprzężenie z implementacjami.
	 * @inf04-relevance Ćwiczy klasy, konstruktory i abstrakcje.
	 */
	public constructor(
		private readonly warehouse: WarehouseAPI,
		private readonly payment: PaymentGateway,
		private readonly courier: ShippingAPI
	) {}

	/**
	 * @description Rezerwuje towar, pobiera płatność i generuje etykietę; kompensuje błąd.
	 * @architectural-note Przy odrzuceniu płatności natychmiast zwalnia rezerwację; przy awarii kuriera próbuje zwrotu i zwolnienia.
	 * @inf04-relevance Realizuje główne zadanie integracyjne z obsługą awarii asynchronicznych.
	 */
	public async processOrder(request: OrderRequest): Promise<OrderResult> {
		let reserved = false;
		let charged = false;
		try {
			reserved = await this.warehouse.reserveStock(request.itemId);
			if (!reserved) {
				return { success: false, stage: "warehouse", message: "Brak towaru w magazynie." };
			}
			charged = await this.payment.charge(request.userId, request.amount);
			if (!charged) {
				await this.warehouse.releaseStock(request.itemId);
				reserved = false;
				return { success: false, stage: "payment", message: "Płatność odrzucona; towar zwolniono." };
			}
			return { success: true, trackingNumber: await this.courier.generateWaybill(request.orderId) };
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Nieznany błąd checkoutu.";
			let compensationError: string | undefined;
			if (charged) {
				try {
					await this.payment.refund(request.userId, request.amount);
				} catch (refundError: unknown) {
					compensationError = refundError instanceof Error ? refundError.message : "Nie udało się zwrócić płatności.";
				}
			}
			if (reserved) {
				try {
					await this.warehouse.releaseStock(request.itemId);
				} catch (releaseError: unknown) {
					const detail = releaseError instanceof Error ? releaseError.message : "Nie udało się zwolnić towaru.";
					compensationError = compensationError === undefined ? detail : `${compensationError}; ${detail}`;
				}
			}
			return compensationError === undefined
				? { success: false, stage: "integration", message }
				: { success: false, stage: "integration", message, compensationError };
		}
	}
}

/**
 * @description Uruchamia przykłady antywzorca, rejestracji i checkoutu.
 * @architectural-note Klient widzi uproszczone metody fasad, a nie szczegóły orkiestracji.
 * @inf04-relevance Symuluje sukces, błędne dane, brak towaru, odmowę płatności i awarię kuriera.
 */
async function main(): Promise<void> {
	console.log("=== Zadanie 1: Spaghetti Controller ===");
	const legacy = new LegacySpaghettiController();
	console.log("Legacy:", await legacy.registerUser({
		name: "Ada Nowak",
		email: "ada@example.test",
		passwordPlain: "bezpieczne-haslo"
	}));

	console.log("\n=== Zadanie 2: RegistrationFacade ===");
	const registration = new RegistrationFacade(
		new DemoPasswordHasher(),
		new InMemoryUserRepository(),
		new ConsoleEmailService(),
		new ConsoleAuditLogger(),
		new DemoTokenService()
	);
	const controller = new RegistrationController(registration);
	console.log("Rejestracja poprawna:", await controller.register({
		name: "Jan Kowalski",
		email: "jan@example.test",
		passwordPlain: "haslo-ucznia-123"
	}));
	console.log("Niepoprawne dane:", await controller.register({
		name: "",
		email: "nie-ma-malpy",
		passwordPlain: "haslo-ucznia-123"
	}));

	console.log("\n=== Zadanie 3: OrderProcessingFacade ===");
	const checkout = new OrderProcessingFacade(new DemoWarehouse(), new DemoPayment(), new DemoShipping());
	console.log("Sukces:", await checkout.processOrder({
		orderId: "order-1001", itemId: "computer-01", userId: "customer-42", amount: 4999
	}));
	console.log("Odrzucona płatność:", await checkout.processOrder({
		orderId: "order-1002", itemId: "keyboard-02", userId: "payment-declined", amount: 299
	}));
	console.log("Awaria kuriera:", await checkout.processOrder({
		orderId: "shipping-failure-1003", itemId: "monitor-03", userId: "customer-77", amount: 899
	}));
	console.log("Brak towaru:", await checkout.processOrder({
		orderId: "order-1004", itemId: "out-of-stock-item", userId: "customer-88", amount: 50
	}));
}

void main().catch((error: unknown) => {
	console.error("Błąd symulacji:", error instanceof Error ? error.message : "Nieznany błąd.");
});
