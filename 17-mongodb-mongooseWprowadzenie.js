// #region Wstęp
/*	Cel lekcji:
	W tej lekcji poznasz Mongoose - bibliotekę, która ułatwia
	pracę z bazą danych MongoDB w Node.js.
*/

/*	Co osiągniesz po tej lekcji:
	- Będziesz wiedzieć czym jest Mongoose i po co się go używa
	- Nauczysz się instalować i łączyć Mongoose z MongoDB
	- Poznasz pojęcia: Schema, Model, Document
	- Będziesz umieć tworzyć, zapisywać i pobierać dokumenty
	- Zastosujesz Mongoose w projekcie Systemu Zarządzania Szkołą
*/
// #endregion


// #region Informacje
/*	1. CO TO JEST MONGOOSE?
	-----------------------
	Biblioteka dla Node.js, która pozwala pracować z MongoDB w
	bardziej zorganizowany sposób. Jest tzw. ODM (Object Document
	Mapper) - działa jak "tłumacz" między Twoim kodem JavaScript a
	bazą MongoDB. Mongoose to biblioteka dla Node.js, która pozwala
	pracować z MongoDB w bardziej zorganizowany sposób. Dzięki
	niemu możesz definiować struktury danych (schematy),
	walidować dane i wykonywać operacje na bazie danych w
	wygodny sposób.

	Bez Mongoose: wrzucasz do bazy dowolne dane bez żadnych reguł
	Z Mongoose: definiujesz reguły (Schema) i baza ich pilnuje

	Przykład z życia:
	Wyobraź sobie dziennik szkolny. Bez reguł można by wpisać
	ucznia bez imienia, z ujemną oceną albo bez klasy.
	Mongoose to takie reguły, które nie pozwolą na takie błędy.
*/

/*	2. KLUCZOWE POJĘCIA
	-------------------
	SCHEMA (schemat):
	- Definiuje strukturę dokumentu - jakie pola ma mieć,
		jakiego są typu, czy są wymagane itp.
	- To jakby szablon formularza w szkole

	MODEL:
	- Tworzony na podstawie Schematu
	- Reprezentuje kolekcję w bazie danych
	- Dzięki modelowi możesz dodawać, pobierać, edytować dane

	DOCUMENT (dokument):
	- Pojedynczy rekord w bazie danych
	- Instancja Modelu
	- To jakby jeden wypełniony formularz ucznia
*/

/*	3. TYPY DANYCH W MONGOOSE
	-------------------------
	String     - tekst, np. imię, nazwisko
	Number     - liczba, np. wiek, ocena
	Boolean    - prawda/fałsz, np. czy aktywny
	Date       - data, np. data urodzenia
	Array      - tablica, np. lista ocen
	ObjectId   - referencja do innego dokumentu (relacja)
	Mixed      - dowolny typ (unikaj jeśli możesz)
*/

/*	4. INSTALACJA I KONFIGURACJA
	----------------------------
	Aby używać Mongoose, w terminalu wpisz:
	node (
		npm install mongoose
	)

	Połączenie z bazą danych wygląda tak:
	javascript (
		mongoose.connect('mongodb://localhost:27017/nazwaBazy');
	)
*/

/*	5. STRUKTURA PROJEKTU
	---------------------
	Typowy projekt z Mongoose wygląda tak:

	szkola/
	|-- models/           <- tutaj trzymamy modele
	|   |-- Uczen.js
	|   |-- Nauczyciel.js
	|   |-- Klasa.js
	|-- app.js            <- główny plik aplikacji
	|-- package.json

*/
// #endregion


// #region przydatne funkcje i metody
/*	1. mongoose.connect() - połączenie z bazą danych
	------------------------------------------------------------
	Służy do nawiązania połączenia z MongoDB.

	Składnia:
	javascript (
		mongoose.connect(uri, opcje)
	)

	Przykład:
	javascript (

		mongoose.connect('mongodb://localhost:27017/szkola', {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		.then(() => console.log('Połączono z bazą danych'))
		.catch(err => console.log('Błąd:', err));
	)
*/

/*	2. new mongoose.Schema() - tworzenie schematu
	------------------------------------------------------------
	Definiuje strukturę dokumentu.

	Przykład:
	javascript (
		const uczenSchema = new mongoose.Schema({
			imie: {
				type: String,
				required: true       // pole wymagane
			},
			nazwisko: {
				type: String,
				required: true
			},
			wiek: {
				type: Number,
				min: 6,              // minimalna wartość
				max: 20              // maksymalna wartość
			},
			klasa: {
				type: String,
				default: 'brak'      // domyślna wartość
			},
			aktywny: {
				type: Boolean,
				default: true
			}
		});
	)
*/

/*	3. mongoose.model() - tworzenie modelu
	------------------------------------------------------------
	Na podstawie schematu tworzymy model (klasę).

	javascript (
		const Uczen = mongoose.model('Uczen', uczenSchema);
		// Mongoose automatycznie stworzy kolekcję 'uczens' w bazie
	)
*/

/*	4. new Model() i .save() - tworzenie i zapisywanie dokumentu
	------------------------------------------------------------
	javascript (
		const nowyUczen = new Uczen({
			imie: 'Jan',
			nazwisko: 'Kowalski',
			wiek: 16,
			klasa: '2A'
		});

		nowyUczen.save()
			.then(doc => console.log('Zapisano:', doc))
			.catch(err => console.log('Błąd:', err));
	)
*/

/*	5. Model.create() - szybkie tworzenie i zapisywanie
	------------------------------------------------------------
	javascript (
		Uczen.create({
			imie: 'Anna',
			nazwisko: 'Nowak',
			wiek: 15,
			klasa: '1B'
		})
		.then(doc => console.log('Utworzono:', doc))
		.catch(err => console.log('Błąd:', err));
	)
*/

/*	6. Model.find() - pobieranie dokumentów
	------------------------------------------------------------
	Zwraca tablicę pasujących dokumentów.

	javascript (
		// Pobierz wszystkich uczniów
		Uczen.find()
			.then(uczniowie => console.log(uczniowie))
			.catch(err => console.log(err));

		// Pobierz uczniów z klasy 2A
		Uczen.find({ klasa: '2A' })
			.then(uczniowie => console.log(uczniowie))
			.catch(err => console.log(err));
	)
*/

/*	7. Model.findOne() - pobieranie jednego dokumentu
	------------------------------------------------------------
	javascript (
		Uczen.findOne({ imie: 'Jan' })
			.then(uczen => console.log(uczen))
			.catch(err => console.log(err));
	)
*/

/*	8. Model.findById() - pobieranie po ID
	------------------------------------------------------------
	javascript (
		Uczen.findById('64a1b2c3d4e5f6a7b8c9d0e1')
			.then(uczen => console.log(uczen))
			.catch(err => console.log(err));
	)
*/

/*	9. Model.findByIdAndUpdate() - aktualizacja po ID
	------------------------------------------------------------
	javascript (
		Uczen.findByIdAndUpdate(
			'64a1b2c3d4e5f6a7b8c9d0e1',
			{ klasa: '3A' },
			{ new: true }     // zwróć zaktualizowany dokument
		)
		.then(uczen => console.log('Zaktualizowano:', uczen))
		.catch(err => console.log(err));
	)
*/

/*	10. Model.findByIdAndDelete() - usuwanie po ID
	------------------------------------------------------------
	javascript (
		Uczen.findByIdAndDelete('64a1b2c3d4e5f6a7b8c9d0e1')
			.then(uczen => console.log('Usunięto:', uczen))
			.catch(err => console.log(err));
	)
*/

/*	11. Opcje walidacji w Schema
	------------------------------------------------------------
	javascript (
		{
			imie: {
				type: String,
				required: [true, 'Imię jest wymagane'],  // własny komunikat błędu
				minlength: 2,
				maxlength: 50,
				trim: true         // usuwa spacje z początku i końca
			},
			ocena: {
				type: Number,
				min: 1,
				max: 6,
				enum: [1, 2, 3, 4, 5, 6]  // tylko te wartości są dozwolone
			},
			email: {
				type: String,
				unique: true,      // wartość musi być unikalna
				lowercase: true    // zawsze zapisuje małymi literami
			}
		}
	)
*/

/*	12. Timestamps - automatyczne daty
	------------------------------------------------------------
	javascript (
		const uczenSchema = new mongoose.Schema({
			imie: String
		}, {
			timestamps: true   // automatycznie dodaje createdAt i updatedAt
		});
	)
*/
// #endregion


// #region przykłady
/*	PRZYKŁAD 1: Podstawowe połączenie z MongoDB
	------------------------------------------------------------
	Ten kod łączy aplikację z lokalną bazą danych MongoDB
	i informuje o wyniku połączenia.

	Efekt: W konsoli pojawi się "Połączono z bazą szkola" lub
	komunikat błędu jeśli MongoDB nie działa.

	javascript (

		const URI = 'mongodb://localhost:27017/szkola';

		async function polaczZBaza() {
			try {
				await mongoose.connect(URI);
				console.log('Połączono z bazą szkola');
			} catch (blad) {
				console.log('Nie można połączyć się z bazą:', blad.message);
				process.exit(1);
			}
		}

		polaczZBaza();
	)
*/

/*	PRZYKŁAD 2: Schemat i Model ucznia
	------------------------------------------------------------
	Definiujemy jak ma wyglądać dokument ucznia w bazie danych.
	Schema pilnuje że każdy uczeń ma imię, nazwisko i klasę.

	Efekt: Mamy gotowy Model Uczen, którego możemy używać
	do operacji na bazie danych.

	javascript (

		const uczenSchema = new mongoose.Schema({
			imie: {
				type: String,
				required: [true, 'Imię jest wymagane'],
				trim: true,
				minlength: 2
			},
			nazwisko: {
				type: String,
				required: [true, 'Nazwisko jest wymagane'],
				trim: true
			},
			wiek: {
				type: Number,
				min: 6,
				max: 20
			},
			klasa: {
				type: String,
				required: true,
				enum: ['1A', '1B', '2A', '2B', '3A', '3B']
			},
			srednia: {
				type: Number,
				default: 0,
				min: 0,
				max: 6
			},
			aktywny: {
				type: Boolean,
				default: true
			}
		}, {
			timestamps: true
		});

		export const Uczen = mongoose.model('Uczen', uczenSchema);
	)
*/

/*	PRZYKŁAD 3: Dodawanie nowego ucznia do bazy
	------------------------------------------------------------
	Tworzymy nowego ucznia i zapisujemy go do bazy danych.
	Używamy async/await dla czytelności kodu.

	Efekt: W bazie danych pojawi się nowy dokument ucznia
	z automatycznie nadanym ID i datami createdAt/updatedAt.

	javascript (

		async function dodajUcznia() {
			await mongoose.connect('mongodb://localhost:27017/szkola');

			try {
				const nowyUczen = await Uczen.create({
					imie: 'Piotr',
					nazwisko: 'Wiśniewski',
					wiek: 16,
					klasa: '2A',
					srednia: 4.5
				});

				console.log('Dodano ucznia:');
				console.log('ID:', nowyUczen._id);
				console.log('Imię:', nowyUczen.imie);
				console.log('Klasa:', nowyUczen.klasa);
				console.log('Utworzono:', nowyUczen.createdAt);
			} catch (blad) {
				console.log('Błąd podczas dodawania:', blad.message);
			} finally {
				await mongoose.disconnect();
			}
		}

		dodajUcznia();
	)
*/

/*	PRZYKŁAD 4: Pobieranie uczniów z filtrami
	------------------------------------------------------------
	Pokazuje różne sposoby wyszukiwania danych.
	Możemy pobrać wszystkich, lub tylko tych spełniających warunki.

	Efekt: Wyświetlenie listy uczniów z klasy 2A ze średnią
	powyżej 4.0, posortowanych alfabetycznie.

	javascript (

		async function pobierzUczniow() {
			await mongoose.connect('mongodb://localhost:27017/szkola');

			try {
				// Pobierz wszystkich uczniów z klasy 2A
				// ze średnią powyżej 4.0
				// posortowanych po nazwisku
				const uczniowie = await Uczen.find({
					klasa: '2A',
					srednia: { $gt: 4.0 }  // $gt oznacza "większe niż"
				})
				.sort({ nazwisko: 1 })     // 1 = rosnąco, -1 = malejąco
				.select('imie nazwisko srednia');  // pobierz tylko te pola

				console.log(`Znaleziono ${uczniowie.length} uczniów:`);
				uczniowie.forEach(uczen => {
					console.log(`${uczen.nazwisko} ${uczen.imie} - średnia: ${uczen.srednia}`);
				});
			} catch (blad) {
				console.log('Błąd:', blad.message);
			} finally {
				await mongoose.disconnect();
			}
		}

		pobierzUczniow();
	)
*/

/*	PRZYKŁAD 5: Aktualizacja danych ucznia
	------------------------------------------------------------
	Aktualizujemy dane ucznia znajdując go po ID.
	Opcja { new: true } sprawia że dostajemy zaktualizowany dokument.

	Efekt: Uczeń z podanym ID ma zmienioną klasę i średnią.

	javascript (

		async function zaktualizujUcznia(id, noweDane) {
			await mongoose.connect('mongodb://localhost:27017/szkola');

			try {
				const zaktualizowany = await Uczen.findByIdAndUpdate(
					id,
					noweDane,
					{
						new: true,          // zwróć zaktualizowany dokument
						runValidators: true  // sprawdź walidację przy aktualizacji
					}
				);

				if (!zaktualizowany) {
					console.log('Nie znaleziono ucznia o tym ID');
					return;
				}

				console.log('Zaktualizowano ucznia:');
				console.log(zaktualizowany);
			} catch (blad) {
				console.log('Błąd:', blad.message);
			} finally {
				await mongoose.disconnect();
			}
		}

		// Przykładowe użycie (zastąp ID prawdziwym ID z bazy):
		// zaktualizujUcznia('64a1b2c3d4e5f6a7b8c9d0e1', { klasa: '3A', srednia: 4.8 });
	)
*/

/*	PRZYKŁAD 6: Schemat nauczyciela z referencją
	------------------------------------------------------------
	Pokazuje jak tworzyć relacje między dokumentami.
	Nauczyciel ma referencję do swojej klasy (ObjectId).

	Efekt: Model Nauczyciel gotowy do użycia w projekcie.

	javascript (

		const nauczycielSchema = new mongoose.Schema({
			imie: {
				type: String,
				required: true,
				trim: true
			},
			nazwisko: {
				type: String,
				required: true,
				trim: true
			},
			przedmiot: {
				type: String,
				required: true,
				enum: [
					'matematyka',
					'język polski',
					'historia',
					'biologia',
					'chemia',
					'fizyka',
					'angielski'
				]
			},
			email: {
				type: String,
				unique: true,
				lowercase: true,
				trim: true
			},
			// Referencja do klas, które prowadzi
			klasy: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Klasa'  // odwołanie do modelu Klasa
			}]
		}, {
			timestamps: true
		});

		export const Nauczyciel = mongoose.model('Nauczyciel', nauczycielSchema);
	)

*/
// #endregion


// #region zadania
/*	ZADANIE 1 (łatwe) - Połączenie z bazą danych
	------------------------------------------------------------
	Zadanie:
	Napisz funkcję 'polaczSieBaza()', która:
	1. Łączy się z MongoDB pod adresem: mongodb://localhost:27017/mojaSzkola
	2. Wyświetla w konsoli "Połączono!" gdy połączenie się uda
	3. Wyświetla "Błąd połączenia: [treść błędu]" gdy się nie uda
	4. Użyj async/await i try/catch

	Wskazówka: Użyj mongoose.connect() wewnątrz async funkcji

	Miejsce na Twoje rozwiązanie:
	javascript (
		async function polaczSieBaza() {
			// Twój kod tutaj
		}

		polaczSieBaza();
	)
*/

/*	ZADANIE 2 (łatwe-średnie) - Tworzenie Schematu
	------------------------------------------------------------
	Zadanie:
	Stwórz schemat dla kolekcji 'Przedmiot' w systemie szkolnym.
	Schemat powinien zawierać:
	- nazwa: String, wymagana, minlength: 3
	- opis: String, niewymagany
	- liczbaGodzin: Number, wymagana, min: 1, max: 10
	- obowiazkowy: Boolean, domyślnie: true

	Następnie stwórz Model na podstawie tego schematu.
	Na końcu wyeksportuj Model.

	Wskazówka: Użyj new mongoose.Schema() i mongoose.model()

	Miejsce na Twoje rozwiązanie:
	javascript (
		// Twój schemat tutaj

		// Twój model tutaj

		// Eksport modelu tutaj
	)
*/

/*	ZADANIE 3 (średnie) - Dodawanie danych
	------------------------------------------------------------
	Zadanie:
	Używając Modelu 'Uczen' (z przykładu 2), napisz funkcję
	'dodajKilkuUczniow()', która:
	1. Łączy się z bazą danych
	2. Dodaje 3 uczniów do bazy (wymyśl dane)
	3. Każdy uczeń musi mieć: imię, nazwisko, wiek, klasę
	4. Wyświetla ID każdego dodanego ucznia
	5. Rozłącza się z bazą po zakończeniu

	Wskazówka: Możesz używać Uczen.create() w pętli lub
	Promise.all() dla wszystkich naraz

	Miejsce na Twoje rozwiązanie:
	javascript (
		async function dodajKilkuUczniow() {
			// Twój kod tutaj
		}

		dodajKilkuUczniow();
	)
*/

/*	ZADANIE 4 (średnie-trudne) - Wyszukiwanie i filtrowanie
	------------------------------------------------------------
	Zadanie:
	Napisz funkcję 'raportKlasy(nazwaKlasy)', która:
	1. Przyjmuje nazwę klasy jako argument (np. '2A')
	2. Pobiera wszystkich uczniów z tej klasy
	3. Wyświetla:
		- Liczbę uczniów w klasie
		- Listę uczniów (imię, nazwisko, średnia) posortowaną po nazwisku
		- Najlepszą średnią w klasie
		- Średnią całej klasy (oblicz w JavaScript, nie w MongoDB)
	4. Jeśli klasa jest pusta, wyświetl odpowiedni komunikat

	Wskazówka: Użyj Uczen.find({ klasa: nazwaKlasy })
	i .sort({ nazwisko: 1 })
	Do obliczeń użyj metod tablicowych: .reduce(), .map()

	Miejsce na Twoje rozwiązanie:
	javascript (
		async function raportKlasy(nazwaKlasy) {
			// Twój kod tutaj
		}

		raportKlasy('2A');
	)
*/

/*	ZADANIE 5 (trudne) - Pełny CRUD
	------------------------------------------------------------
	Zadanie:
	Stwórz plik 'zarzadzanieUczniami.js', który będzie zawierać
	cztery funkcje do zarządzania uczniami:

	1. dodajUcznia(dane) - dodaje ucznia, zwraca nowy dokument
	2. pobierzUcznia(id) - pobiera ucznia po ID, zwraca dokument
		lub null jeśli nie istnieje
	3. zaktualizujUcznia(id, noweDane) - aktualizuje i zwraca
		zaktualizowany dokument (używaj runValidators: true)
	4. usunUcznia(id) - usuwa ucznia, zwraca usunięty dokument

	Każda funkcja powinna:
	- Być async
	- Obsługiwać błędy (try/catch)
	- Wyświetlać informacje o wyniku operacji

	Na końcu pliku przetestuj każdą funkcję wywołując je kolejno.

	Wskazówka: Nie zapomnij o połączeniu z bazą na początku
	i rozłączeniu po wszystkich operacjach

	Miejsce na Twoje rozwiązanie:
	javascript (
		async function dodajUcznia(dane) {
			// Twój kod tutaj
		}

		async function pobierzUcznia(id) {
			// Twój kod tutaj
		}

		async function zaktualizujUcznia(id, noweDane) {
			// Twój kod tutaj
		}

		async function usunUcznia(id) {
			// Twój kod tutaj
		}

		// Tutaj przetestuj swoje funkcje
		async function testuj() {
			await mongoose.connect('mongodb://localhost:27017/szkola');
			// Twoje testy tutaj
			await mongoose.disconnect();
		}

		testuj();
	)
*/

/*	ZADANIE 6 (bardzo trudne) - System ocen z wieloma modelami
	------------------------------------------------------------
	Zadanie:
	Stwórz kompletny system ocen dla szkoły z trzema modelami:

	MODEL 1 - Klasa:
	- nazwa: String, wymagana, unikalna (np. '2A')
	- wychowawca: String, wymagana
	- rokSzkolny: String, wymagana (np. '2024/2025')

	MODEL 2 - Uczeń (rozszerzony):
	- imię, nazwisko: String, wymagane
	- klasa: referencja do Modelu Klasa (ObjectId, ref: 'Klasa')
	- dataUrodzenia: Date

	MODEL 3 - Ocena:
	- uczen: referencja do Modelu Uczen (ObjectId, ref: 'Uczen')
	- przedmiot: String, wymagany
	- wartosc: Number, wymagana, min: 1, max: 6
	- data: Date, domyślnie: Date.now
	- komentarz: String

	Następnie napisz funkcję 'wypiszSwiadectwo(uczenId)', która:
	1. Pobiera ucznia po ID
	2. Pobiera wszystkie oceny tego ucznia
	3. Grupuje oceny po przedmiotach
	4. Oblicza średnią dla każdego przedmiotu
	5. Oblicza średnią wszystkich ocen ucznia
	6. Wyświetla: imię, nazwisko, klasę i podsumowanie ocen
		w formacie:
		"Świadectwo ucznia: Jan Kowalski, klasa: 2A"
		"Matematyka: średnia 4.50 (3 oceny)"
		"Język polski: średnia 3.67 (3 oceny)"
		"Średnia ogólna: 4.08"

	Wskazówka:
	- Użyj .populate() do pobierania powiązanych dokumentów
	- Do grupowania ocen użyj .reduce()
	- Aby pobrać ocenę bez zaokrąglania użyj .toFixed(2)

	Miejsce na Twoje rozwiązanie:
	javascript (
		// --- Schematy i Modele ---

		const klasaSchema = new mongoose.Schema({
			// Twój kod tutaj
		});

		const Klasa = mongoose.model('Klasa', klasaSchema);

		const uczenSchema = new mongoose.Schema({
			// Twój kod tutaj - pamiętaj o referencji do Klasy
		});

		const Uczen = mongoose.model('Uczen', uczenSchema);

		const ocenaSchema = new mongoose.Schema({
			// Twój kod tutaj - pamiętaj o referencjach
		});

		const Ocena = mongoose.model('Ocena', ocenaSchema);

		// --- Funkcja świadectwa ---

		async function wypiszSwiadectwo(uczenId) {
			// Twój kod tutaj
		}

		// --- Testowanie ---

		async function testuj() {
			await mongoose.connect('mongodb://localhost:27017/szkola');

			try {
				// 1. Stwórz klasę
				// 2. Stwórz ucznia przypisanego do klasy
				// 3. Dodaj kilka ocen z różnych przedmiotów
				// 4. Wywołaj wypiszSwiadectwo(uczen._id)

				// Twój kod testowy tutaj

			} catch (blad) {
				console.log('Błąd:', blad.message);
			} finally {
				await mongoose.disconnect();
			}
		}

		testuj();
	)

*/
// #endregion


// #region	MONGOOSE - najważniejsze informacje:
/*	1. CO TO JEST MONGOOSE?
	Mongoose to biblioteka ODM dla Node.js, która ułatwia
	pracę z MongoDB. Zapewnia strukturę, walidację i wygodne
	metody do operacji na bazie danych.
*/

/*	2. TRZY KLUCZOWE POJĘCIA:
	- Schema - szablon dokumentu (jakie pola, jakiego typu)
	- Model  - klasa na podstawie schematu (do operacji CRUD)
	- Document - pojedynczy rekord (instancja modelu)
*/

/*	3. INSTALACJA:
	npm install mongoose
*/

/*	4. POŁĄCZENIE Z BAZĄ:
	mongoose.connect('mongodb://localhost:27017/nazwaBazy')
*/

/*	5. TWORZENIE SCHEMATU I MODELU:
	const schema = new mongoose.Schema({ pole: typ })
	const Model = mongoose.model('NazwaModelu', schema)
*/

/*	6. PODSTAWOWE OPERACJE CRUD:
	- Create:  Model.create(dane)  lub  new Model(dane).save()
	- Read:    Model.find()  /  Model.findById(id)
	- Update:  Model.findByIdAndUpdate(id, dane, { new: true })
	- Delete:  Model.findByIdAndDelete(id)
*/

/*	7. WALIDACJA W SCHEMACIE:
	- required    - pole wymagane
	- type        - typ danych
	- min / max   - zakres dla Number
	- minlength / maxlength - zakres dla String
	- enum        - lista dozwolonych wartości
	- default     - domyślna wartość
	- unique      - unikalność wartości
*/

/*	8. RELACJE MIĘDZY DOKUMENTAMI:
	Użyj ObjectId i ref aby wskazać na inny model:
	klasa: { type: mongoose.Schema.Types.ObjectId, ref: 'Klasa' }
	Następnie użyj .populate() aby pobrać dane z referencji.
*/

/*	9. TIMESTAMPS:
	Dodaj { timestamps: true } do opcji schematu aby
	automatycznie zapisywać daty createdAt i updatedAt.
*/

/*	10. DOBRE PRAKTYKI:
	- Zawsze używaj async/await z try/catch
	- Trzymaj modele w osobnym folderze 'models/'
	- Eksportuj modele przez export
	- Rozłączaj się z bazą po zakończeniu operacji
	- Używaj runValidators: true przy aktualizacji
*/
// #endregion
