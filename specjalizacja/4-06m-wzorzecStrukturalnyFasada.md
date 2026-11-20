# Strukturalny wzorzec projektowy: Fasada (Facade)

## Materiał dla ucznia

**Przedmiot:** Programowanie aplikacji · **Poziom:** klasa 4 technikum · **Czas pracy:** 2 × 45 minut

### Cele

Po zajęciach potrafisz:

- wyjaśnić cel wzorca Fasada;
- odróżnić Fasаdę od Adaptera;
- rozpoznać kontroler nadmiernie powiązany z wieloma podsystemami;
- zaprojektować prostą fasadę w TypeScript, która koordynuje pracę usług;
- przedstawić przepływ wywołań między klientem, fasadą i podsystemami.

## 1. Problem: zbyt wiele obowiązków w kontrolerze

Wyobraź sobie sklep internetowy. Klient składa zamówienie jednym przyciskiem, ale sklep musi sprawdzić magazyn, pobrać płatność, zamówić kuriera i zapisać zdarzenie. Klient nie musi sam kontaktować się z każdym działem.

Podobnie powinien działać kontroler aplikacji. Jeśli kontroler rejestracji sam waliduje dane, haszuje hasło, zapisuje użytkownika w bazie, wysyła e-mail, generuje token i zapisuje logi, staje się trudny do testowania i rozwijania. Jest silnie powiązany z wieloma technicznymi szczegółami.

Zmiana biblioteki pocztowej lub bazy może wtedy wymagać modyfikacji kontrolera HTTP. Łatwiej też pomieszać obsługę żądania z organizacją całego procesu.

## 2. Czym jest Fasada?

**Fasada (Facade)** to wzorzec strukturalny, który udostępnia prosty, wspólny punkt wejścia do złożonego podsystemu. Klient wywołuje jedną czytelną metodę, a fasada koordynuje potrzebne podsystemy.

Fasada przede wszystkim **upraszcza dostęp i orkiestruje wywołania**. Nie powinna przejmować wszystkich szczegółowych zadań podsystemów, na przykład implementacji algorytmu haszowania.

```text
             Klient / kontroler
                     |
                     v
             RegistrationFacade
           |    |       |      |
           v    v       v      v
EmailService Hasher Repository AuditLogger
```

Kontroler korzysta z fasady zamiast bezpośrednio zarządzać każdym podsystemem. Fasada nie musi jednak całkowicie blokować dostępu do klas podsystemu — jest wygodnym, uproszczonym interfejsem.

### Fasada a Adapter

| Wzorzec | Główny cel | Typowa relacja |
|---|---|---|
| **Adapter** | Dopasować niezgodny interfejs jednego obiektu do interfejsu oczekiwanego przez klienta. | Jeden interfejs do drugiego |
| **Fasada** | Uprościć korzystanie z wielu klas lub usług przez wspólny interfejs. | Jeden punkt wejścia do wielu podsystemów |

## 3. Przykład w TypeScript

Poniższy przykład pokazuje podział odpowiedzialności. Klasy podsystemów wykonują swoje zadania, a fasada układa je w proces rejestracji.

```typescript
interface RegisterDTO {
	name: string;
	email: string;
	passwordPlain: string;
}

class PasswordHasher {
	public hash(password: string): string {
		// W prawdziwej aplikacji użyj bezpiecznej biblioteki do haszowania.
		return `hash(${password})`;
	}
}

class UserRepository {
	public save(name: string, email: string, passwordHash: string): boolean {
		// Zapis użytkownika w bazie danych.
		return true;
	}
}

class EmailService {
	public sendActivationMail(to: string): void {
		// Wysłanie wiadomości aktywacyjnej.
	}
}

class RegistrationFacade {
	private readonly hasher = new PasswordHasher();
	private readonly userRepository = new UserRepository();
	private readonly emailService = new EmailService();

	public async register(data: RegisterDTO): Promise<boolean> {
		const passwordHash = this.hasher.hash(data.passwordPlain);
		const saved = this.userRepository.save(
			data.name,
			data.email,
			passwordHash
		);

		if (!saved) {
			return false;
		}

		this.emailService.sendActivationMail(data.email);
		return true;
	}
}
```

Przykładowy kontroler może wywołać `registrationFacade.register(data)`, a następnie dopasować odpowiedź HTTP do wyniku. Nie musi znać szczegółów haszowania, zapisu ani wysyłki e-maila.

> **Uwaga:** To przykład edukacyjny. W prawdziwym systemie hasła należy przetwarzać przy użyciu sprawdzonej biblioteki kryptograficznej. Warto też rozważyć wstrzykiwanie zależności przez konstruktor zamiast tworzenia wszystkich usług wewnątrz fasady — ułatwia to testowanie i wymianę implementacji.

### Zalety i ograniczenia

**Zalety:** prostszy interfejs dla klienta, mniejsza liczba jego zależności, ukrycie szczegółów podsystemów oraz czytelniejsza orkiestracja procesu.

**Ograniczenia:** fasada może stać się kolejnym „God Object”, jeśli skupia wiele niezwiązanych procesów. Dodatkowa warstwa oznacza też kolejny element do utrzymania. Fasada nie zastępuje dobrego podziału odpowiedzialności ani testów.

## 4. Ćwiczenie 1 — audyt kontrolera

Pracujcie w parach. W poniższym przykładzie `UserController` tworzy i wywołuje kilka usług bezpośrednio.

```typescript
class UserController {
	public async registerUser(request: any): Promise<void> {
		const logger = new AuditLogger();
		const hasher = new PasswordHasher();
		const database = new UserDatabase();
		const tokenService = new TokenService();
		const emailService = new EmailService();

		logger.log("Rozpoczęcie rejestracji");
		const hash = hasher.hash(request.password);
		const user = await database.create(request.email, hash);
		const token = tokenService.create(user.id);
		await emailService.sendActivation(request.email, token);
	}
}
```

Odpowiedzcie:

1. Wypiszcie pięć podsystemów, od których bezpośrednio zależy kontroler.
2. Jak ta liczba zależności wpływa na testowanie i późniejszą zmianę usług?
3. Które czynności powinien wykonywać kontroler, a które może koordynować fasada?
4. Narysujcie prosty diagram: kontroler → fasada → podsystemy.

## 5. Ćwiczenie 2 — projekt fasady rejestracji

Wybierzcie jeden wariant i pracujcie w zespole. Zapiszcie projekt w zeszycie lub na arkuszu.

### Wariant A: diagram

Narysujcie diagram obejmujący:

- `AuthController`;
- `RegistrationFacade` z publiczną metodą `register(data)`;
- prywatne zależności fasady: `PasswordService`, `UserRepository`, `EmailService`.

Zaznaczcie kierunek wywołań oraz widoczność: `+` oznacza publiczne, `-` — prywatne.

### Wariant B: kod

Napiszcie szkielet `RegistrationFacade` w TypeScript. Użyjcie interfejsu `UserRegistrationData` z polami `email`, `passwordPlain` i `fullName`. Fasada powinna mieć prywatne zależności oraz publiczną metodę `register`, zwracającą `Promise<boolean>`.

Sprawdźcie, czy kontroler potrzebuje bezpośrednio znać każdą usługę.

## 6. Ćwiczenie 3 — fasada procesu zakupowego

Zaprojektujcie `OrderCheckoutFacade`, która koordynuje trzy usługi:

1. `WarehouseService.reserveStock(itemId)` — rezerwuje towar;
2. `PaymentGateway.charge(userId, amount)` — pobiera płatność;
3. `CourierService.generateLabel(orderId)` — tworzy etykietę wysyłkową.

**Warunek:** jeśli rezerwacja się nie powiedzie, proces kończy się niepowodzeniem. Jeśli płatność zostanie odrzucona po rezerwacji, fasada wywołuje `WarehouseService.releaseStock(itemId)`. Etykieta powstaje dopiero po udanej płatności.

Narysujcie diagram albo napiszcie pseudokod/TypeScript. Wskażcie, jaką odpowiedź otrzymuje kontroler.

## 7. Sprawdź swoją wiedzę

1. Jaki problem rozwiązuje wzorzec Fasada?
2. Czym Fasada różni się od Adaptera?
3. Czy fasada wykonuje zadania podsystemów, czy głównie koordynuje ich wywołania?
4. Ile podsystemów powinien znać kontroler po zastosowaniu fasady?
5. Podaj jedno ryzyko wynikające ze źle zaprojektowanej fasady.
