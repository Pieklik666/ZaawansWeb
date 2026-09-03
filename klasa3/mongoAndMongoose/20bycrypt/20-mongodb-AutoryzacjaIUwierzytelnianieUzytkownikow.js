// #region wstęp
/*	Cele lekcji
	Autentykacja i autoryzacja użytkowników w aplikacji Express + MongoDB.
	Implementacja rejestracji, logowania i zabezpieczania endpointów API.
	Użycie tokenów JWT do zarządzania sesjami użytkownika
*/

/*	Co będziesz umieć po tej lekcji?
	- Tworzyć endpoint do rejestracji nowych użytkowników
	- Hashować hasła za pomocą biblioteki 'bcrypt'
	- Implementować logowanie i generowanie tokenów JWT
	- Chronić endpointy API za pomocą middleware'u autoryzacji
	- Zarządzać rolami i uprawnieniami użytkowników
*/
// #endregion


// #region informacje
/*	Ogólne informacje
	W aplikacji wymuszamy logowanie nauczycieli i administratorów,
	aby dostęp do danych szkoły, klas i ocen był kontrolowany.
	Każdy użytkownik ma przypisaną rolę (admin, nauczyciel, uczeń),
	która decyduje o dostępie do zasobów

	Przykłady:
	- 'Autentykacja' (Authentication) - sprawdzenie tożsamości użytkownika
	- 'Autoryzacja' (Authorization) - sprawdzenie uprawnień użytkownika
	- 'Token JWT' (JSON Web Token) - bezpieczny sposób transmisji informacji
	- 'Hashowanie haseł' (Hashing) - bezpieczne przechowywanie haseł
*/

/*	Autentykacja
	To proces polegający na weryfikacji, czy użytkownik jest tym,
	za kogo się wydaje. Polega na podaniu loginu/emaila i hasła.
	Po pomyślnej autentykacji system wydaje token dostępu

	Analogia: Wejście do szkoły - potwierdzenie tożsamości (legitymacja)
*/

/*	Autoryzacja
	To proces sprawdzania, czy uwierzytelniony użytkownik ma prawo
	do wykonania danej akcji lub dostępu do określonego zasobu.
	Zależy od roli użytkownika (admin, nauczyciel, uczeń)

	Analogia: Po wejściu - dostęp do konkretnych pomieszczeń
	(tylko dla nauczycieli)
*/

/*	Token JWT
	Format: 'header.payload.signature'
	- 'Header' - typ tokena i algorytm szyfrowania
	- 'Payload' - dane użytkownika (id, rola, email)
	- 'Signature' - podpis cyfrowy, który weryfikuje autentyczność tokena

	Przykład zdekodowanego tokena:
	{
		"id": "674a1b2c3d4e5f6g7h8i9j0k",
		"email": "nauczyciel@szkola.pl",
		"rola": "nauczyciel",
		"iat": 1705000000,
		"exp": 1705086400
	}

	'iat' - czas wydania tokena (issued at)
	'exp' - czas wygaśnięcia tokena (expiration)
*/

/*	Hashowanie haseł
	Hashowanie monokierunkowe - niemożliwe jest odtworzenie hasła z hasha.
	Każde hasło otrzymuje unikalną 'sól' (dodatkowy ciąg znaków), co chroni
	przed atakami słownikowymi. Hasło jest hashowane przy każdym dostępie.

	Analogia: Hasło jest jak odcisk palca - każdy inny,
	niemożliwe do odtworzenia z wcześniejszych wydruków
*/
// #endregion


// #region przydatne funkcje / składnia
// #region bcrypt - Hashowanie haseł
/*	Opis
	Biblioteka 'bcrypt' służy do bezpiecznego hashowania i weryfikacji haseł.
	Automatycznie dodaje sól do hasła, co czyni je odporne na ataki
*/

/*	Składnia - hashowanie hasła
	const haslo_zahashowane = await bcrypt.hash(haslo, liczba_rund);
	'liczba_rund' - ilość iteracji (zazwyczaj 10)
	Im więcej rund, tym trudniej złamać hasło, ale wolniej się hashuje
*/

/*	Składnia - weryfikacja hasła
	const czy_zgodne = await bcrypt.compare(haslo_zwykłe, haslo_zahashowane);
	Zwraca 'true', jeśli hasła są zgodne, 'false' w przeciwnym razie
*/

/*	Przykład
	import bcrypt from 'bcrypt';

	// Hashowanie hasła (przy rejestracji)
	const haslo_zwykłe = 'MojeHaslo123!';
	const haslo_zahashowane = await bcrypt.hash(haslo_zwykłe, 10);

	// Weryfikacja (przy logowaniu)
	const czy_zgodne = await bcrypt.compare('MojeHaslo123!', haslo_zahashowane);
	// Wynik: true
*/

/*	Zadanie
	Zahashuj hasło 'ZbrojUczeń2024!' za pomocą 10 rund 'bcrypt'.
	Następnie sprawdź, czy hasło 'ZbrojUczeń2024!' zgadza się z hashem.
	Co się stanie, jeśli spróbujesz weryfikować 'ZbrojUczeń2023!'?
*/
// #endregion

// #region JWT - tokeny dostępu
/*	Opis
	JWT (JSON Web Token) to standard do bezpiecznego przesyłania informacji.
	Po autentykacji serwer wydaje token, który klient wysyła z każdym żądaniem
*/

/*	Składnia - signingowanie tokena
	import jwt from 'jsonwebtoken';

	const token = jwt.sign(
		{ payload },
		klucz_tajny,
		{ expiresIn: '24h' }
	);
*/

/*	Składnia - weryfikacja tokena
	const odkodowany = jwt.verify(token, klucz_tajny);
	// Lub w try/catch, jeśli token jest nieważny
*/

/*	Przykład
	const klucz_tajny = 'mojaTajnaZmienna123';

	// Tworzenie tokena (przy logowaniu)
	const token = jwt.sign(
		{
			id_uzytkownika: '674a1b2c3d4e5f6g7h8i9j0k',
			email: 'nauczyciel@szkola.pl',
			rola: 'nauczyciel'
		},
		klucz_tajny,
		{ expiresIn: '24h' }
	);

	// Weryfikacja tokena (przy każdym żądaniu)
	try {
		const odkodowany = jwt.verify(token, klucz_tajny);
		console.log(odkodowany.email); // nauczyciel@szkola.pl
	} catch (blad) {
		console.log('Token nieważny lub wygasł');
	}
*/

/*	Zadanie
	Utwórz token JWT z danymi użytkownika o id '123abc' i roli 'admin'.
	Ustawić czas wygaśnięcia na 1 godzinę.
	Następnie zweryfikuj token i wyodrębnij rolę
*/
// #endregion

// #region middleware - sprawdzanie tokena
/*	Opis
	Middleware sprawdza, czy żądanie zawiera token JWT i czy jest ważny.
	Jeśli token jest OK, żądanie przechodzi dalej.
	Jeśli nie, zwraca błąd 401 (Unauthorized) lub 403 (Forbidden)
*/

/*	Składnia
	const sprawdzToken = (req, res, next) => {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) return res.status(401).json({ blad: 'Brak tokena' });

		try {
			req.uzytkownik = jwt.verify(token, klucz_tajny);
			next();
		} catch {
			return res.status(403).json({ blad: 'Token nieważny' });
		}
	};
*/

/*	Przykład
	app.get('/api/uczniowie', sprawdzToken, (req, res) => {
		console.log(req.uzytkownik.email);
		res.json({ dane: 'Listę uczniów' });
	});

	// Żądanie:
	// GET /api/uczniowie
	// Headers: Authorization: Bearer
	// eyJ0eXAiOiJKV1QiLjsjLCJhbGciOiJIUzI1NiJ9...
*/

/*	Zadanie
	Napisz middleware 'sprawdzToken', który oprócz weryfikacji tokena
	sprawdza również, czy user ma rolę 'nauczyciel',
	a jeśli nie - zwraca błąd 403
*/
// #endregion
// #endregion


// #region przykłady
// #region Przykład 1 - Rejestracja użytkownika
/*	Opis
	Endpoint 'POST' do rejestracji nowego nauczyciela.
	Sprawdza, czy email już istnieje, hashuje hasło,
	i zapisuje użytkownika do bazy MongoDB
*/

/*	Przykład
	const app = express();
	const baza_url = 'mongodb://localhost:27017';

	app.use(express.json());

	app.post('/api/rejestracja', async (req, res) => {
		const klient = new MongoClient(baza_url);
		try {
			const { email, haslo, imie, nazwisko, rola } = req.body;

			if (!email || !haslo || !imie || !nazwisko) {
				return res.status(400).json({
					blad: 'Brak wymaganych pól'
				});
			}

			await klient.connect();
			const baza = klient.db('szkola');
			const uzytkownicy = baza.collection('uzytkownicy');

			const istniejacy = await uzytkownicy.findOne({ email });
			if (istniejacy) {
				return res.status(409).json({
					blad: 'Email już zarejestrowany'
				});
			}

			const haslo_zahashowane = await bcrypt.hash(haslo, 10);

			const wynik = await uzytkownicy.insertOne({
				email,
				haslo: haslo_zahashowane,
				imie,
				nazwisko,
				rola: rola || 'nauczyciel',
				data_rejestracji: new Date()
			});

			res.status(201).json({
				wiadomosc: 'Konto utworzone pomyślnie',
				id_uzytkownika: wynik.insertedId
			});

		} catch (blad) {
			console.error(blad);
			res.status(500).json({ blad: 'Błąd rejestracji' });
		} finally {
			await klient.close();
		}
	});

	// Testowanie:
	// POST /api/rejestracja
	// Body: {
	//   "email": "anna.nowak@szkola.pl",
	//   "haslo": "BezpieczneHaslo123!",
	//   "imie": "Anna",
	//   "nazwisko": "Nowak",
	//   "rola": "nauczyciel"
	// }

	// Wynik: {
	//   "wiadomosc": "Konto utworzone pomyślnie",
	//   "id_uzytkownika": ...
	// }
*/

/*	Zadanie
	Rozszerz endpoint rejestracji o sprawdzenie, czy długość hasła to co
	najmniej 8 znaków. Jeśli hasło jest za krótkie, zwróć błąd 400
*/
// #endregion

// #region Przykład 2 - Logowanie i wydawanie tokena
/*	Opis
	Endpoint 'POST' do logowania. Sprawdza email i hasło, a następnie wysyła
	token JWT na 24 godziny
*/

/*	Przykład
	const klucz_tajny = process.env.JWT_SECRET || 'tajne_slowo_123';

	app.post('/api/logowanie', async (req, res) => {
		const klient = new MongoClient(baza_url);
		try {
			const { email, haslo } = req.body;

			if (!email || !haslo) {
				return res.status(400).json({
					blad: 'Email i hasło są wymagane'
				});
			}

			await klient.connect();
			const baza = klient.db('szkola');
			const uzytkownicy = baza.collection('uzytkownicy');

			const uzytkownik = await uzytkownicy.findOne({ email });
			if (!uzytkownik) {
				return res.status(401).json({
					blad: 'Email lub hasło nieprawidłowe'
				});
			}

			const haslo_ok = await bcrypt.compare(haslo,
				uzytkownik.haslo);
			if (!haslo_ok) {
				return res.status(401).json({
					blad: 'Email lub hasło nieprawidłowe'
				});
			}

			const token = jwt.sign(
				{
					id: uzytkownik._id,
					email: uzytkownik.email,
					rola: uzytkownik.rola,
					imie: uzytkownik.imie
				},
				klucz_tajny,
				{ expiresIn: '24h' }
			);

			res.json({
				wiadomosc: 'Zalogowanie pomyślne',
				token,
				uzytkownik: {
					id: uzytkownik._id,
					email: uzytkownik.email,
					imie: uzytkownik.imie,
					rola: uzytkownik.rola
				}
			});

		} catch (blad) {
			console.error(blad);
			res.status(500).json({ blad: 'Błąd logowania' });
		} finally {
			await klient.close();
		}
	});

	// Testowanie:
	// POST /api/logowanie
	// Body: {
	//   "email": "anna.nowak@szkola.pl",
	//   "haslo": "BezpieczneHaslo123!"
	// }

	// Wynik: {
	//   "wiadomosc": "Zalogowanie pomyślne",
	//   "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
	//   "uzytkownik": { ... }
	// }
*/

/*	Zadanie
	Dodaj funkcję, która będzie rejestrować każde logowanie
	w kolekcji 'historia_logowania' z polami: email, czas, ip_adresu
*/
// #endregion

// #region Przykład 3 - Middleware autoryzacji
/*	Opis
	Middleware sprawdza, czy żądanie zawiera token JWT.
	Jeśli nie, zwraca błąd 401. Jeśli token jest nieważny, zwraca 403.
	W przypadku sukcesu dodaje do 'req.uzytkownik' dane z tokena
*/

/*	Przykład
	const sprawdzToken = (req, res, next) => {
		const naglowek_auth = req.headers.authorization;
		if (!naglowek_auth ||
			!naglowek_auth.startsWith('Bearer ')) {
			return res.status(401).json({
				blad: 'Brak tokena w nagłówku Authorization'
			});
		}

		const token = naglowek_auth.split(' ')[1];

		try {
			req.uzytkownik = jwt.verify(token, klucz_tajny);
			next();
		} catch (blad) {
			if (blad.name === 'TokenExpiredError') {
				return res.status(403).json({
					blad: 'Token wygasł'
				});
			}
			return res.status(403).json({
				blad: 'Token nieważny'
			});
		}
	};

	app.get('/api/profil', sprawdzToken, (req, res) => {
		res.json({
			wiadomosc: 'Twój profil',
			uzytkownik: req.uzytkownik
		});
	});

	// Testowanie:
	// GET /api/profil
	// Headers: Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

	// Wynik: { "wiadomosc": "Twój profil", "uzytkownik": {...} }
*/

/*	Zadanie
	Rozszerz middleware 'sprawdzToken' o sprawdzenie konkretnej roli.
	Utwórz funkcję 'sprawdzToken(role)', której parametrami
	będą dozwolone role, np. ['admin', 'nauczyciel']
*/
// #endregion

// #region Przykład 4 - Endpoint chroniony - Edycja profilu
/*	Opis
	Endpoint 'PUT' do edycji profilu użytkownika.
	Chroniony middleware'em - dostęp tylko dla zalogowanych.
	Użytkownik może edytować tylko swoje dane
*/

/*	Przykład
	app.put('/api/profil/:id', sprawdzToken, async (req, res) => {
		const klient = new MongoClient(baza_url);
		try {
			const { id } = req.params;
			const { imie, nazwisko, nowe_haslo } = req.body;

			if (req.uzytkownik.id !== id) {
				return res.status(403).json({
					blad: 'Nie możesz edytować cudzego profilu'
				});
			}

			await klient.connect();
			const baza = klient.db('szkola');
			const uzytkownicy = baza.collection('uzytkownicy');

			const dane_do_update = {};
			if (imie) dane_do_update.imie = imie;
			if (nazwisko) dane_do_update.nazwisko = nazwisko;

			if (nowe_haslo) {
				dane_do_update.haslo = await bcrypt.hash(
					nowe_haslo, 10);
			}

			const wynik = await uzytkownicy.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: dane_do_update }
			);

			if (wynik.matchedCount === 0) {
				return res.status(404).json({
					blad: 'Użytkownik nie znaleziony'
				});
			}

			res.json({
				wiadomosc: 'Profil zaktualizowany',
				uzytkownik: {
					id,
					email: email,
					imie: imie,
					nazwisko: nazwisko
				}
			});

		} catch (blad) {
			console.error(blad);
			res.status(500).json({
				blad: 'Błąd aktualizacji profilu'
			});
		} finally {
			await klient.close();
		}
	});

	// Testowanie:
	// PUT /api/profil/674a1b2c3d4e5f6g7h
	// Headers: Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
	// Body: {
	//   "imie": "Ania",
	//   "nowe_haslo": "NoweHaslo456!"
	// }

	// Wynik: {
	//   "wiadomosc": "Profil zaktualizowany",
	//   "uzytkownik": {...}
	// }
*/

/*	Zadanie
	Dodaj możliwość zmiany emaila w endpoint'cie 'PUT /api/profil/:id'.
	Upewnij się, że nowy email nie jest już używany
	przez innego użytkownika
*/
// #endregion
// #endregion


// #region zadania
/*	Informacje do zadań
	Aby dostać 4, należy rozwiązać również zadania na 3.
	Analogicznie dla oceny 5 i 6.
	Odpowiedzi do zadań proszę zapisać w formacie:
		'zadanie-X.js' (X to numer zadania np. 'zadanie-1.js')
	Katalog zapisu zadania:
		'W:\numerKlasy\przedmiot\data-nazwaPlikuBezRozszerzenia\
		NazwiskoImie\'
		np. 'W:\1a\node-mongodb\20260120-20-mongodbAutoryzacja\
		JanKowalski\zadanie-1.js'
	Nie wrzucaj katalogu 'node_modules' ani innych zbędnych
	(zwłaszcza dużych) katalogów, tylko same pliki z rozwiązaniami
*/

/*	[ŁATWE - ocena 3] Hashowanie i weryfikacja hasła
	Utwórz program, który:
	1. Hashuje hasło 'UczenMalysz2024!' za pomocą 'bcrypt' (10 rund)
	2. Wypisuje zahashowane hasło
	3. Weryfikuje, czy hasło 'UczenMalysz2024!' zgadza się z hashem
	4. Weryfikuje, czy hasło 'UczenMalysz2023!' zgadza się z hashem

	Wynik powinien wyglądać tak:
	Zahashowane hasło: $2b$10$...
	Hasło się zgadza: true
	Hasło się zgadza: false
*/

/*	[ŚREDNIE - ocena 4] Endpoint rejestracji z walidacją
	Utwórz endpoint 'POST /api/rejestracja', który:
	1. Sprawdza, czy podane są email, hasło, imię, nazwisko
	2. Sprawdza, czy hasło ma co najmniej 8 znaków
	3. Sprawdza, czy hasło zawiera co najmniej jedną cyfrę
	4. Sprawdza, czy email już istnieje w bazie
	5. Hashuje hasło i zapisuje użytkownika
	6. Zwraca odpowiedni kod HTTP i wiadomość

	Testy:
	- Brak pola email -> 400
	- Hasło 'abc123' -> 400 (za krótkie)
	- Hasło 'abcdefgh' -> 400 (brak cyfry)
	- Email już istnieje -> 409
	- Poprawne dane -> 201 z id nowego użytkownika
*/

/*	[TRUDNE - ocena 5] Middleware autoryzacji z rolami
	Utwórz middleware 'sprawdzToken(role)', który:
	1. Sprawdza obecność i ważność tokena JWT
	2. Sprawdza, czy rola użytkownika jest w tablicy 'role'
		(np. ['admin', 'nauczyciel'])
	3. Zwraca 401, jeśli brak tokena
	4. Zwraca 403, jeśli token jest nieważny lub wygasł
	5. Zwraca 403, jeśli rola nie jest dozwolona
	6. Dodaje do 'req.uzytkownik' dane z tokena, jeśli wszystko OK

	Użycie:
	app.get('/api/raporty',
		sprawdzToken(['admin', 'nauczyciel']), handlerRaportow);
	app.post('/api/uczniowie', sprawdzToken(['admin']),
		handlerDodajUcznia);
*/

/*	[EXPERT - ocena 6] Pełny system autoryzacji
	Utwórz trzy endpointy:
	1. 'POST /api/rejestracja' - rejestracja z walidacją
		(jak w zadaniu na 4)
	2. 'POST /api/logowanie' - logowanie, wydawanie tokena JWT
	3. 'PUT /api/profil/:id' - edycja profilu
		(chroniony middleware'em)

	Wymagania:
	- Walidacja wszystkich pól
	- Hashowanie haseł 'bcrypt'em
	- Tokeny JWT z czasem wygaśnięcia 24h
	- Middleware 'sprawdzToken' chroni edycję profilu
	- Użytkownik może edytować tylko swoje dane
	- Zwracanie odpowiednich kodów HTTP
	- Wszystkie pola kontekstu szkolnego (imię, nazwisko,
	rola: ucznia/nauczyciel/admin)

	Testy całego flow'u:
	1. Rejestracja nowego nauczyciela
	2. Logowanie (powinna zwrócić token)
	3. Edycja profilu za pomocą tokena
	4. Próba edycji cudzego profilu (powinna zwrócić 403)
*/
// #endregion


// #region podsumowanie
/*	Kluczowe pojęcia z lekcji
	- 'Autentykacja' - weryfikacja tożsamości użytkownika
		(np. sprawdzenie loginu i hasła)
	- 'Autoryzacja' - sprawdzenie uprawnień użytkownika
		do wykonania akcji (np. rola admin/nauczyciel)
	- 'Tokenizacja' - wydawanie bezpiecznego tokena
		zamiast przechowywania danych logowania
	- 'Hashowanie' - jednokierunkowe szyfrowanie, niemożliwe
		do odwrócenia (np. bcrypt)
	- 'JWT' - standard do transmisji danych zawierający
		podpis cyfrowy
	- 'Middleware' - funkcja pośrednia w Express,
		która przetwarza żądania
	- 'Rola' - przypisana uprawnień (admin, nauczyciel, uczeń)
	- 'Token wygaśnięcia' - ograniczenie czasu ważności tokena
*/

/*	Najważniejsze wnioski
	- Autentykacja to weryfikacja tożsamości, autoryzacja to weryfikacja uprawnień
	- Hasła nigdy nie przechowujemy w czystej postaci, tylko zahashowane
	- 'bcrypt' automatycznie dodaje sól, co chroni przed atakami słownikowymi
	- Tokeny JWT zawierają dane użytkownika i podpis cyfrowy
	- Middleware'y chronią endpointy - każde żądanie jest weryfikowane
	- Role (admin, nauczyciel, uczeń) decydują o dostępie do określonych zasobów
	- Token powinien zawierać czas wygaśnięcia (exp) dla bezpieczeństwa
	- Nigdy nie wysyłaj hasła w odpowiedzi API - wysyłaj token
*/

/*	Najczęściej popełniane błędy
	- Przechowywanie haseł w czystej postaci (bez hash'a)
	- Brak walidacji danych wejściowych (np. słabe hasła)
	- Niewłaściwe zarządzanie tokenami (brak wygaśnięcia, brak tajnego klucza)
	- Brak zabezpieczeń endpointów (brak middleware'u)
	- Umożliwienie edycji cudzego profilu
	- Niewłaściwe kody HTTP (np. 200 zamiast 401/403)
	- Brak obsługi błędów (try/catch) przy weryfikacji tokena
	- Niewłaściwe przechowywanie tajnego klucza (np. w kodzie źródłowym)
	- Brak logowania prób logowania i innych ważnych akcji
*/

/*	Dobre praktyki
	- Używaj silnych haseł i wymuszaj ich złożoność
	- Hashuj hasła za pomocą 'bcrypt' z odpowiednią liczbą rund
	- Używaj JWT do zarządzania sesjami, ale pamiętaj o tajnym kluczu i
		czasie wygaśnięcia
	- Stosuj middleware do ochrony endpointów i weryfikacji tokenów
	- Implementuj role i uprawnienia, aby kontrolować dostęp do zasobów
	- Loguj ważne akcje użytkowników (logowania, zmiany profilu)
	- Regularnie aktualizuj biblioteki i monitoruj bezpieczeństwo aplikacji
*/

/*	Co dalej?
	- Implementacja 'refresh tokenów' (odświeżanie dostępu bez logowania)
	- Uwierzytelnianie dwuskładnikowe (2FA) - dodatkowa warstwa bezpieczeństwa
	- OAuth 2.0 i logowanie przez Google/Microsoft
	- Zarządzanie uprawnieniami (Role-Based Access Control - RBAC)
	- Audyt - logowanie wszystkich akcji użytkowników
	- Rate limiting - ograniczenie liczby prób logowania
	- Szyfrowanie poufnych danych w bazie (GDPR, RODO)
*/
// #endregion
