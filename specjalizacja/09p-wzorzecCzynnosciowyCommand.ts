// wywołanie: node 09p-wzorzecCzynnosciowyCommand.ts

// #region antywzorzec
/**
 * @description Przykład starego kontrolera, który łączy rozpoznawanie akcji i modyfikowanie koszyka.
 * @architectural-note To świadomy dług technologiczny: rozgałęzienia i logika domenowa utrudniają testy, reużycie oraz Undo.
 * @inf04-relevance Uwidacznia problem tight coupling przed refaktoryzacją do Command.
 */
class TightlyCoupledCartController {
	private readonly items = new Map<string, number>();

	/**
	 * @description Wykonuje akcję kontrolera przez rozgałęzienie i bezpośrednią zmianę mapy.
	 * @architectural-note Dodanie operacji wymaga modyfikacji tej metody, co narusza Open/Closed.
	 * @inf04-relevance Przykład antywzorca z zadania rozgrzewkowego.
	 */
	public handle(action: "add" | "remove", productId: string, quantity: number): void {
		const current = this.items.get(productId) ?? 0;
		if (action === "add") {
			if (productId.trim().length === 0 || !Number.isInteger(quantity) || quantity <= 0) {
				throw new Error("Niepoprawne dane dodania produktu.");
			}
			this.items.set(productId, current + quantity);
			console.log(`[ANTYWZORZEC] Dodano ${quantity} szt. ${productId}.`);
		} else {
			if (!Number.isInteger(quantity) || quantity <= 0 || current < quantity) {
				throw new Error("Niepoprawna ilość lub brak wymaganych sztuk.");
			}
			if (current === quantity) {
				this.items.delete(productId);
			} else {
				this.items.set(productId, current - quantity);
			}
			console.log(`[ANTYWZORZEC] Usunięto ${quantity} szt. ${productId}.`);
		}
	}
}

function callAntywzorzec(): void {
	console.log("=== 1. Antywzorzec: ciasne powiązanie ===");
	const legacyController = new TightlyCoupledCartController();
	legacyController.handle("add", "KSIĄŻKA-01", 2);
	legacyController.handle("remove", "KSIĄŻKA-01", 1);
}
// #endregion

// #region interface
/**
 * @description Interfejs samodzielnego, odwracalnego żądania; szczegóły i parametry przechowuje konkretna komenda.
 * @architectural-note Oddziela Invokera od Receivera i eliminuje bezpośrednie wywołania logiki domenowej z UI.
 * @inf04-relevance Definiuje ICommand z bezargumentowymi execute() i undo().
 */
interface ICommand {
	execute(): void;
	undo(): void;
	readonly executionDate?: Date;
}
// #endregion

// #region Cart
/**
 * @description Receiver koszyka przechowujący stan produktów i egzekwujący reguły domenowe.
 * @architectural-note Reguły koszyka pozostają poza kontrolerem i Invokerem, co ogranicza tight coupling.
 * @inf04-relevance Pokazuje odbiorcę wzorca Command oraz enkapsulację stanu.
 */
class CartReceiver {
	private readonly items = new Map<string, number>();

	/**
	 * @description Dodaje dodatnią liczbę sztuk produktu do koszyka.
	 * @architectural-note Receiver sam waliduje swoje niezmienniki, bez względu na źródło żądania.
	 * @inf04-relevance Jest typowaną operacją biznesową odbiorcy polecenia.
	 */
	public addItem(productId: string, quantity: number): void {
		this.validate(productId, quantity);
		const current = this.items.get(productId) ?? 0;
		this.items.set(productId, current + quantity);
		console.log(`[KOSZYK] Dodano ${quantity} szt. ${productId}. Stan: ${current + quantity}`);
	}

	/**
	 * @description Usuwa wskazaną liczbę sztuk, odrzucając żądanie przekraczające aktualny stan.
	 * @architectural-note Operacja nie dopuszcza ujemnego stanu ani cichego usuwania nieistniejących produktów.
	 * @inf04-relevance Demonstruje walidację przypadku brzegowego w logice domenowej.
	 */
	public removeItem(productId: string, quantity: number): void {
		this.validate(productId, quantity);
		const current = this.items.get(productId) ?? 0;
		if (current < quantity) {
			throw new Error(`Koszyk zawiera tylko ${current} szt. produktu ${productId}.`);
		}
		if (current === quantity) {
			this.items.delete(productId);
		} else {
			this.items.set(productId, current - quantity);
		}
		console.log(`[KOSZYK] Usunięto ${quantity} szt. ${productId}.`);
	}

	/**
	 * @description Zwraca liczbę sztuk produktu, nie udostępniając wewnętrznej mapy.
	 * @architectural-note Zwracana wartość zamiast referencji chroni enkapsulację stanu.
	 * @inf04-relevance Umożliwia klientowi sprawdzenie stanu przed i po execute()/undo().
	 */
	public getQuantity(productId: string): number {
		return this.items.get(productId) ?? 0;
	}

	/**
	 * @description Weryfikuje niepusty identyfikator i dodatnią, całkowitą ilość.
	 * @architectural-note Wspólna walidacja zapobiega rozbieżnym regułom poszczególnych komend.
	 * @inf04-relevance Pokazuje ochronę danych wejściowych w warstwie domenowej.
	 */
	private validate(productId: string, quantity: number): void {
		if (productId.trim().length === 0) {
			throw new Error("Identyfikator produktu nie może być pusty.");
		}
		if (!Number.isInteger(quantity) || quantity <= 0) {
			throw new Error("Ilość musi być dodatnią liczbą całkowitą.");
		}
	}
}

/**
 * @description ConcreteCommand dodająca produkt; przechowuje Receiver, parametry i stan wykonania.
 * @architectural-note Hermetyzuje całe żądanie, więc interfejs klienta nie zna metod domenowych koszyka.
 * @inf04-relevance Jest przykładem komendy z bezargumentowymi metodami execute() i undo().
 */
class AddToCartCommand implements ICommand {
	private executed = false;
	private executedAt: Date | undefined;
	private readonly cart: CartReceiver;
	private readonly productId: string;
	private readonly quantity: number;

	public constructor(cart: CartReceiver, productId: string, quantity: number) {
		this.cart = cart;
		this.productId = productId;
		this.quantity = quantity;
	}

	/**
	 * @description Zwraca kopię daty udanego wykonania jako metadane polecenia.
	 * @architectural-note Zewnętrzny kod nie może modyfikować wewnętrznej daty komendy.
	 * @inf04-relevance Realizuje opcjonalne executionDate z interfejsu ICommand.
	 */
	public get executionDate(): Date | undefined {
		return this.executedAt === undefined ? undefined : new Date(this.executedAt.getTime());
	}

	/**
	 * @description Dodaje produkt i ustawia stan wykonania dopiero po sukcesie odbiorcy.
	 * @architectural-note Flaga chroni przed ponownym wykonaniem tej samej instancji polecenia.
	 * @inf04-relevance Pokazuje implementację ConcreteCommand i kontrolę cyklu życia.
	 */
	public execute(): void {
		if (this.executed) {
			throw new Error("To polecenie dodania zostało już wykonane.");
		}
		this.cart.addItem(this.productId, this.quantity);
		this.executedAt = new Date();
		this.executed = true;
	}

	/**
	 * @description Usuwa uprzednio dodane sztuki i odznacza wykonanie.
	 * @architectural-note Nie pozwala cofnąć niewykonanego ani wcześniej cofniętego polecenia.
	 * @inf04-relevance Demonstruje operację Undo konkretnej komendy.
	 */
	public undo(): void {
		if (!this.executed) {
			throw new Error("Nie można cofnąć niewykonanego polecenia dodania.");
		}
		this.cart.removeItem(this.productId, this.quantity);
		this.executed = false;
	}
}

/**
 * @description ConcreteCommand usuwająca produkt i przechowująca snapshot stanu sprzed operacji.
 * @architectural-note Migawka pobrana przed zmianą pozwala odtworzyć stan, którego nie da się ustalić przy undo().
 * @inf04-relevance Demonstruje zapamiętywanie stanu początkowego dla bezpiecznego cofania.
 */
class RemoveFromCartCommand implements ICommand {
	private executed = false;
	private executedAt: Date | undefined;
	private previousQuantity = 0;
	private readonly cart: CartReceiver;
	private readonly productId: string;
	private readonly quantity: number;

	public constructor(cart: CartReceiver, productId: string, quantity: number) {
		this.cart = cart;
		this.productId = productId;
		this.quantity = quantity;
	}

	/**
	 * @description Udostępnia kopię daty wykonania komendy.
	 * @architectural-note Metadane nie są udostępniane jako mutowalny stan wewnętrzny.
	 * @inf04-relevance Uzupełnia implementację opcjonalnego pola executionDate.
	 */
	public get executionDate(): Date | undefined {
		return this.executedAt === undefined ? undefined : new Date(this.executedAt.getTime());
	}

	/**
	 * @description Zapamiętuje stan koszyka, usuwa ilość i oznacza powodzenie komendy.
	 * @architectural-note Snapshot jest rejestrowany przed modyfikacją, a flaga dopiero po sukcesie.
	 * @inf04-relevance Uczy przechowywania stanu potrzebnego do undo().
	 */
	public execute(): void {
		if (this.executed) {
			throw new Error("To polecenie usunięcia zostało już wykonane.");
		}
		this.previousQuantity = this.cart.getQuantity(this.productId);
		this.cart.removeItem(this.productId, this.quantity);
		this.executedAt = new Date();
		this.executed = true;
	}

	/**
	 * @description Przywraca ilość sprzed usunięcia, dodając różnicę do aktualnego stanu produktu.
	 * @architectural-note Cofnięcie korzysta z migawki i kontroluje niepoprawną kolejność wywołań.
	 * @inf04-relevance Pokazuje odwracanie operacji na podstawie snapshotu.
	 */
	public undo(): void {
		if (!this.executed) {
			throw new Error("Nie można cofnąć niewykonanego polecenia usunięcia.");
		}
		const missingQuantity = this.previousQuantity - this.cart.getQuantity(this.productId);
		if (missingQuantity > 0) {
			this.cart.addItem(this.productId, missingQuantity);
		}
		this.executed = false;
	}
}

/**
 * @description Invoker koszyka obsługujący historię Undo i Redo na stosach LIFO.
 * @architectural-note Zna tylko ICommand, więc dodawanie nowych komend nie wymaga modyfikowania Invokera.
 * @inf04-relevance Demonstruje role Invokera, historię i zasadę Open/Closed.
 */
class CartInvoker {
	private readonly undoStack: ICommand[] = [];
	private readonly redoStack: ICommand[] = [];

	/**
	 * @description Wykonuje komendę, zapisuje sukces na stosie Undo i unieważnia wcześniejsze Redo.
	 * @architectural-note Nieudane polecenie nie trafia do historii.
	 * @inf04-relevance Pokazuje wywoływanie komend bez znajomości ich logiki.
	 */
	public execute(command: ICommand): void {
		command.execute();
		this.undoStack.push(command);
		this.redoStack.length = 0;
	}

	/**
	 * @description Cofa ostatnie polecenie i przywraca je na stos, jeśli cofanie się nie powiedzie.
	 * @architectural-note Wyjątek nie powoduje utraty polecenia z historii.
	 * @inf04-relevance Implementuje Undo z obsługą błędów Invokera.
	 */
	public undo(): void {
		const command = this.undoStack.pop();
		if (command === undefined) {
			console.log("[KOSZYK] Brak operacji do cofnięcia.");
			return;
		}
		try {
			command.undo();
			this.redoStack.push(command);
		} catch (error: unknown) {
			this.undoStack.push(command);
			throw error;
		}
	}

	/**
	 * @description Ponawia ostatnio cofniętą komendę i przenosi ją na stos Undo po sukcesie.
	 * @architectural-note W razie awarii komenda wraca na stos Redo, więc historia pozostaje spójna.
	 * @inf04-relevance Demonstruje drugi stos wymagany do realizacji Redo.
	 */
	public redo(): void {
		const command = this.redoStack.pop();
		if (command === undefined) {
			console.log("[KOSZYK] Brak operacji do ponowienia.");
			return;
		}
		try {
			command.execute();
			this.undoStack.push(command);
		} catch (error: unknown) {
			this.redoStack.push(command);
			throw error;
		}
	}
}

function callCart(): void {
	console.log("\n=== 2. Koszyk: Command, Undo i Redo ===");
	const cart = new CartReceiver();
	// const ulubione = new UlubioneReceiver();
	const cartInvoker = new CartInvoker();
	cartInvoker.execute(new AddToCartCommand(cart, "KLAWIATURA-01", 3)); // qty: 3
	console.log(`[KLIENT] Stan po dodaniu: ${cart.getQuantity("KLAWIATURA-01")}`);
	cartInvoker.execute(new RemoveFromCartCommand(cart, "KLAWIATURA-01", 1)); // qty: 1
	console.log(`[KLIENT] Stan po usunięciu: ${cart.getQuantity("KLAWIATURA-01")}`);
	cartInvoker.undo();
	console.log(`[KLIENT] Stan po Undo: ${cart.getQuantity("KLAWIATURA-01")}`);
	cartInvoker.redo();
	console.log(`[KLIENT] Stan po Redo: ${cart.getQuantity("KLAWIATURA-01")}`);
	cartInvoker.undo();
	cartInvoker.undo();
	console.log(`[KLIENT] Stan po cofnięciu wszystkich operacji: ${cart.getQuantity("KLAWIATURA-01")}`);
	try {
		cartInvoker.execute(new AddToCartCommand(cart, "KLAWIATURA-01", 0));
	} catch (error: unknown) {
		console.log(`[KLIENT] Odrzucono niepoprawne polecenie: ${getErrorMessage(error)}`);
	}
}
// #endregion

// #region BankAccount
/**
 * @description Receiver bankowy, który chroni saldo rachunku i udostępnia kontrolowane operacje domenowe.
 * @architectural-note Saldo jest prywatne i może być zmieniane wyłącznie przez walidowane metody.
 * @inf04-relevance Reprezentuje odbiorcę przelewu i pokazuje enkapsulację stanu.
 */
class BankAccount {
	public readonly accountNumber: string;
	private balance: number;

	public constructor(accountNumber: string, balance: number) {
		this.accountNumber = accountNumber;
		this.balance = balance;

		if (this.accountNumber.trim().length === 0) {
			throw new Error("Numer rachunku nie może być pusty.");
		}
		if (!Number.isFinite(this.balance) || this.balance < 0) {
			throw new Error("Saldo początkowe musi być nieujemną liczbą.");
		}
	}

	/**
	 * @description Obciąża rachunek, zwracając false bez zmiany stanu przy braku środków.
	 * @architectural-note Operacja jest atomowa na poziomie rachunku i nie dopuszcza ujemnego salda.
	 * @inf04-relevance Pokazuje regułę biznesową i przypadek brzegowy braku środków.
	 */
	public debit(amount: number): boolean {
		this.validateAmount(amount);
		if (this.balance < amount) {
			return false;
		}
		this.balance -= amount;
		return true;
	}

	/**
	 * @description Uznaje rachunek dodatnią, skończoną kwotą.
	 * @architectural-note Receiver odrzuca wartości niepoprawne, chroniąc swoje niezmienniki.
	 * @inf04-relevance Demonstruje kontrolowaną zmianę stanu domenowego.
	 */
	public credit(amount: number): void {
		this.validateAmount(amount);
		this.balance += amount;
	}

	/**
	 * @description Udostępnia aktualne saldo bez możliwości jego bezpośredniej zmiany.
	 * @architectural-note Odczyt nie ujawnia prywatnego pola ani referencji mutowalnej.
	 * @inf04-relevance Klient może zweryfikować stan kont po wykonaniu i rollbacku.
	 */
	public getBalance(): number {
		return this.balance;
	}

	/**
	 * @description Odrzuca kwoty zerowe, ujemne lub niefinitywne.
	 * @architectural-note Jedna walidacja zabezpiecza zarówno debit, jak i credit.
	 * @inf04-relevance Pokazuje walidację danych numerycznych w logice domenowej.
	 */
	private validateAmount(amount: number): void {
		if (!Number.isFinite(amount) || amount <= 0) {
			throw new Error("Kwota musi być dodatnią, skończoną liczbą.");
		}
	}
}

/**
 * @description Komenda przelewu przechowująca odbiorców, kwotę, flagę wykonania i migawkę salda docelowego.
 * @architectural-note Migawka umożliwia ocenę, czy rollback nie naruszy salda, które istniało przed przelewem.
 * @inf04-relevance Jest bankową ConcreteCommand z obsługą transakcji kompensacyjnej.
 */
class TransferCommand implements ICommand {
	private executed = false;
	private executedAt: Date | undefined;
	private targetBalanceBeforeExecution = 0;
	private readonly source: BankAccount;
	private readonly target: BankAccount;
	private readonly amount: number;

	public constructor(source: BankAccount, target: BankAccount, amount: number) {
		this.source = source;
		this.target = target;
		this.amount = amount;

		if (source === target) {
			throw new Error("Rachunek źródłowy i docelowy muszą być różne.");
		}
		if (!Number.isFinite(amount) || amount <= 0) {
			throw new Error("Kwota przelewu musi być dodatnią, skończoną liczbą.");
		}
	}

	/**
	 * @description Udostępnia kopię daty udanego wykonania do celów audytowych.
	 * @architectural-note Klient nie może zmodyfikować wewnętrznych metadanych polecenia.
	 * @inf04-relevance Łączy interfejs ICommand z dziennikiem audytowym.
	 */
	public get executionDate(): Date | undefined {
		return this.executedAt === undefined ? undefined : new Date(this.executedAt.getTime());
	}

	/**
	 * @description Obciąża źródło i uznaje cel; kompensuje obciążenie, jeśli uznanie zakończy się wyjątkiem.
	 * @architectural-note Historia zostanie zarejestrowana przez manager dopiero po pełnym sukcesie.
	 * @inf04-relevance Pokazuje bezpieczne execute(), snapshot stanu i obsługę błędu częściowej transakcji.
	 */
	public execute(): void {
		if (this.executed) {
			throw new Error("Przelew został już wykonany.");
		}
		this.targetBalanceBeforeExecution = this.target.getBalance();
		if (!this.source.debit(this.amount)) {
			throw new Error(`Brak środków na rachunku źródłowym: ${this.source.accountNumber}`);
		}
		try {
			this.target.credit(this.amount);
			this.executed = true;
			this.executedAt = new Date();
		} catch (error: unknown) {
			this.source.credit(this.amount);
			throw error;
		}
	}

	/**
	 * @description Cofa wykonany transfer tylko wtedy, gdy saldo celu po obciążeniu nie spadnie poniżej snapshotu.
	 * @architectural-note Walidacja przed zmianą obu rachunków chroni przed częściowym rollbackiem.
	 * @inf04-relevance Pokazuje zabezpieczenie przed podwójnym undo i bezpieczny rollback transakcji.
	 */
	public undo(): void {
		if (!this.executed) {
			throw new Error("Nie można cofnąć niewykonanego lub już cofniętego przelewu.");
		}
		if (this.target.getBalance() - this.amount < this.targetBalanceBeforeExecution) {
			throw new Error("Konto docelowe nie posiada środków pozwalających bezpiecznie cofnąć transakcję.");
		}
		if (!this.target.debit(this.amount)) {
			throw new Error("Nie udało się obciążyć rachunku docelowego podczas rollbacku.");
		}
		this.source.credit(this.amount);
		this.executed = false;
	}
}

/**
 * @description Bezpiecznie zawęża unknown do czytelnego komunikatu błędu.
 * @architectural-note Nie zakłada, że każda rzucona wartość jest obiektem Error.
 * @inf04-relevance Pokazuje obsługę wyjątków w strict mode bez użycia any.
 */
function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	return "Wystąpił nieznany błąd.";
}

/**
 * @description Typ danych transferowych opisujący audytowalną operację.
 * @architectural-note DTO oddziela metadane audytowe od reguł biznesowych komendy.
 * @inf04-relevance Demonstruje ścisłe typowanie danych używanych przez dziennik audytowy.
 */
interface AuditEntry {
	readonly commandName: string;
	readonly executionDate: Date;
	readonly actorId: string;
	readonly description: string;
}

/**
 * @description Interfejs odczytu i zapisu audytu niezależny od sposobu jego trwałego przechowywania.
 * @architectural-note Manager zależy od abstrakcji, a nie od konkretnej bazy lub kolekcji.
 * @inf04-relevance Pokazuje programowanie do interfejsu i separację warstwy infrastruktury.
 */
interface IAuditLog {
	append(entry: AuditEntry): void;
	list(): readonly AuditEntry[];
}

/**
 * @description Dziennik audytowy in-memory implementujący IAuditLog bez zewnętrznej bazy danych.
 * @architectural-note Oddziela trwałość audytu od managera i przechowuje kopie wpisów.
 * @inf04-relevance Symuluje produkcyjny Audit Log w samodzielnym programie ćwiczeniowym.
 */
class InMemoryAuditLog implements IAuditLog {
	private readonly entries: AuditEntry[] = [];

	/**
	 * @description Dopisuje kopię wpisu, w tym niezależną kopię daty.
	 * @architectural-note Modyfikacja obiektu przekazanego przez klienta nie zmienia utrwalonej historii.
	 * @inf04-relevance Pokazuje implementację interfejsu infrastrukturalnego.
	 */
	public append(entry: AuditEntry): void {
		this.entries.push({ ...entry, executionDate: new Date(entry.executionDate.getTime()) });
	}

	/**
	 * @description Zwraca kopię wpisów jako kolekcję tylko do odczytu.
	 * @architectural-note Klient nie uzyskuje referencji do wewnętrznej tablicy audytu.
	 * @inf04-relevance Uczy bezpiecznego udostępniania kolekcji i ścisłego typowania.
	 */
	public list(): readonly AuditEntry[] {
		return this.entries.map((entry) => ({
			...entry,
			executionDate: new Date(entry.executionDate.getTime()),
		}));
	}
}

/**
 * @description Invoker transakcyjny zarządzający historią, audytem i kompensacją poleceń bankowych.
 * @architectural-note Zależy od ICommand oraz IAuditLog, nie od konkretnych klas rachunków ani technologii składowania.
 * @inf04-relevance Pokazuje TransactionManager, stos historii i obsługę błędów scenariusza głównego.
 */
class TransactionManager {
	private readonly undoStack: ICommand[] = [];
	private readonly redoStack: ICommand[] = [];
	private readonly auditLog: IAuditLog;
	private readonly actorId: string;

	public constructor(auditLog: IAuditLog, actorId: string) {
		this.auditLog = auditLog;
		this.actorId = actorId;
	}

	/**
	 * @description Wykonuje komendę, zapisuje sukces na stosie i dodaje wpis audytowy.
	 * @architectural-note Polecenie trafia do historii dopiero po sukcesie; wyjątek nie tworzy fałszywego audytu sukcesu.
	 * @inf04-relevance Realizuje executeTransaction() z obsługą błędów.
	 */
	public executeTransaction(command: ICommand): boolean {
		try {
			command.execute();
			this.undoStack.push(command);
			this.redoStack.length = 0;
			this.auditLog.append({
				commandName: command.constructor.name,
				executionDate: command.executionDate ?? new Date(),
				actorId: this.actorId,
				description: "Transakcja wykonana i zarejestrowana.",
			});
			console.log("[AUDIT] Transakcja wykonana i zarejestrowana.");
			return true;
		} catch (error: unknown) {
			console.error("[TRANSACTION ERROR]", getErrorMessage(error));
			return false;
		}
	}

	/**
	 * @description Cofa ostatnią transakcję i przenosi ją do Redo; przy awarii ją przywraca na stos Undo.
	 * @architectural-note Nieudany rollback nie usuwa polecenia z historii, zachowując możliwość ponowienia.
	 * @inf04-relevance Realizuje rollbackLastTransaction() oraz przypadek pustej historii.
	 */
	public rollbackLastTransaction(): boolean {
		const command = this.undoStack.pop();
		if (command === undefined) {
			console.warn("Historia transakcji jest pusta. Brak operacji do wycofania.");
			return false;
		}
		try {
			command.undo();
			this.redoStack.push(command);
			this.auditLog.append({
				commandName: command.constructor.name,
				executionDate: new Date(),
				actorId: this.actorId,
				description: "Transakcja została wycofana (rollback).",
			});
			console.log("[AUDIT] Ostatnia transakcja została wycofana (rollback).");
			return true;
		} catch (error: unknown) {
			this.undoStack.push(command);
			console.error("[ROLLBACK ERROR]", getErrorMessage(error));
			return false;
		}
	}

	/**
	 * @description Ponawia cofniętą komendę i rejestruje nowe wykonanie w audycie.
	 * @architectural-note Komenda wraca na stos Redo po błędzie, aby nie utracić historii.
	 * @inf04-relevance Demonstruje Redo i spójność stosów historii.
	 */
	public redoLastTransaction(): boolean {
		const command = this.redoStack.pop();
		if (command === undefined) {
			console.warn("Brak cofniętej transakcji do ponowienia.");
			return false;
		}
		try {
			command.execute();
			this.undoStack.push(command);
			this.auditLog.append({
				commandName: command.constructor.name,
				executionDate: command.executionDate ?? new Date(),
				actorId: this.actorId,
				description: "Cofnięta transakcja została ponowiona.",
			});
			console.log("[AUDIT] Transakcja została ponowiona.");
			return true;
		} catch (error: unknown) {
			this.redoStack.push(command);
			console.error("[REDO ERROR]", getErrorMessage(error));
			return false;
		}
	}
}

function callBankAccount() {
	console.log("\n=== 3. Bank: sukces, rollback i ponowienie ===");
	const auditLog = new InMemoryAuditLog();
	const manager = new TransactionManager(auditLog, "uczen-04");
	const source = new BankAccount("PL00-100", 1000);
	const target = new BankAccount("PL00-200", 250);
	console.log(`[BANK] Salda początkowe: źródło=${source.getBalance()}, cel=${target.getBalance()}`);
	manager.executeTransaction(new TransferCommand(source, target, 300));
	console.log(`[BANK] Po przelewie: źródło=${source.getBalance()}, cel=${target.getBalance()}`);
	manager.rollbackLastTransaction();
	console.log(`[BANK] Po rollbacku: źródło=${source.getBalance()}, cel=${target.getBalance()}`);
	manager.redoLastTransaction();
	console.log(`[BANK] Po ponowieniu: źródło=${source.getBalance()}, cel=${target.getBalance()}`);
	manager.rollbackLastTransaction();
	console.log(`[BANK] Po ponownym rollbacku: źródło=${source.getBalance()}, cel=${target.getBalance()}`);

	console.log("\n=== 4. Awaria: brak środków i pusta historia ===");
	const succeeded = manager.executeTransaction(new TransferCommand(source, target, 5000));
	console.log(`[BANK] Nieudany przelew zakończony sukcesem: ${succeeded}`);
	console.log(`[BANK] Salda po odmowie: źródło=${source.getBalance()}, cel=${target.getBalance()}`);
	manager.rollbackLastTransaction();
	console.log(`[AUDIT] Liczba wpisów: ${auditLog.list().length}`);
	for (const entry of auditLog.list()) {
		console.log(`[AUDIT] ${entry.executionDate.toISOString()} | ${entry.actorId} | ${entry.commandName} | ${entry.description}`);
	}
}
// #endregion

/**
 * @description Uruchamia antywzorzec, komendy koszyka oraz sukces i awarię przelewu, raportując stany w konsoli.
 * @architectural-note Klient konfiguruje komendy, a Invoker wywołuje je bez znajomości odbiorców.
 * @inf04-relevance Symuluje rolę Clienta oraz weryfikuje Undo/Redo, audyt i przypadki brzegowe.
 */
function main(): void {
	callAntywzorzec();
	callCart();
	callBankAccount();
}

main();
