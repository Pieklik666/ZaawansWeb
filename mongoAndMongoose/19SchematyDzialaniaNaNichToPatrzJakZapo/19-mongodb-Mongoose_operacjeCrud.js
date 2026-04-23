// #region wstęp
/*	Cele lekcji
	Operacje CRUD (Create, Read, Update, Delete) w MongoDB za pomocą
	Mongoose. Nauczysz się tworzyć, odczytywać, aktualizować i usuwać
	dokumenty w bazie danych, pracując z modelami Mongoose.
*/

/*	Co będziesz umieć po tej lekcji?
	- Tworzyć nowe dokumenty za pomocą create() i new Model()
	- Odczytywać dokumenty: find(), findById(), findOne()
	- Aktualizować dokumenty: updateOne(), findByIdAndUpdate()
	- Usuwać dokumenty: deleteOne(), findByIdAndDelete()
	- Pracować z Promise'ami i async/await
	- Obsługiwać błędy operacji bazodanowych
*/
// #endregion


// #region informacje
/*	Analogia SQL - MongoDB (przypomnienie)
	- Tabela -> Kolekcja
	- Rekord -> Dokument
	- Kolumna -> Pole
	- PRIMARY KEY -> _id (ObjectId)
	- INSERT -> create() lub new Model()
	- SELECT -> find() lub findById()
	- UPDATE -> updateOne() lub findByIdAndUpdate()
	- DELETE -> deleteOne() lub findByIdAndDelete()
*/

/*	CRUD operations
	Pochodzą z języka angielskiego:
	- (C)reate (Tworzenie) - dodawanie nowych dokumentów do kolekcji
	- (R)ead (Odczyt) - pobieranie dokumentów z kolekcji
	- (U)pdate (Aktualizacja) - modyfikowanie istniejących dokumentów
	- (D)elete (Usuwanie) - usuwanie dokumentów z kolekcji

	Każda aplikacja internetowa wykonuje głównie operacje CRUD.
	W naszej aplikacji zarządzającej szkołą będziemy wymieniać uczniów,
	edytować oceny, usuwać lekcje itp. - to właśnie operacje CRUD.
*/

/*	Promise oraz async/await
	Operacje na bazie danych są asynchroniczne - mogą zająć pewien czas.
	Mongoose zwraca Promise'y, które możemy obsługiwać za pomocą .then()
	lub async/await. Async/await to nowszy, bardziej czytelny sposób.

	Przykład z Promise:
		Szkola.find().then(szkoly => { ... }).catch(err => { ... })

	Przykład z async/await:
		const szkoly = await Szkola.find()
*/
// #endregion


// #region przydatne funkcje
// #region create() - tworzenie dokumentu
/*	Opis
	Tworzy i zapisuje nowy dokument w kolekcji. Zwraca Promise
	z zapisanym dokumentem (zawiera _id).
*/

/*	Składnia
	await Model.create({ pole1: wartosc1, pole2: wartosc2 })
	lub
	const instancja = new Model({ pole1: wartosc1, pole2: wartosc2 })
	await instancja.save()
*/

/*	Przykład:
	import mongoose from 'mongoose'

	const schematUcznia = new mongoose.Schema({
		imie: String,
		nazwisko: String,
		klasa: String
	})
	const Uczen = mongoose.model('uczniowie', schematUcznia)

	// Metoda 1: create()
	const nowyUczen = await Uczen.create({
		imie: 'Jan',
		nazwisko: 'Kowalski',
		klasa: '3a'
	})
	// Wynik: { _id: ObjectId(...), imie: 'Jan', ... }

	// Metoda 2: new + save()
	const uczen2 = new Uczen({ imie: 'Maria', nazwisko: 'Nowak' })
	await uczen2.save()
*/

/*	Zadanie:
	Stwórz funkcję `dodajUcznia()`, która tworzy nowego ucznia
	w kolekcji 'uczniowie'. Funkcja powinna zwrócić zapisany dokument.
*/
// #endregion

// #region find() - pobieranie wielu dokumentów
/*	Opis
	Pobiera wszystkie dokumenty z kolekcji (lub filtruje je).
	Zwraca tablicę dokumentów. Bez parametrów wyszukuje wszystko.
*/

/*	Składnia
	await Model.find()						// wszystkie
	await Model.find({ pole: wartosc })		// z filtrem
	await Model.find().limit(10)			// ograniczenie liczby
	await Model.find().skip(5)				// pominięcie
*/

/*	Przykład:
	// Wszyscy uczniowie
	const wszyscy = await Uczen.find()
	// Wynik: [ { _id: ..., imie: 'Jan', ... }, { ... }, ... ]

	// Uczniowie z klasy 3a
	const klasa3a = await Uczen.find({ klasa: '3a' })

	// Pierwsze 10 uczniów
	const pierwsi10 = await Uczen.find().limit(10)

	// Uczniowie od 5. do 15.
	const strona2 = await Uczen.find().skip(5).limit(10)
*/

/*	Zadanie:
	Stwórz funkcję `pobierzUczniowZKlasy()`, która przyjmuje
	numer klasy i zwraca wszystkich uczniów z tej klasy.
*/
// #endregion

// #region findById() - pobieranie jednego dokumentu po ID
/*	Opis
	Szybszy niż find({ _id: id }). Pobiera dokument po jego
	identyfikatorze. Zwraca jeden dokument lub null.
*/

/*	Składnia
	await Model.findById(id)
*/

/*	Przykład:
	const uczen = await Uczen.findById('507f1f77bcf86cd799439011')
	// Wynik: { _id: ObjectId(...), imie: 'Jan', ... }

	const nieistniejacy = await Uczen.findById('000000000000')
	// Wynik: null (nie znaleziono)
*/

/*	Zadanie:
	Stwórz funkcję `pobierzUcznia()`, która przyjmuje ID ucznia
	i zwraca jego dane. Obsłuż przypadek, gdy uczeń nie istnieje.
*/
// #endregion

// #region findOne() - pobieranie pierwszego pasującego dokumentu
/*	Opis
	Pobiera pierwszy dokument pasujący do warunku. Zwraca jeden
	dokument lub null. Podobnie jak find(), ale zwraca obiekt,
	a nie tablicę.
*/

/*	Składnia
	await Model.findOne({ pole: wartosc })
*/

/*	Przykład:
	const uczen = await Uczen.findOne({ email: 'jan@szk.pl' })
	// Wynik: { _id: ..., imie: 'Jan', email: 'jan@szk.pl' }

	const nieistniejacy = await Uczen.findOne({ email: 'x@x.pl' })
	// Wynik: null
*/

/*	Zadanie:
	Stwórz funkcję `pobierzUczeniaPoEmailu()`, która znajduje
	ucznia po jego adresie email.
*/
// #endregion

// #region updateOne() - aktualizacja pierwszego pasującego dokumentu
/*	Opis
	Aktualizuje pierwszy dokument pasujący do warunku. Używa
	operatora $set do ustawienia nowych wartości. Nie zwraca
	zaktualizowanego dokumentu, tylko status operacji.
*/

/*	Składnia
	await Model.updateOne(
		{ pole: wartosc },			// warunek gdzie
		{ $set: { pole: nowa } }	// co zmienić
	)
*/

/*	Przykład:
	const wynik = await Uczen.updateOne(
		{ _id: '507f1f77bcf86cd799439011' },
		{ $set: { klasa: '3b' } }
	)
	// Wynik: { acknowledged: true, modifiedCount: 1 }

	// Przeniesienie ucznia do innej klasy
	await Uczen.updateOne(
		{ imie: 'Jan', nazwisko: 'Kowalski' },
		{ $set: { klasa: '4a' } }
	)
*/

/*	Zadanie:
	Stwórz funkcję `aktualizujKlaseUcznia()`, która zmienia klasę
	ucznia na podstawie jego ID. Zwróć wynik operacji.
*/
// #endregion

// #region findByIdAndUpdate() - odmiana updateOne z zwrotem dokumentu
/*	Opis
	Kombinacja findById() i updateOne(). Aktualizuje dokument
	i zwraca go w jednej operacji. Przydatne, bo dostajemy
	zaktualizowane dane bez dodatkowego zapytania.
*/

/*	Składnia
	await Model.findByIdAndUpdate(
		id,
		{ $set: { pole: nowa } },
		{ new: true }		// true = zwróć zaktualizowany dokument
	)
*/

/*	Przykład:
	const uczen = await Uczen.findByIdAndUpdate(
		'507f1f77bcf86cd799439011',
		{ $set: { klasa: '3b' } },
		{ new: true }
	)
	// Wynik: { _id: ..., imie: 'Jan', klasa: '3b' }

	const stary = await Uczen.findByIdAndUpdate(
		'507f1f77bcf86cd799439011',
		{ $set: { klasa: '3b' } }
		// bez { new: true } - zwraca STARE dane
	)
*/

/*	Zadanie:
	Stwórz funkcję `aktualizujUcznia()`, która zmienia dane ucznia
	(imię, nazwisko, klasa) i zwraca zaktualizowany dokument.
*/
// #endregion

// #region deleteOne() - usuwanie pierwszego pasującego dokumentu
/*	Opis
	Usuwa pierwszy dokument pasujący do warunku. Nie zwraca
	usuniętego dokumentu, tylko status operacji.
*/

/*	Składnia
	await Model.deleteOne({ pole: wartosc })
*/

/*	Przykład:
	const wynik = await Uczen.deleteOne({
		_id: '507f1f77bcf86cd799439011'
	})
	// Wynik: { acknowledged: true, deletedCount: 1 }

	// Usuwanie po warunku
	await Uczen.deleteOne({ imie: 'Jan', nazwisko: 'Nowak' })
*/

/*	Zadanie:
	Stwórz funkcję `usunUcznia()`, która usuwa ucznia po ID
	i zwraca liczbę usuniętych dokumentów.
*/
// #endregion

// #region findByIdAndDelete() - odmiana deleteOne z zwrotem dokumentu
/*	Opis
	Usuwa dokument po ID i zwraca jego dane. Przydatne, bo
	mamy informacje o usuniętym dokumencie bez dodatkowego
	zapytania.
*/

/*	Składnia
	await Model.findByIdAndDelete(id)
*/

/*	Przykład:
	const usuniety = await Uczen.findByIdAndDelete(
		'507f1f77bcf86cd799439011'
	)
	// Wynik: { _id: ..., imie: 'Jan', nazwisko: 'Kowalski', ... }

	// Potwierdzenie usunięcia
	const uczniowie = await Uczen.findById(...)
	// Wynik: null (tym razem nie ma)
*/

/*	Zadanie:
	Stwórz funkcję `usunIZwrocUcznia()`, która usuwa ucznia
	i zwraca jego dane (przed usunięciem).
*/
// #endregion
// #endregion


// #region przykłady
// #region Przykład 1 - Pełny CRUD dla uczniów
/*	Opis
	Aplikacja do zarządzania uczniami. Pokażemy kolejne operacje
	CRUD w praktyce: dodawanie, odczyt, edycję i usuwanie.
*/

/*	Przykład:

	// Połączenie z bazą
	await mongoose.connect('mongodb://localhost:27017/szkola')

	// Schemat i model
	const schematUcznia = new mongoose.Schema({
		imie:		String,
		nazwisko:	String,
		klasa:		String,
		średnia:	Number
	})
	const Uczen = mongoose.model('uczniowie', schematUcznia)

	// CREATE - dodawanie nowych uczniów
	const uczen1 = await Uczen.create({
		imie: 'Jan',
		nazwisko: 'Kowalski',
		klasa: '3a',
		średnia: 4.5
	})
	console.log('Dodany uczeń:', uczen1._id)

	// READ - pobieranie danych
	const wszyscy = await Uczen.find()
	console.log('Wszyscy uczniowie:', wszyscy.length)

	const z3a = await Uczen.find({ klasa: '3a' })
	console.log('Uczniowie z 3a:', z3a.map(u => u.imie))

	const jeden = await Uczen.findById(uczen1._id)
	console.log('Znaleziony:', jeden.imie, jeden.nazwisko)

	// UPDATE - zmiana danych
	const zaktualizowany = await Uczen.findByIdAndUpdate(
		uczen1._id,
		{ $set: { klasa: '3b', średnia: 4.8 } },
		{ new: true }
	)
	console.log('Przeniesiony do klasy:', zaktualizowany.klasa)

	// DELETE - usuwanie
	const usuniety = await Uczen.findByIdAndDelete(uczen1._id)
	console.log('Usunięty:', usuniety.imie)

	// Potwierdzenie
	const uczen = await Uczen.findById(uczen1._id)
	console.log('Uczeń po usunięciu:', uczen)	// null

	// Wynik:
	// Dodany uczeń: 507f1f77bcf86cd799439011
	// Wszyscy uczniowie: 3
	// Uczniowie z 3a: [ 'Jan', 'Maria' ]
	// Znaleziony: Jan Kowalski
	// Przeniesiony do klasy: 3b
	// Usunięty: Jan
	// Uczeń po usunięciu: null
*/

/*	Zadanie:
	Uzupełnij kod - dodaj jeszcze dwóch uczniów, pobierz wszystkich
	uczniów, zaktualizuj średnią jednego z nich, a następnie usuń
	jednego ucznia. Wypisz wyniki każdej operacji.
*/
// #endregion

// #region Przykład 2 - Operacje na kolekcji nauczycieli
/*	Opis
	Zarządzanie nauczycielami: dodawanie, szukanie, aktualizacja
	i usuwanie. Pokazujemy praktyczne zastosowania CRUD.
*/

/*	Przykład:

	await mongoose.connect('mongodb://localhost:27017/szkola')

	const schemnatauczyciel = new mongoose.Schema({
		imie:		String,
		nazwisko:	String,
		przedmiot:	String,
		doswiadczenie: Number		// lata pracy
	})
	const Nauczyciel = mongoose.model('nauczyciele', schemnatauczyciel)

	// Dodanie nauczycieli
	const pani = await Nauczyciel.create({
		imie: 'Anna',
		nazwisko: 'Lewandowska',
		przedmiot: 'Matematyka',
		doswiadczenie: 10
	})

	// Znalezienie nauczycieli matematyki
	const matematycy = await Nauczyciel.find({ przedmiot: 'Matematyka' })
	console.log('Matematycy:', matematycy.length)

	// Nauczyciel z największym doświadczeniem
	const doswiadczeni = await Nauczyciel.find()
		.sort({ doswiadczenie: -1 })
		.limit(1)
	console.log('Najstarszy:', doswiadczeni[0].imie)

	// Aktualizacja (zmiana předmiotu)
	await Nauczyciel.updateOne(
		{ imie: 'Anna', nazwisko: 'Lewandowska' },
		{ $set: { przedmiot: 'Fizyka' } }
	)

	// Wynik:
	// Matematycy: 1
	// Najstarszy: Anna
*/

/*	Zadanie:
	Stwórz system wyszukiwania nauczycieli:
	- Pobierz nauczycieli tylko konkretnego przedmiotu
	- Wypisz tych z doświadczeniem > 5 lat
	- Zmień przedmiot nauczycielowi
*/
// #endregion

// #region Przykład 3 - Obsługa błędów w operacjach CRUD
/*	Opis
	Operacje bazodanowe mogą się nie powieść (błędy połączenia,
	walidacji, itp.). Musimy je obsługiwać za pomocą try/catch.
*/

/*	Przykład:

	await mongoose.connect('mongodb://localhost:27017/szkola')

	const schemnatauczen = new mongoose.Schema({
		imie:		String,
		nazwisko:	String,
		email:		{
			type:		String,
			required:	true,		// pole obowiązkowe
			unique:		true		// bez duplikatów
		}
	})
	const Uczen = mongoose.model('uczniowie', schemnatauczen)

	try {
		// Spróbuj dodać ucznia
		const uczen = await Uczen.create({
			imie: 'Jan',
			nazwisko: 'Kowalski',
			email: 'jan@szk.pl'
		})
		console.log('Dodano:', uczen._id)
	} catch (blad) {
		// Email już istnieje (unique constraint)
		console.log('Błąd:', blad.message)
	}

	// Pobieranie z obsługą błędu
	async function pobierzUcznia(id) {
		try {
			const uczen = await Uczen.findById(id)
			if (!uczen) throw new Error('Uczeń nie istnieje')
			return uczen
		} catch (blad) {
			console.log('Błąd:', blad.message)
			return null
		}
	}

	// Wynik:
	// Błąd: E11000 duplicate key error collection: ...
	// Błąd: Uczeń nie istnieje
*/

/*	Zadanie:
	Stwórz funkcję `bezpiecznaDodajUcznia()`, która:
	- Próbuje dodać ucznia
	- Obsługuje błąd duplikatu (email)
	- Obsługuje błąd braku pola obowiązkowego
	- Wypisuje odpowiedni komunikat dla każdego błędu
*/
// #endregion
// #endregion


// #region zadania
/*	Aby dostać 4, należy rozwiązać również zadania na 3. Analogicznie dla 5 i 6.
	Odpowiedzi do zadań proszę zapisać:
		w formacie 'zadanie-X.js' (X to numer zadania np. 'zadanie-1.js')
		w katalogu 'W:\numerKlasy\przedmiot\data-nazwaPlikuBezRozszerzenia\ImieNazwisko\'
			np. 'W:\1a\node-mongodb\20260326-19-Mongoose_operacjeCrud\JanKowalski\zadanie-1.js'
	Nie wrzucaj katalogu 'node_modules' ani innych zbędnych (zwłaszcza dużych)
		katalogów, tylko same pliki z rozwiązaniami
*/

/*	[ŁATWE - ocena 3] Dodawanie i odczyt uczniów
	Stwórz plik `zadanie-1.js`, który:
	- Łączy się z MongoDB
	- Tworzy model Ucznia
	- Dodaje 3 uczniów za pomocą create()
	- Pobiera wszystkich uczniów za pomocą find()
	- Pobiera jednego ucznia po ID za pomocą findById()
	- Wypisuje wyniki każdej operacji

	Przetestuj dla:
	- Dodanie uczniów: imiona i nazwiska z Twojej klasy
	- Pobieranie: wszystkich i konkretnego ucznia
*/

/*	[ŚREDNIE - ocena 4] Aktualizacja i usuwanie
	Stwórz plik `zadanie-2.js`, który:
	- Łączy się z MongoDB
	- Tworzy model Nauczyciela
	- Dodaje 5 nauczycieli (różne przedmioty)
	- Znajduje nauczycieli konkretnego przedmiotu
	- Aktualizuje nauczyciela (zmiana przedmiotu) za pomocą findByIdAndUpdate()
	- Usuwa jednego nauczyciela za pomocą findByIdAndDelete()
	- Wypisuje liczbę nauczycieli przed i po usunięciu

	Przetestuj dla:
	- Różnych przedmiotów (Matematyka, Polski, Fizyka...)
	- Zmiana przedmiotu i doświadczenia nauczyciela
*/

/*	[TRUDNE - ocena 5] Operacje zaawansowane z filtrowaniem
	Stwórz plik `zadanie-3.js`, który:
	- Łączy się z MongoDB
	- Tworzy model Oceny (uczeń, przedmiot, wartość: 1-6)
	- Dodaje co najmniej 10 ocen dla różnych uczniów i przedmiotów
	- Pobiera oceny konkretnego ucznia: find({ uczen: 'Jan' })
	- Pobiera oceny konkretnego przedmiotu i sortuje: find({ przedmiot: '...' }).sort({ wartosc: -1 })
	- Wykonuje limit() i skip() - strony wyników
	- Aktualizuje wartość oceny bez zmiany reszty dokumentu
	- Usuwa oceny poniżej 2 (niedostateczne)

	Przetestuj dla:
	- 10 różnych kombinacji ocen
	- Filtrowanie po uczniu i przedmiocie
	- Sortowanie od najwyższych do najniższych
*/

/*	[EXPERT - ocena 6] System zarządzania uczniami łączący wszystkie CRUD
	Stwórz plik `zadanie-4.js`, który implementuje kompletny system:
	- Modele: Ucznia, Nauczyciel, Klasa (z relacją do nauczycieli)
	- Funkcja dodajUcznia(dane) - dodaje ucznia, obsługuje błędy
	- Funkcja pobierzUczniowZKlasy(nrKlasy) - avec find()
	- Funkcja aktualizujUcznia(id, dane) - avec findByIdAndUpdate()
	- Funkcja usunUcznia(id) - avec findByIdAndDelete()
	- Funkcja pobierzNajlepszychUczniow(n) - top n uczniów wg średniej
	- Obsługa błędów: duplikaty, brak danych, błędy walidacji
	- Testowanie: wykonaj operacje CREATE, READ, UPDATE, DELETE
		w logicznej kolejności (dodaj, odczytaj, zmień, usuń)

	Przetestuj dla:
	- Dodania 5-10 uczniów z różnych klas
	- Pobierania specificznej klasy
	- Aktualizacji danych ucznia
	- Usunięcia ucznia
	- Znalezienia top 3 uczniów po średniej
*/
// #endregion


// #region podsumowanie
/*	Kluczowe wnioski
	- create() tworzy i zapisuje dokument w jednym kroku
	- find() pobiera wiele dokumentów, findById() - jeden po ID
	- findOne() pobiera pierwszy pasujący dokument
	- updateOne() zmienia dokument, ale nie zwraca go
	- findByIdAndUpdate() zmienia i zwraca zaktualizowany dokument
	- deleteOne() usuwa dokument, ale nie zwraca go
	- findByIdAndDelete() usuwa i zwraca usunięty dokument
	- Wszystkie operacje zwracają Promise'y (obsługuj async/await)
	- Zawsze obsługuj błędy za pomocą try/catch w praktyce
	- Operator $set w update specyfikuje, które pola zmienić
*/

/*	Najczęstsze błędy
	- Brak obsługi błędów przy operacjach asynchronicznych
	- Nieprawidłowe użycie operatorów aktualizacji
	- Niezrozumienie różnicy między find() a findOne()
	- Brak walidacji danych przed zapisaniem
	- Niezrozumienie różnicy między embedding a referencing
*/

/*	Dobre praktyki
	- Używaj async/await dla czytelności kodu
	- Obsługuj błędy każdej operacji bazodanowej
	- Waliduj dane przed zapisem (np. wymagane pola, unikalność)
	- Używaj operatorów aktualizacji zamiast nadpisywania całego dokumentu
	- Testuj każdą operację CRUD osobno
	- Dokumentuj funkcje i modele dla lepszej czytelności
*/

/*	Co dalej?
	- Find() zaawansowany - query operators ($gt, $lt, $in, $regex...)
	- Indeksy - optymalizacja wyszukiwania po częstych polach
	- Agregacje - zaawansowane operacje na zbiorach dokumentów
	- Relacje między kolekcjami - embedding vs referencing
	- Transakcje - operacje wieludokumentowe
*/
// #endregion