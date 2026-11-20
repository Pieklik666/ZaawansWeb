# SCENARIUSZ ZAJĘĆ: Strukturalny wzorzec projektowy: Fasada (Facade)

## 1. Metryczka

* **Czas trwania:** 2 x 45 minut (90 minut – blok zajęć)
* **Odbiorcy:** Uczniowie 4 klasy technikum programistycznego (przygotowanie do egzaminu z kwalifikacji **INF.04: Projektowanie, programowanie i testowanie aplikacji**)
* **Metody pracy:**
* Pogadanka wprowadzająca z elementami dyskusji kierowanej (analiza problemu architektonicznego).
* Studium przypadku (case study) – audyt kodu kontrolera typu „Fat/Spaghetti Controller”.
* Praca przy tablicy suchościeralnej (diagramowanie architektury oraz live-coding/whiteboard-coding).
* Praca w grupach zadaniowych z podziałem na role projektowe (Lead Architect, Backend Developer, Code Reviewer).
* Weryfikacja bieżąca: praca z asystentem AI/dokumentacją na smartfonach oraz bilet wyjścia (**Exit Ticket**).


* **Środki dydaktyczne:**
* Tablica suchościeralna z zestawem 4 kolorowych markerów (czarny: kod i struktura, niebieski: interfejsy i fasady, czerwony: błędy i dług technologiczny, zielony: przepływ danych).
* **Wydruk 1 (Materiały dla uczniów):** Karta analizy kodu „Spaghetti Controller” (1 egzemplarz na ławkę dwuosobową).
* **Wydruk 2 (Materiały dla uczniów):** Karta specyfikacji zadań projektowych (1 egzemplarz na grupę).
* **Wydruk 3 (Materiały dla uczniów):** Karty weryfikacji wiedzy „Exit Ticket” (1 egzemplarz dla każdego ucznia).
* Smartfony uczniów (wykorzystywane do sprawdzania dokumentacji TypeScript oraz weryfikacji poprawności logicznej promptami w darmowych asystentach AI).



---

## 2. Cele lekcji

### Wiedza (Uczeń zna i rozumie):

* Istotę i cel stosowania strukturalnego wzorca projektowego **Fasada (Facade)** według klasyfikacji GoF.
* Różnicę architektoniczną między **Fasadą** (upraszczanie i agregacja wielu interfejsów w jeden punkt wejścia) a wcześniej poznanym **Adapterem** (konwersja jednego niekompatybilnego interfejsu na inny).
* Pojęcie **wysokiego powiązania (high coupling)** i **niskiej spójności (low cohesion)** w warstwie kontrolerów aplikacji internetowych (Node.js/Express).
* Korzyści płynące z ukrywania złożoności podsystemów przed klientem zewnętrznym lub wyższymi warstwami systemu.

### Umiejętności (Uczeń potrafi):

* Zidentyfikować w kodzie backendowym antywzorzec przeładowanego kontrolera zarządzającego bezpośrednio wieloma podsystemami.
* Zaprojektować i zaimplementować w języku **TypeScript** klasę fasady grupuje złożone operacje biznesowe za pojedynczą, czytelną metodą publiczną.
* Wykorzystać klasyczne programowanie obiektowe w ES6/TypeScript (klasy, konstruktory, interfejsy, typowanie silne, modyfikatory dostępu) do odseparowania logiki orkiestracji.
* Rozrysować na tablicy schemat blokowy oraz uproszczony diagram powiązań pokazujący rolę Fasady w komunikacji pomiędzy klientem a podsystemami.

### Kompetencje społeczne (Uczeń jest gotowy do):

* Pracy w zespole programistycznym w roli architekta oprogramowania argumentującego konieczność refaktoryzacji kodu.
* Prowadzenia merytorycznej dyskusji technicznej i przyjmowania uwag zespołu podczas prezentacji rozwiązań przy tablicy.
* Dbania o czytelność kodu i ułatwianie pracy innym członkom zespołu poprzez dostarczanie prostych interfejsów API.

---

## 3. Lekcja 1: Teoria, koncepcje i kontekst architektoniczny (45 min)

### Etap 1: Problem architektoniczny i analogia ze świata rzeczywistego (**10 min**)

* **Instrukcja dla nauczyciela:** Rozpocznij od wprowadzenia metafory ze świata rzeczywistego, a następnie natychmiast przenieś ją na grunt architektury backendowej.
* **Metafora:** Zamawianie komputera w sklepie online. Klient nie kontaktuje się osobno z magazynem kart graficznych, działem montażu, bankiem realizującym raty i firmą kurierską w celu nadania numeru przesyłki. Klient klika jeden przycisk „Złóż zamówienie”, a całą logiką koordynacji zajmuje się wewnętrzny system sklepu.
* **Kontekst Web Developmentu (Node.js/Express):** Przedstaw problem kontrolera rejestracji użytkownika:
```typescript
	router.post('/register', async (req, res) => { /* ... */ });

```


Gdy kontroler bezpośrednio: waliduje dane, tworzy sól i haszuje hasło (np. `bcrypt`), odpytuje bazę danych (MariaDB/MongoDB), wysyła e-mail z kodem aktywacyjnym (np. `nodemailer`), generuje token autoryzacyjny i zapisuje log zdarzenia w pliku audytu, to kontroler ten staje się tzw. „God Object / Spaghetti Controller”.
* **Aktywizacja uczniów:** Zadaj klasie pytanie otwarte: *„Co stanie się z naszym kontrolerem, jeśli za miesiąc zmienimy bibliotekę wysyłki e-maili lub dodamy konieczność wysyłki SMS z kodem weryfikacyjnym?”*.
* **Oczekiwana odpowiedź uczniów:** Będziemy musieli modyfikować plik kontrolera HTTP, ryzykując błędy routingu i psując architekturę warstwową; kontroler jest zbyt ściśle powiązany ze szczegółami technicznymi narzędzi.

### Etap 2: Istota i definicja wzorca Fasada (**15 min**)

* **Wykład z dyskusją:** Fasada to strukturalny wzorzec projektowy, którego celem jest dostarczenie **prostego, jednolitego interfejsu** do złożonego zestawu klas, bibliotek lub podsystemu. Fasada nie dodaje nowej funkcjonalności biznesowej per se – jej jedynym zadaniem jest **orkiestracja (koordynacja)** wywołań istniejących usług.
* **Kluczowa instrukcja rysowania na tablicy (Nauczyciel):**
1. **Lewa strona (Klient):** Narysuj prostokąt oznaczony jako `Express Router / Client Controller`.
2. **Środek (Fasada):** Narysuj wyraźny, wyróżniony niebieskim markerem blok `RegistrationFacade` z jedną widoczną metodą publiczną `register(dto: RegisterDTO): Promise<User>`.
3. **Prawa strona (Podsystemy ukryte za Fasadą):** Narysuj 4 oddzielne klocki:
* `PasswordHasher` (`hash()`)
* `UserRepository` (`save()`)
* `EmailService` (`sendWelcomeEmail()`)
* `AuditLogger` (`logAction()`)


4. **Relacje i strzałki:**
* Poprowadź jedną prostą strzałkę z Klienta do `RegistrationFacade`.
* Z wnętrza `RegistrationFacade` wyprowadź strzałki do każdego z 4 klocków podsystemów.
* Zaznacz czerwoną linią przerywaną „barierę ochronną” – Klient nie ma bezpośredniego kontaktu z prawą stroną.




* **Pytanie kontrolne weryfikujące wiedzę z poprzednich lekcji:**
* *„Na lekcji 4 omawialiśmy wzorzec Adapter. Jaka jest fundamentalna różnica w celu stosowania Adaptera i Fasady?”*
* **Weryfikacja:** Uczniowie powinni wskazać: *Adapter* przekształca istniejący, niepasujący interfejs w inny, aby umożliwić współpracę dwóch konkretnych obiektów (1 do 1). *Fasada* tworzy zupełnie nowy, znacznie prostszy interfejs agregujący cały zestaw wielu podsystemów (1 do wielu).



### Etap 3: Implementacja w TypeScript – dekompozycja klasowa (**15 min**)

* **Prezentacja założeń kodu:** Nauczyciel omawia strukturę klasycznego podejścia OOP w TypeScript:
* Zdefiniowanie interfejsu transferu danych (`RegisterDTO`).
* Wydzielenie klas dziedzinowych podsystemu.
* Utworzenie klasy `RegistrationFacade`.


* **Przykładowa architektura kodu (analiza na tablicy):**

```typescript
interface RegisterDTO {
	name: string;
	email: string;
	passwordPlain: string;
}

class PasswordHasher {
	public hash(password: string): string {
		return `hashed_${password}_salt123`;
	}
}

class UserRepository {
	public save(name: string, email: string, passwordHash: string): boolean {
		// Logika zapisu w bazie danych
		return true;
	}
}

class EmailService {
	public sendActivationMail(to: string): void {
		// Logika wysyłki maila
	}
}

class RegistrationFacade {
	private hasher: PasswordHasher;
	private userRepo: UserRepository;
	private mailer: EmailService;

	constructor() {
		this.hasher = new PasswordHasher();
		this.userRepo = new UserRepository();
		this.mailer = new EmailService();
	}

	public async register(data: RegisterDTO): Promise<boolean> {
		const hash = this.hasher.hash(data.passwordPlain);
		const isSaved = this.userRepo.save(data.name, data.email, hash);
		if (isSaved) {
			this.mailer.sendActivationMail(data.email);
			return true;
		}
		return false;
	}
}

```

* **Aktywizacja na smartfonach:** Uczniowie otwierają na telefonach dokumentację TypeScript lub zadają swojemu asystentowi AI pytanie promptowe:
* *„Podaj 2 główne wady wzorca Facade w architekturze backendowej.”*
* Nauczyciel wybiera 2 uczniów do odczytania wyników. Kluczowy wniosek: Fasada może stać się kolejnym „God Objectem”, jeśli zacznie skupiać w sobie zbyt wiele niezwiązanych ze sobą procesów.



### Etap 4: Podsumowanie wykładu i szybki quiz ustny (**5 min**)

* Nauczyciel zadaje 3 szybkie pytania do losowo wybranych uczniów:
1. *Czy Fasada całkowicie blokuje programiście dostęp do klas niskopoziomowych, jeśli ten potrzebuje specyficznej konfiguracji?* (Odp: Nie, fasada to skrót i wygoda, ale zaawansowany klient może w razie potrzeby odwołać się do klas podsystemu bezpośrednio).
2. *W jakiej metodzie Fasady rejestracji skupiamy logikę orkiestracji?* (Odp: W publicznej metodzie `register()`).
3. *Z iloma klasami podsystemu komunikuje się kontroler Express po wdrożeniu Fasady?* (Odp: Z jedną – wyłącznie z Fasadą).



---

## 4. Lekcja 2: Ćwiczenia przy tablicy i dynamika grupy (45 min)

### Zadanie 1 (Rozgrzewka - 10 min): Audyt kontrolera „spaghetti”

* **Cel:** Identyfikacja na tablicy kontrolera, który bezpośrednio inicjalizuje 5 różnych klas podsystemu, oraz wskazanie punktów zapalnych (code smells).
* **Dynamika pracy grupy:**
* Cała klasa pracuje w parach na ławkach z **Wydrukiem 1 (Karta Analizy Kodu)**.
* Do tablicy podchodzi **dwójka wyznaczonych uczniów**: jeden z czerwonym markerem (oznacza błędy i powiązania), drugi z niebieskim (wypisuje listę wykrytych podsystemów).
* Reszta klasy w ławkach sprawdza kod, podnosi ręce i wskazuje linie, które łamią zasady czystej architektury.


* **Treść zadania na tablicy:** Na tablicy wisi arkusz z kodem metody `UserController.registerUser(req, res)` inicjalizującej: `Argon2Hasher`, `MariaDbDriver`, `SendgridEmailer`, `WinstonLogger`, `JwtTokenService`.
* **Oczekiwany rezultat na tablicy:**
* Czerwone zakreślenia wokół wszystkich wywołań operatora `new` wewnątrz metody kontrolera.
* Wypisana z boku tablicy lista 5 klas podsystemu, które muszą zostać przeniesione do warstwy fasady.
* Wniosek podsumowany jednym zdaniem przez uczniów: *Kontroler zależy od 5 implementacji technicznych zamiast jednego interfejsu biznesowego*.



---

### Zadanie 2 (Praktyka - 15 min): Implementacja `RegistrationFacade`

* **Cel:** Zgrupowanie rozproszonych klas w spójną klasę fasady udostępniającą jedną metodę `register()`.
* **Dynamika pracy grupy:**
* Klasa dzieli się na dwie połowy (Grupa Lewa i Grupa Prawa).
* Nauczyciel wybiera jeden z poniższych wariantów w zależności od profilu klasy lub przydziela Wariant A Grupie Lewej, a Wariant B Grupie Prawej.
* Reprezentanci (po 2 osoby z grupy) pracują na przypisanych połówkach tablicy. Pozostali uczniowie na bieżąco weryfikują składnię, typowanie i relacje, zgłaszając błędy w trybie natychmiastowym.



#### Wariant A (Schematyczno-graficzny):

* **Polecenie:** Rozrysuj na tablicy architektoniczny diagram klas w notacji UML/blokowej dla procesu rejestracji z użyciem Fasady. Uwzględnij:
* Klasę `AuthController`.
* Klasę `RegistrationFacade` (pokaż konstruktor, pola prywatne oraz metodę publiczną `+register(dto): Promise<User>`).
* Trzy klasy podsystemów: `PasswordService`, `DatabaseService`, `NotificationService`.
* Wskaż typy relacji (asocjacja, zależność `uses`) oraz widoczność elementów (`+`, `-`).


* **Oczekiwany rezultat na tablicy:**
* Czytelny schemat blokowy, w którym `AuthController` łączy się pojedynczą linią zależności z `RegistrationFacade`.
* Fasada ma wyprowadzone asocjacje do 3 podsystemów.
* Widoczność metod i pól ściśle oznaczona plusami i minusami.



#### Wariant B (Strukturalno-kodowy):

* **Polecenie:** Zapisz na tablicy w języku TypeScript kompletny szkielet klasy `RegistrationFacade` z pełnym typowaniem, który obsłuży rejestrację użytkownika:
* Użyj interfejsu `UserRegistrationData` (`email`, `password`, `fullName`).
* Skonfiguruj prywatne instancje serwisów podsystemu w konstruktorze.
* Zaimplementuj publiczną metodę `register(data: UserRegistrationData)` zwracającą status operacji.


* **Oczekiwany rezultat na tablicy (w kodzie używamy tabulacji):**

```typescript
interface UserRegistrationData {
	email: string;
	passwordPlain: string;
	fullName: string;
}

class RegistrationFacade {
	private hasher: Argon2Hasher;
	private db: MariaDbDriver;
	private mailer: SendgridEmailer;

	constructor() {
		this.hasher = new Argon2Hasher();
		this.db = new MariaDbDriver();
		this.mailer = new SendgridEmailer();
	}

	public async register(userData: UserRegistrationData): Promise<boolean> {
		try {
			const passwordHash = await this.hasher.generateHash(userData.passwordPlain);
			const userId = await this.db.createUser(userData.email, passwordHash, userData.fullName);
			await this.mailer.sendVerification(userData.email, userId);
			return true;
		} catch (error) {
			return false;
		}
	}
}

```

---

### Zadanie 3 (Projekt Główny - 15 min): Fasada integracyjna dla systemów zewnętrznych

* **Cel:** Symulacja spotkania architektonicznego (Architecture Review) – zaprojektowanie fasady integracyjnej dla zewnętrznych mikrousług/systemów: magazynowego, płatniczego i kurierskiego w procesie realizacji zamówienia (`Checkout`).
* **Dynamika pracy grupy:**
* **Role w klasie:**
* **Lead Architect (1 uczeń przy tablicy):** Prowadzi rysunek/zapis i podejmuje ostateczne decyzje projektowe.
* **Integration Engineers (ławki po lewej):** Odpowiadają za specyfikację komunikacji z magazynem i płatnościami.
* **DevOps / QA (ławki po prawej):** Weryfikują scenariusze błędów (np. co się stanie, gdy płatność zostanie odrzucona po rezerwacji towaru).
* **Nauczyciel:** Wciela się w rolę „Klienta biznesowego / Product Ownera”, który wymaga jednego prostego endpointu `POST /api/orders/checkout` i nie chce wiedzieć o komplikacjach systemów kurierskich.





#### Wariant A (Schematyczno-graficzny):

* **Polecenie:** Rozrysuj na tablicy architekturę fasady integracyjnej `OrderProcessingFacade` łączącej backend sklepu z 3 zewnętrznymi API:
1. `WarehouseAPI` (rezerwacja stanu magazynowego).
2. `PaymentGateway` (obciążenie karty płatniczej).
3. `ShippingAPI` (wygenerowanie etykiety kurierskiej).


* Zaznacz przepływ komunikatów od nadejścia żądania HTTP do wygenerowania odpowiedzi dla klienta sklepu.


* **Oczekiwany rezultat na tablicy:**
* Schemat blokowy pokazujący relację `OrderController` -> `OrderProcessingFacade`.
* Rozbicie na 3 podsystemy z wyszczególnieniem metod API (`reserveStock()`, `charge()`, `generateWaybill()`).
* Zaznaczony algorytm decyzyjny (bramka logiczna: czy płatność się powiodła? Jeśli nie -> zwolnij rezerwację magazynu).



#### Wariant B (Strukturalno-kodowy):

* **Polecenie:** Napisz na tablicy w TypeScript szkielet metody orkiestrującej `processOrder` w klasie `OrderProcessingFacade`. Zaimplementuj obsługę błędu: jeśli transakcja płatnicza zostanie odrzucona, fasada musi wywołać wycofanie rezerwacji towaru z magazynu.
* **Oczekiwany rezultat na tablicy (w kodzie używamy tabulacji):**

```typescript
interface OrderRequest {
	orderId: string;
	itemId: string;
	userId: string;
	amount: number;
}

class OrderProcessingFacade {
	private warehouse: WarehouseAPI;
	private payment: PaymentGateway;
	private courier: ShippingAPI;

	constructor() {
		this.warehouse = new WarehouseAPI();
		this.payment = new PaymentGateway();
		this.courier = new ShippingAPI();
	}

	public async processOrder(req: OrderRequest): Promise<{ success: boolean; trackingNumber?: string }> {
		const isReserved = await this.warehouse.reserveStock(req.itemId);
		if (!isReserved) {
			return { success: false };
		}

		const isPaid = await this.payment.charge(req.userId, req.amount);
		if (!isPaid) {
			await this.warehouse.releaseStock(req.itemId);
			return { success: false };
		}

		const trackingNumber = await this.courier.generateWaybill(req.orderId);
		return { success: true, trackingNumber };
	}
}

```

---

## 5. Weryfikacja wiedzy i ocena (Exit Ticket - 5 min)

* **Procedura:** 5 minut przed końcem lekcji nauczyciel prosi o odłożenie markerów i rozdaje każdemu uczniowi kartę **Exit Ticket (Bilet wyjścia)**.
* **Zasady:**
* Uczniowie wypełniają bilet samodzielnie, bez konsultacji i bez korzystania z telefonów.
* Warunkiem opuszczenia sali po dzwonku jest wręczenie wypełnionego biletu nauczycielowi przy drzwiach.


* **Pytania na bilecie:**
1. *Wymień jedno kluczowe zadanie wzorca Fasada w kontekście podsystemów.*
2. *Czy Fasada powinna zawierać skomplikowaną logikę biznesową, czy jedynie orkiestrować wywołania innych klas? Krótko uzasadnij.*
3. *Ocena pewności z tematu (skala 1-5).*



---

---

# MATERIAŁY DLA UCZNIÓW (DOKUMENTACJA DO DRUKU)

> **Informacja dla nauczyciela:**
> Poniższa sekcja zawiera kompletne materiały dydaktyczne przygotowane do bezpośredniego druku na formacie A4. Środowisko wykonawcze nie pozwala na wygenerowanie bezpośredniego, binarnego pliku PDF, dlatego materiały zostały sformatowane w sposób umożliwiający ich natychmiastowe skopiowanie do edytora tekstu (np. LibreOffice Writer, MS Word) i eksport do formatu PDF.
> **Harmonogram i nakład druku:**
> 1. **Wydruk 1 (Karta Analizy Kodu):** Rozdać na początku **Lekcji 2 (Zadanie 1 - Rozgrzewka)**. Przygotować **1 egzemplarz na 2 uczniów (ławkę)**.
> 2. **Wydruk 2 (Karta Zadań Projektowych):** Rozdać przed rozpoczęciem **Zadania 2 i 3 na Lekcji 2**. Przygotować **1 egzemplarz na grupę projektową (lub 1 na ławkę)**.
> 3. **Wydruk 3 (Exit Ticket):** Rozdać dokładnie **5 minut przed zakończeniem Lekcji 2**. Przygotować **1 egzemplarz dla każdego ucznia**.
>
>

[NOWA STRONA PDF]

# KARTA PRACY DLA UCZNIA: AUDYT KODU (WYDRUK 1)

**Klasa:** 4 Technikum Programistyczne

**Kwalifikacja:** INF.04 — Projektowanie, programowanie i testowanie aplikacji

**Temat:** Identyfikacja antywzorca w warstwie kontrolera – droga do Fasady

---

### Instrukcja:

Przeanalizuj poniższy fragment kodu pochodzący z aplikacji backendowej opartej na Node.js i frameworku Express.js. Znajdź wszystkie błędy architektoniczne, wskaż zbyt ciasne powiązania i odpowiedz na pytania kontrolne pod kodem.

```typescript
import { Request, Response } from 'express';
import { Argon2PasswordHasher } from '../security/Argon2PasswordHasher';
import { MariaDbClient } from '../database/MariaDbClient';
import { SendgridEmailNotificationService } from '../notifications/SendgridEmailNotificationService';
import { WinstonFileAuditLogger } from '../logging/WinstonFileAuditLogger';
import { JwtTokenManager } from '../auth/JwtTokenManager';

export class UserController {
	public async registerUser(req: Request, res: Response): Promise<void> {
		try {
			const { email, password, username } = req.body;

			// Podsystem 1: Logowanie audytu
			const logger = new WinstonFileAuditLogger('/var/log/audit.log');
			logger.info(`Starting registration process for: ${email}`);

			// Podsystem 2: Bezpieczeństwo i hashowanie
			const hasher = new Argon2PasswordHasher({ memoryCost: 2048, timeCost: 3 });
			const passwordHash = await hasher.hashPassword(password);

			// Podsystem 3: Baza danych
			const db = new MariaDbClient({ host: 'localhost', database: 'users_db' });
			await db.connect();
			const createdUser = await db.insertUser({
				email: email,
				username: username,
				password: passwordHash,
				createdAt: new Date()
			});

			// Podsystem 4: Autoryzacja i tokeny
			const tokenManager = new JwtTokenManager(process.env.JWT_SECRET || 'fallback_secret');
			const sessionToken = tokenManager.generateRegistrationToken(createdUser.id);

			// Podsystem 5: Notyfikacja e-mail
			const emailer = new SendgridEmailNotificationService(process.env.SENDGRID_API_KEY!);
			await emailer.sendTemplateMail(email, 'WELCOME_TEMPLATE', {
				token: sessionToken,
				user: username
			});

			logger.info(`Registration completed for user ID: ${createdUser.id}`);
			res.status(201).json({ success: true, userId: createdUser.id });

		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}

```

---

### Pytania do analizy (Wypełnij w parze):

1. **Wymień wszystkie klasy podsystemów, od których bezpośrednio zależy `UserController`:**
* 1: ........................................................................................................................................
* 2: ........................................................................................................................................
* 3: ........................................................................................................................................
* 4: ........................................................................................................................................
* 5: ........................................................................................................................................


2. **Jaki problem napotka zespół programistów, jeśli zechce przetestować metodę `registerUser` testem jednostkowym (Unit Test)?**
................................................................................................................................................
................................................................................................................................................
3. **Jak wzorzec Fasada rozwiąże problem wielokrotnego tworzenia instancji tych samych podsystemów w kontrolerze?**
................................................................................................................................................
................................................................................................................................................

[NOWA STRONA PDF]

# KARTA ZADAŃ PROJEKTOWYCH (WYDRUK 2)

**Klasa:** 4 Technikum Programistyczne

**Moduł:** Zaawansowane wzorce projektowe w architekturze systemów

**Zespół / Grupa:** ...................................................................... **Data:** ........................................

---

## Zadanie 2: Projektowanie klasy `RegistrationFacade` (Czas: 15 min)

### Cel:

Zaprojektuj warstwę pośredniczącą, która zredukuje liczbę zależności w kontrolerze do dokładnie jednej klasy: `RegistrationFacade`.

#### Wybierz przydzielony wariant:

* **WARIANT A (Schematyczno-graficzny):**
Rozrysuj na poniższym polu diagram blokowy/UML. Pokaż relację między kontrolerem, fasadą rejestracji oraz podsystemami: `PasswordHasher`, `UserRepository`, `EmailService`. Wskaż modyfikatory dostępu (`+`, `-`) oraz nazwy metod.
* **WARIANT B (Strukturalno-kodowy):**
Napisz w TypeScript implementację klasy `RegistrationFacade`. Fasada powinna ukrywać instancje podsystemów w prywatnych polach i udostępniać publiczną metodę `register(userData: UserDTO)`.

```text
MIEJSCE NA SZKIC ARCHITEKTURY / KOD ZESPOŁU:
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

```

---

## Zadanie 3: Fasada integracyjna – System E-Commerce (Czas: 15 min)

### Kontekst biznesowy:

Tworzycie architekturę dla modułu kasy e-commerce. Kontroler API przyjmuje żądanie `POST /checkout`. Proces wymaga:

1. Rezerwacji towaru w systemie magazynowym (`WarehouseService`).
2. Obciążenia karty w bramce płatności (`PaymentGateway`).
3. Wygenerowania etykiety wysyłkowej (`CourierService`).

### Wyzwanie architektoniczne:

Zaprojektujcie fasadę `OrderCheckoutFacade`. Zadbajcie o to, aby w przypadku braku środków na karcie klienta, system natychmiast zwolnił zarezerwowany wcześniej towar w magazynie!

```text
MIEJSCE NA SCHEMAT PRZEPŁYWU / OBSŁUGĘ TRANSAKCJI INTEGRACYJNEJ:
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

```

[NOWA STRONA PDF]

# BILET WYJŚCIA / EXIT TICKET (WYDRUK 3)

> **Instrukcja dla ucznia:** Wypełnij bilet indywidualnie. Wypełniony formularz jest warunkiem opuszczenia pracowni po zakończeniu zajęć.

---

### BILET WYJŚCIA: Wzorzec Fasada (Facade)

**Imię i nazwisko:** ....................................................................................................

**Klasa:** 4 ............ **Data:** ....................................

---

**Pytanie 1:** Wyjaśnij własnymi słowami, jaki jest główny cel stosowania wzorca projektowego Fasada w architekturze oprogramowania.

................................................................................................................................................

................................................................................................................................................

................................................................................................................................................

---

**Pytanie 2:** Czy klasa Fasady powinna zajmować się skomplikowanymi obliczeniami i logiką biznesową (np. algorytmem haszowania haseł), czy jedynie zarządzać innymi klasami? Krótko uzasadnij dlaczego.

................................................................................................................................................

................................................................................................................................................

................................................................................................................................................

---

**Pytanie 3:** Oceń stopień opanowania dzisiejszego materiału (Zaznacz `X` przy jednej cyfrze):

| 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- |
| Nic nie rozumiem | Znam nazwę, mam trudności | Rozumiem ideę, potrzebuję pomocy w kodzie | Rozumiem i potrafię napisać schemat | Opanowałem w pełni, wytłumaczę innym |

---

## *(Linia cięcia papieru — format A5)*

### BILET WYJŚCIA: Wzorzec Fasada (Facade)

**Imię i nazwisko:** ....................................................................................................

**Klasa:** 4 ............ **Data:** ....................................

---

**Pytanie 1:** Wyjaśnij własnymi słowami, jaki jest główny cel stosowania wzorca projektowego Fasada w architekturze oprogramowania.

................................................................................................................................................

................................................................................................................................................

................................................................................................................................................

---

**Pytanie 2:** Czy klasa Fasady powinna zajmować się skomplikowanymi obliczeniami i logiką biznesową (np. algorytmem haszowania haseł), czy jedynie zarządzać innymi klasami? Krótko uzasadnij dlaczego.

................................................................................................................................................

................................................................................................................................................

................................................................................................................................................

---

**Pytanie 3:** Oceń stopień opanowania dzisiejszego materiału (Zaznacz `X` przy jednej cyfrze):

| 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- |
| Nic nie rozumiem | Znam nazwę, mam trudności | Rozumiem ideę, potrzebuję pomocy w kodzie | Rozumiem i potrafię napisać schemat | Opanowałem w pełni, wytłumaczę innym |
