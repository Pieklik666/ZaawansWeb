// #region wstęp
/*	Cele lekcji
	Zapoznanie się z podstawami REST API i MongoDB w kontekście
	Node.js + Express. Zrozumienie koncepcji endpointów, metod HTTP,
	operacji CRUD i dokumentów MongoDB. Lekcja przygotowuje do budowy
	backendu dla systemu zarządzania szkołami.
*/

/*	Co będziesz umieć po tej lekcji?
	- Wyjaśnić czym jest REST API i jego architektura
	- Zrozumieć mapowanie operacji CRUD na metody HTTP
	- Pracować z dokumentami MongoDB i Mongoose
	- Tworzyć proste endpointy GET, POST, PUT, DELETE
	- Obsługiwać błędy w API
	- Testować API za pomocą narzędzi
*/
// #endregion


// #region informacje
/*	Ogólne informacje
	REST API (Representational State Transfer) to architektura do
	komunikacji między klientem a serwerem. W Node.js + Express
	budujemy backend, który udostępnia dane przez HTTP. MongoDB
	przechowuje dane w postaci dokumentów JSON, co świetnie integruje
	się z JavaScriptem.

	Analogia SQL    MongoDB:
	- Tabela        Kolekcja
	- Rekord        Dokument
	- Kolumna       Pole
	- PRIMARY KEY   _id (ObjectId)
	- INSERT        create() lub new Model()
	- SELECT        find() lub findById()
	- UPDATE        updateOne() lub findByIdAndUpdate()
	- DELETE        deleteOne() lub findByIdAndDelete()
	- JOIN          populate() lub aggregation pipeline
*/

/*	REST API i metody HTTP
	REST API wykorzystuje metody HTTP do wykonywania operacji:
	- GET - pobranie danych (SELECT w SQL)
	- POST - dodanie nowych danych (INSERT w SQL)
	- PUT - aktualizacja całego obiektu (UPDATE w SQL)
	- DELETE - usunięcie danych (DELETE w SQL)

	Każdy endpoint odpowiada zasobowi, np.:
	GET /api/uczniowie - pobierz wszystkich uczniów
	GET /api/uczniowie/1 - pobierz ucznia o ID 1
	POST /api/uczniowie - dodaj nowego ucznia
	PUT /api/uczniowie/1 - zaktualizuj ucznia o ID 1
	DELETE /api/uczniowie/1 - usuń ucznia o ID 1
*/

/*	MongoDB i Mongoose
	MongoDB przechowuje dane w kolekcjach, a dane w postaci
	dokumentów (obiektów JSON). Mongoose to biblioteka do obsługi
	MongoDB w Node.js, która pozwala na zdefiniowanie schematów.

	Schemat definiuje strukturę dokumentu, np. uczeń ma imię, nazwisko,
	rok urodzenia. Mongoose sprawdza, czy dane spełniają schemat przed
	zapisaniem do bazy.
*/

/*	Dokumenty i kolekcje
	Dokument to pojedynczy rekord w MongoDB, zapisany w formacie JSON.
	Kolekcja to tabela w SQL - grupa dokumentów tego samego typu.

	Przykład dokumentu ucznia:
	{
		_id: ObjectId("..."),
		imie: "Jan",
		nazwisko: "Kowalski",
		rokUrodzenia: 2008,
		klasa: "1a"
	}
*/

/*	Statusy HTTP
	Każda odpowiedź API ma kod statusu, który informuje o wyniku:
	- 200 OK - zapytanie udane
	- 201 Created - zasób został stworzony
	- 204 No Content - zapytanie udane, brak zawartości
	- 400 Bad Request - błęd w zapytaniu
	- 404 Not Found - zasób nie znaleziony
	- 500 Internal Server Error - błąd serwera
*/
// #endregion


// #region przydatne funkcje
// #region Express middleware i routing
/*	Opis
	Middleware to funkcje, które przetwarzają zapytania. Routing
	definiuje, jakie funkcje wykonać dla danego endpointu.
*/

/*	Składnia
	app.get(sciezka, funkcjaHandler)
	app.post(sciezka, funkcjaHandler)
	app.put(sciezka, funkcjaHandler)
	app.delete(sciezka, funkcjaHandler)

	Funkcja handler przyjmuje (req, res), gdzie:
	- req to zapytanie klienta
	- res to odpowiedź do klienta
*/

/*	Przykład:
	const app = express();

	// GET /api/uczniowie - pobierz wszystkich uczniów
	app.get('/api/uczniowie', (req, res) => {
		// Tutaj będzie logika pobierania uczniów z bazy
		res.status(200).json({ wiadomosc: 'Lista uczniów' });
	});

	// Wynik: gdy przejdę na http://localhost:3000/api/uczniowie
	// Klient dostanie JSON z wiadomością
*/

/*	Zadanie:
	Stwórz endpoint GET /api/szkoły, który zwraca JSON z wiadomością
	"Lista szkół". Użyj statusu 200.
*/
// #endregion

// #region Mongoose i schemat
/*	Opis
	Mongoose pozwala na zdefiniowanie schematu dokumentu w MongoDB.
	Schema definiuje pola, ich typy i validację.
*/

/*	Składnia
	const schemaUcznia = new mongoose.Schema({
		imie: { type: String, required: true },
		nazwisko: { type: String, required: true },
		rokUrodzenia: { type: Number, required: true }
	});

	const Uczen = mongoose.model('Uczen', schemaUcznia);
*/

/*	Przykład:
	const schemaUcznia = new mongoose.Schema({
		imie: String,
		nazwisko: String,
		klasa: String
	});

	const Uczen = mongoose.model('Uczen', schemaUcznia);

	// Wynik: Model Uczen jest gotowy do użycia
*/

/*	Zadanie:
	Stwórz schemat dla szkoły z polami: nazwa, adres, kierownik.
	Wszystkie pola mają być obowiązkowe.
*/
// #endregion

// #region Mongoose find() - SELECT
/*	Opis
	find() to metoda do pobierania dokumentów z bazy MongoDB.
	Odpowiada SELECT w SQL.
*/

/*	Składnia
	await Model.find();			// Wszystkie dokumenty
	await Model.find({fil: war});	// Dokumenty spełniające warunek
	await Model.findById(id);		// Dokument o danym ID
	await Model.findOne({fil: war});// Pierwszy pasujący dokument
*/

/*	Przykład:
	const schemaUcznia = new mongoose.Schema({
		imie: String,
		klasa: String
	});
	const Uczen = mongoose.model('Uczen', schemaUcznia);

	// Pobierz wszystkich uczniów
	const wszyscyUczniowie = await Uczen.find();
	// Wynik: tablica wszystkich dokumentów

	// Pobierz uczniów z klasy 1a
	const uczniowieLas1a = await Uczen.find({ klasa: '1a' });
	// Wynik: tablica uczniów z klasy 1a

	// Pobierz ucznia o ID
	const uczen = await Uczen.findById('123abc');
	// Wynik: jeden dokument lub null jeśli nie znaleziono
*/

/*	Zadanie:
	Napisz kod, który pobiera wszystkie szkoły z bazy MongoDB
	o kierowniku "Jan Kowalski".
*/
// #endregion

// #region Mongoose create() / new - INSERT
/*	Opis
	create() lub new Model() dodają nowy dokument do MongoDB.
	Odpowiada INSERT w SQL.
*/

/*	Składnia
	await Model.create({pole1: war1, pole2: war2});
	lub
	const nowyDokument = new Model({...});
	await nowyDokument.save();
*/

/*	Przykład:
	// Metoda 1: create()
	const nowyUczen = await Uczen.create({
		imie: 'Anna',
		nazwisko: 'Nowak',
		klasa: '1a'
	});
	// Wynik: nowy dokument z automatycznym _id

	// Metoda 2: new + save()
	const uczen2 = new Uczen({
		imie: 'Piotr',
		nazwisko: 'Lewandowski',
		klasa: '2b'
	});
	await uczen2.save();
	// Wynik: nowy dokument zapisany w bazie
*/

/*	Zadanie:
	Dodaj nową szkołę do bazy z nazwa "Liceum nr 1",
	adres "ul. Piękna 10" i kierownik "Maria Szymańska".
*/
// #endregion

// #region Mongoose findByIdAndUpdate() - UPDATE
/*	Opis
	findByIdAndUpdate() aktualizuje dokument po ID.
	Odpowiada UPDATE w SQL.
*/

/*	Składnia
	await Model.findByIdAndUpdate(
		id,
		{ pole: nowaWartosc },
		{ new: true }
	);

	Opcja { new: true } zwraca zaktualizowany dokument.
*/

/*	Przykład:
	// Zaktualizuj ucznia o ID
	const zaktualizowanyUczen = await Uczen.findByIdAndUpdate(
		'123abc',
		{ klasa: '2a' },
		{ new: true }
	);
	// Wynik: dokument ze zmienioną klasą

	// Aktualizuj kilka pól jednocześnie
	const zaktualizowanyUczen2 = await Uczen.findByIdAndUpdate(
		'456def',
		{ imie: 'Krzysztof', klasa: '3b' },
		{ new: true }
	);
	// Wynik: dokument ze zmienionymi oboma polami
*/

/*	Zadanie:
	Zaktualizuj szkołę o ID "789ghi", zmieniając kierownika na
	"Paweł Dąbrowski". Użyj findByIdAndUpdate().
*/
// #endregion

// #region Mongoose findByIdAndDelete() - DELETE
/*	Opis
	findByIdAndDelete() usuwa dokument po ID.
	Odpowiada DELETE w SQL.
*/

/*	Składnia
	await Model.findByIdAndDelete(id);
	lub
	await Model.deleteOne({ _id: id });
*/

/*	Przykład:
	// Usuń ucznia o ID
	const usuniety = await Uczen.findByIdAndDelete('123abc');
	// Wynik: null jeśli ID nie istnieje

	// Usuń ucznia po warunku
	const usuniety2 = await Uczen.deleteOne({ klasa: '1a' });
	// Wynik: { deletedCount: 1 } - liczba usuniętych dokumentów
*/

/*	Zadanie:
	Usuń szkołę o ID "999xyz" z bazy MongoDB.
	Użyj findByIdAndDelete().
*/
// #endregion

// #region res.json() i res.status()
/*	Opis
	res.json() wysyła odpowiedź w formacie JSON.
	res.status() ustawia kod statusu HTTP odpowiedzi.
*/

/*	Składnia
	res.json({ klucz: wartosc });
	res.status(kodStatusu).json({ klucz: wartosc });
*/

/*	Przykład:
	app.get('/api/uczniowie', async (req, res) => {
		const uczniowie = await Uczen.find();
		res.status(200).json(uczniowie);
		// Wynik: klient dostaje JSON z listą uczniów i status 200
	});

	app.post('/api/uczniowie', async (req, res) => {
		try {
			const nowyUczen = await Uczen.create(req.body);
			res.status(201).json(nowyUczen);
			// Wynik: nowy uczeń i status 201 Created
		} catch (blad) {
			res.status(400).json({ blad: blad.message });
		}
	});
*/

/*	Zadanie:
	Stwórz endpoint POST /api/szkoły, który dodaje nową szkołę.
	Zwróć nową szkołę z statusem 201 i obsługę błędów z statusem 400.
*/
// #endregion
// #endregion


// #region przykłady
// #region Przykład 1: Endpoint GET - Pobieranie wszystkich uczniów
/*	Opis
	Pierwsza część API to endpointy do odczytu danych.
	Endpoint GET /api/uczniowie zwraca tablicę wszystkich uczniów z bazy MongoDB.
*/

/*	Przykład:
	const app = express();

	// Połączenie z MongoDB
	await mongoose.connect('mongodb://localhost:27017/szkola');

	// Schemat i model
	const schemaUcznia = new mongoose.Schema({
		imie: String,
		nazwisko: String,
		klasa: String
	});
	const Uczen = mongoose.model('Uczen', schemaUcznia);

	// Endpoint GET - pobierz wszystkich uczniów
	app.get('/api/uczniowie', async (req, res) => {
		try {
			const uczniowie = await Uczen.find();
			res.status(200).json(uczniowie);
		} catch (blad) {
			res.status(500).json({ blad: 'Błąd serwera' });
		}
	});

	app.listen(3000, () => {
		console.log('Serwer działa na porcie 3000');
	});

	// Wynik: GET http://localhost:3000/api/uczniowie zwraca
	// [
	//   { _id: '...', imie: 'Jan', nazwisko: 'Kowalski', klasa: '1a' },
	//   { _id: '...', imie: 'Anna', nazwisko: 'Nowak', klasa: '1a' }
	// ]
*/

/*	Zadanie:
	Stwórz endpoint GET /api/uczniowie/:id, który pobiera ucznia
	o danym ID. Jeśli uczeń nie istnieje, zwróć status 404.
*/
// #endregion

// #region Przykład 2: Endpoint POST - Dodawanie nowego ucznia
/*	Opis
	Endpoint POST /api/uczniowie dodaje nowego ucznia do bazy.
	Klient wysyła dane w req.body, a serwer je waliduje i zapisuje.
*/

/*	Przykład:
	const app = express();
	app.use(express.json()); // Middleware do parsowania JSON

	// Schemat i model (jak wyżej)
	const schemaUcznia = new mongoose.Schema({
		imie: { type: String, required: true },
		nazwisko: { type: String, required: true },
		klasa: { type: String, required: true }
	});
	const Uczen = mongoose.model('Uczen', schemaUcznia);

	// Endpoint POST - dodaj nowego ucznia
	app.post('/api/uczniowie', async (req, res) => {
		try {
			// req.body zawiera: { imie, nazwisko, klasa }
			const nowyUczen = await Uczen.create(req.body);
			res.status(201).json(nowyUczen);
		} catch (blad) {
			res.status(400).json({ blad: blad.message });
		}
	});

	// Wynik: POST http://localhost:3000/api/uczniowie
	// Ciało zapytania: { "imie": "Maria", "nazwisko": "Lewandowska",
	// "klasa": "2b" }
	// Odpowiedź (status 201):
	// { _id: '...', imie: 'Maria', nazwisko: 'Lewandowska', klasa: '2b' }
*/

/*	Zadanie:
	Stwórz endpoint POST /api/uczniowie z walidacją:
	- imie musi być ciągiem znaków
	- nazwisko musi być ciągiem znaków
	- klasa musi być jedną z: 1a, 1b, 2a, 2b
	Jeśli walidacja nie przejdzie, zwróć status 400 z opisem błędu.
*/
// #endregion

// #region Przykład 3: Endpoint PUT - Aktualizowanie ucznia
/*	Opis
	Endpoint PUT /api/uczniowie/:id aktualizuje dane ucznia
	o danym ID. Komponenty URL (parametry) pobieramy z req.params.
*/

/*	Przykład:
	// Endpoint PUT - zaktualizuj ucznia
	app.put('/api/uczniowie/:id', async (req, res) => {
		try {
			const id = req.params.id;
			const zaktualizowanyUczen = await Uczen.findByIdAndUpdate(
				id,
				req.body,
				{ new: true }
			);
			if (!zaktualizowanyUczen) {
				return res.status(404).json({ blad: 'Uczeń nie znaleziony' });
			}
			res.status(200).json(zaktualizowanyUczen);
		} catch (blad) {
			res.status(400).json({ blad: blad.message });
		}
	});

	// Wynik: PUT http://localhost:3000/api/uczniowie/123abc
	// Ciało zapytania: { "klasa": "3a" }
	// Odpowiedź (status 200):
	// { _id: '123abc', imie: 'Jan', nazwisko: 'Kowalski', klasa: '3a' }

	// Wynik: PUT z ID, które nie istnieje
	// Odpowiedź (status 404):
	// { blad: 'Uczeń nie znaleziony' }
*/

/*	Zadanie:
	Stwórz endpoint PUT /api/uczniowie/:id, który aktualizuje ucznia. Waliduj
	dane tak samo jak w POST. Jeśli uczeń nie istnieje, zwróć status 404.
*/
// #endregion

// #region Przykład 4: Endpoint DELETE - Usuwanie ucznia
/*	Opis
	Endpoint DELETE /api/uczniowie/:id usuwa ucznia o danym ID
	z bazy. Sprawdzamy, czy rekord istniał.
*/

/*	Przykład:
	// Endpoint DELETE - usuń ucznia
	app.delete('/api/uczniowie/:id', async (req, res) => {
		try {
			const id = req.params.id;
			const usuniety = await Uczen.findByIdAndDelete(id);
			if (!usuniety) {
				return res.status(404).json({ blad: 'Uczeń nie znaleziony' });
			}
			res.status(200).json(
				{ wiadomosc: 'Uczeń usunięty' }
			);
		} catch (blad) {
			res.status(500).json({ blad: blad.message });
		}
	});

	// Wynik: DELETE http://localhost:3000/api/uczniowie/123abc
	// Odpowiedź (status 200):
	// { wiadomosc: 'Uczeń usunięty' }

	// Wynik: DELETE z ID, które nie istnieje
	// Odpowiedź (status 404):
	// { blad: 'Uczeń nie znaleziony' }
*/

/*	Zadanie:
	Stwórz endpoint DELETE /api/uczniowie/:id, który usuwa ucznia.
	Zwróć odpowiednią wiadomość. Obsługuj scenariusz, gdy uczeń
	nie istnieje.
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
		'W:\numerKlasy\przedmiot\data-nazwaPlikuBezRozszerzenia\NazwiskoImie\'
		np. 'W:\2b\nodejs\20260101-mongodbRestApiWprowadzenie\KowalskiJan\zadanie-1.js'

	Nie wrzucaj katalogu 'node_modules' ani innych zbędnych katalogów
*/

/*	[ŁATWE - ocena 3] Podstawowe endpointy CRUD dla nauczycieli
	Stwórz schemat Mongoose dla nauczycieli z polami:
	imie, nazwisko, przedmiot. Implementuj 4 endpointy:
	- GET /api/nauczyciele - zwróć wszystkich nauczycieli
	- GET /api/nauczyciele/:id - zwróć nauczyciela po ID
	- POST /api/nauczyciele - dodaj nowego nauczyciela
	- DELETE /api/nauczyciele/:id - usuń nauczyciela

	Wszystkie endpointy obsługuj błędy. Zwróć odpowiednie statusy HTTP.
*/

/*	[ŚREDNIE - ocena 4] Endpointy dla sal lekcyjnych z filtrowaniem
	Stwórz schemat dla sal lekcyjnych z polami: numer, poziom,
	pojemnosc (liczba osób), typSali (laboratorium, komputerowa,
	tradycyjna).

	Implementuj endpointy:
	- GET /api/sale - zwróć wszystkie sale
	- GET /api/sale?typSali=laboratorium - filtrowanie po typie
	- GET /api/sale/:id - zwróć salę po ID
	- POST /api/sale - dodaj nową salę z walidacją
	- PUT /api/sale/:id - zaktualizuj salę
	- DELETE /api/sale/:id - usuń salę

	Walidacja: pojemnosc > 0, typSali tylko z listy dozwolonych.
*/

/*	[TRUDNE - ocena 5] System klasy z uczniami i nauczycielami
	Stwórz schematy:
	- Klasa: nazwa (1a, 1b), profil (matematyczny, programistyczny),
		liczba uczniów
	- Relacja: powiąż klasę z nauczycielem opiekunem (referencja ID) --------------

	Implementuj endpointy:
	- GET /api/klasy - zwróć wszystkie klasy
	- GET /api/klasy/:id - zwróć klasę z danymi nauczyciela
		(populate, aby wyświetlić dane opiekuna) ------------------
	- POST /api/klasy - dodaj nową klasę
	- PUT /api/klasy/:id - zaktualizuj klasę i nauczyciela opiekuna ------------------
	- DELETE /api/klasy/:id - usuń klasę

	Obsłuż błędy walidacji i nieistniejące referencje.
*/

/*	[EXPERT - ocena 6] Kompleksowy system z relacjami
	Rozbuduj system z trzema modelami powiązanymi:
	- Szkoła: nazwa, adres, liczba sal
	- Klasa: nazwa, profil, szkoła (referencja), opiekun (referencja
		do nauczyciela)
	- Nauczyciel: imie, nazwisko, przedmiot, szkoła (referencja)

	Implementuj endpointy:
	- GET /api/szkoły - zwróć wszystkie szkoły
	- GET /api/szkoły/:id - zwróć szkołę z klasami i nauczycielami
		(populate)
	- GET /api/szkoły/:id/klasy - zwróć klasy danej szkoły
	- GET /api/szkoły/:id/nauczyciele - zwróć nauczycieli danej szkoły
	- POST /api/szkoły - dodaj nową szkołę
	- PUT /api/szkoły/:id - zaktualizuj szkołę
	- DELETE /api/szkoły/:id - usuń szkołę (i jej klasy)

	Implementuj kaskadowe usuwanie: usunięcie szkoły powoduje usunięcie
	jej klas i nauczycieli. Obsługuj wszystkie błędy i populuj dane.
*/
// #endregion


// #region podsumowanie
/*	Kluczowe pojęcia z lekcji
	- 'REST API' - architektura do komunikacji klient-serwer
		przy użyciu HTTP
	- 'Metody HTTP' - GET (odczyt), POST (tworzenie), PUT (aktualizacja),
		DELETE (usuwanie)
	- 'Endpoint' - URL wraz z metodą HTTP (np. GET /api/uczniowie)
	- 'Schemat Mongoose' - definicja struktury dokumentu w MongoDB
	- 'Model Mongoose' - interfejs do operacji na kolekcji
	- 'CRUD' - Create (POST), Read (GET), Update (PUT), Delete (DELETE)
	- 'Kod statusu HTTP' - liczba informująca o wyniku zapytania
	- 'Middleware' - funkcja przetwarzająca zapytania w Express
	- 'req i res' - obiekty reprezentujące zapytanie i odpowiedź
*/

/*	Najważniejsze wnioski
	- REST API pozwala na zbudowanie backendu, do którego mogą się
		podłączać różne frontendy (React, Angular, mobilne)
	- MongoDB przechowuje dane jako dokumenty JSON, co naturalnie
		integruje się z JavaScriptem
	- Każdy endpoint powinien mieć jasny cel (GET do odczytu,
		POST do tworzenia itd.)
	- Zawsze obsługuj błędy i zwracaj odpowiednie kody statusu HTTP
	- Mongoose ułatwia walidację i relacje między dokumentami
*/

/*	Najczęściej popełniane błędy
	- Zapominanie o middleware 'express.json()' - zapytania POST
		nie będą parsowane
	- Mieszanie metod HTTP - GET do modyfikacji danych zamiast POST/PUT
	- Zwracanie złych kodów statusu - np. 200 zamiast 201 przy tworzeniu
	- Brak obsługi błędów w try-catch - serwer się wywala
	- Nieistniejące ID zwraca null - trzeba sprawdzić przed wykoaniem
		operacji
	- Zapominanie o populate() - relacje zwracają tylko ID
	- Brak walidacji danych z req.body - baza dostaje złe dane
*/

/*	Dobre praktyki
	- Zwracaj odpowiednie kody statusu (200, 201, 400, 404, 500)
	- Zawsze obsługuj błędy try-catch
	- Waliduj dane z req.body - nie ufaj klientowi
	- Używaj populate() do pobierania powiązanych dokumentów
	- Testuj endpointy narzędziami typu Postman lub Thunder Client
	- Pisz czytelny kod z opisowymi nazwami zmiennych (polski)
	- Grupuj endpointy po zasobach (wszyscy nauczyciele razem)
	- Zwracaj wiadomości błędu w JSON-ie, żeby frontend mógł je wyświetlić
*/

/*	Co dalej?
	- Nauka filtrowania i paginacji - GET /api/uczniowie?strona=1&limit=10
	- Ustalanie relacji między kolekcjami (populate, aggregate)
	- Wdrażanie walidacji zaawansowanej (regex, niestandardowe walidatory)
	- Autentykacja i autoryzacja - JWT, role użytkowników
	- Testy automatyczne z Jest lub Mocha
	- Deployment API na serwer produkcyjny (Heroku, AWS)
	- Cache'owanie odpowiedzi z Redis dla wydajności
	- Dokumentacja API z Swagger
*/
// #endregion
