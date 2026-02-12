// #region wstep
/*	MONGODB - WPROWADZENIE

	Cel lekcji:
	Poznasz MongoDB - nowoczesną bazę danych typu NoSQL.
	Dowiesz się, czym różni się od tradycyjnych baz danych SQL.
	Nauczysz się instalować MongoDB i wykonywać podstawowe operacje na danych.
	Po tej lekcji będziesz potrafił tworzyć, czytać, aktualizować i usuwać dokumenty w MongoDB.
*/
// #endregion wstep

// #region informacje
/*
	WAŻNE POJĘCIA

	1. Co to jest MongoDB?
		MongoDB to baza danych NoSQL (Not Only SQL), która przechowuje dane w formacie JSON.
		Zamiast tradycyjnych tabel, MongoDB używa kolekcji i dokumentów.

	2. Różnice między MongoDB a SQL:
		SQL:
		- Dane organizowane w tabelach z kolumnami i wierszami
		- Sztywna struktura (schemat)
		- Przykład: tabela "użytkownicy" z kolumnami: id, imię, email

		MongoDB:
		- Dane organizowane w dokumentach (JSON-like)
		- Elastyczna struktura (bez wymuszonego schematu)
		- Każdy dokument może mieć różne pola

	3. Podstawowe terminy MongoDB:
		- Database (Baza danych) - kontener dla kolekcji
		- Collection (Kolekcja) - grupa dokumentów (podobnie jak tabela w SQL)
		- Document (Dokument) - pojedynczy rekord w formacie JSON
		- Field (Pole) - klucz-wartość w dokumencie
		- _id (identyfikator) - unikatowy klucz dla każdego dokumentu

	4. Format dokumentu MongoDB:
		{
			"_id": ObjectId("507f1f77bcf86cd799439011"),
			"imie": "Jan",
			"nazwisko": "Kowalski",
			"email": "jan@example.com",
			"wiek": 25,
			"aktywny": true,
			"tagi": ["javascript", "mongodb"],
			"adres": {
				"ulica": "Główna 10",
				"miasto": "Warszawa"
			}
		}
*/
// #endregion informacje

// #region przydatne_funkcje
/*
	PRZYDATNE FUNKCJE I KOMENDY MONGODB

	1. Połączenie z bazą danych:
		const { MongoClient } = require('mongodb');
		const uri = "mongodb://localhost:27017";
		const client = new MongoClient(uri);

	2. Podstawowe operacje CRUD:

		CREATE (Tworzenie):
		- insertOne(dokument) - wstawia jeden dokument
		- insertMany([dokumenty]) - wstawia wiele dokumentów

		READ (Czytanie):
		- findOne(warunek) - znajdzie pierwszy dokument spełniający warunek
		- find(warunek) - znajdzie wszystkie dokumenty spełniające warunek
		- find({}).toArray() - pobierze wszystkie dokumenty jako tablicę

		UPDATE (Aktualizacja):
		- updateOne(warunek, {$set: nowe_dane}) - aktualizuje jeden dokument
		- updateMany(warunek, {$set: nowe_dane}) - aktualizuje wiele dokumentów
		- replaceOne(warunek, nowy_dokument) - zamienia cały dokument

		DELETE (Usuwanie):
		- deleteOne(warunek) - usuwa jeden dokument
		- deleteMany(warunek) - usuwa wiele dokumentów

	3. Operatory filtrowania:
		- { pole: wartość } - równość
		- { pole: { $gt: 25 } } - większe niż (greater than)
		- { pole: { $lt: 30 } } - mniejsze niż (less than)
		- { pole: { $in: [wartość1, wartość2] } } - zawiera się w liście
		- { pole: { $exists: true } } - pole istnieje

	4. Metody pomocnicze:
		- collection.countDocuments() - liczy dokumenty
		- collection.deleteCollection() - usuwa całą kolekcję
		- client.close() - zamyka połączenie
*/
// #endregion przydatne_funkcje

// #region Instalacja i konfiguracja
/*	INSTALACJA I KONFIGURACJA MONGODB

	1. Pobranie i instalacja MongoDB:
		- Wejdź na stronę: https://www.mongodb.com/try/download/community
		- Pobierz wersję odpowiednią dla Twojego systemu operacyjnego
		- Zainstaluj MongoDB, postępując zgodnie z instrukcjami instalatora

	2. Uruchomienie serwera MongoDB:
		- Po instalacji, uruchom serwer MongoDB (mongod)
		- Domyślnie serwer nasłuchuje na porcie 27017

	3. Połączenie z MongoDB:
		- Możesz użyć terminala (mongo shell) lub narzędzia graficznego (MongoDB Compass)
		- W terminalu wpisz: mongo --host localhost --port 27017
		- W MongoDB Compass, dodaj nowy połączenie z adresem: mongodb://localhost:27017

	4. Tworzenie bazy danych i kolekcji:
		- W terminalu: use nazwa_bazy (np. use lekcja_mongodb)
		- Tworzenie kolekcji: db.createCollection("nazwa_kolekcji") (np. db.createCollection("studenci"))
		- Możesz też od razu wstawiać dokumenty, a kolekcja zostanie utworzona automatycznie: db.studenci.insertOne({ imie: "Jan", nazwisko: "Kowalski" })
*/
// #endregion

// #region przyklady
/*
	GOTOWE PRZYKŁADY

	Poniżej znajdują się wszystkie przykłady w praktycznym kodzie Node.js
	Upewnij się, że masz zainstalowany MongoDB i driver:
	npm install mongodb
*/

// Przykład 1: Połączenie z bazą danych i tworzenie dokumentu
async function przyklad1_polaczenie_i_tworzenie() {
	const { MongoClient } = require('mongodb');
	const uri = "mongodb://localhost:27017";
	const client = new MongoClient(uri);

	try {
		await client.connect();
		const database = client.db("lekcja_mongodb");
		const collection = database.collection("studenci");

		// Tworzenie dokumentu
		const nowyStudent = {
			imie: "Anna",
			nazwisko: "Nowak",
			indeks: 12345,
			semestr: 2
		};

		const wynik = await collection.insertOne(nowyStudent);
		console.log("Dokument dodany z ID:", wynik.insertedId);

	} finally {
		await client.close();
	}
}

// Przykład 2: Czytanie dokumentów (find)
async function przyklad2_czytanie() {
	const { MongoClient } = require('mongodb');
	const client = new MongoClient("mongodb://localhost:27017");

	try {
		await client.connect();
		const collection = client.db("lekcja_mongodb").collection("studenci");

		// Pobierz wszystkich studentów
		const wszyscy = await collection.find({}).toArray();
		console.log("Wszyscy studenci:", wszyscy);

		// Pobierz studenta z konkretnym imieniem
		const anna = await collection.findOne({ imie: "Anna" });
		console.log("Student o imieniu Anna:", anna);

		// Pobierz studentów z semestru drugiego
		const semestr2 = await collection.find({ semestr: 2 }).toArray();
		console.log("Studenci semestru 2:", semestr2);

	} finally {
		await client.close();
	}
}

// Przykład 3: Aktualizacja dokumentu
async function przyklad3_aktualizacja() {
	const { MongoClient } = require('mongodb');
	const client = new MongoClient("mongodb://localhost:27017");

	try {
		await client.connect();
		const collection = client.db("lekcja_mongodb").collection("studenci");

		// Aktualizuj semestr dla Anny
		const wynik = await collection.updateOne(
			{ imie: "Anna" },
			{ $set: { semestr: 3 } }
		);

		console.log("Zmodyfikowanych dokumentów:", wynik.modifiedCount);

	} finally {
		await client.close();
	}
}

// Przykład 4: Usuwanie dokumentu
async function przyklad4_usuwanie() {
	const { MongoClient } = require('mongodb');
	const client = new MongoClient("mongodb://localhost:27017");

	try {
		await client.connect();
		const collection = client.db("lekcja_mongodb").collection("studenci");

		// Usuń studenta o nazwisku Nowak
		const wynik = await collection.deleteOne({ nazwisko: "Nowak" });

		console.log("Usunięto dokumentów:", wynik.deletedCount);

	} finally {
		await client.close();
	}
}

// Przykład 5: Zaawansowane filtrowanie
async function przyklad5_filtrowanie() {
	const { MongoClient } = require('mongodb');
	const client = new MongoClient("mongodb://localhost:27017");

	try {
		await client.connect();
		const collection = client.db("lekcja_mongodb").collection("studenci");

		// Filtrowanie - studenci na semestrze wyższym niż 1
		const wynikiGT = await collection.find({ semestr: { $gt: 1 } }).toArray();
		console.log("Studenci na wyższych semestrach:", wynikiGT);

		// Filtrowanie - studenci z semestru 2 lub 3
		const wyniki_in = await collection.find({ semestr: { $in: [2, 3] } }).toArray();
		console.log("Studenci z semestru 2 lub 3:", wyniki_in);

	} finally {
		await client.close();
	}
}

// #endregion przyklady

// #region zadania
/*
	ZADANIA PRAKTYCZNE

	ZADANIE 1 (ŁATWE): Konekcja i tworzenie
	Napisz program, który:
	- Połączy się z MongoDB
	- Utworzy nowy dokument w kolekcji "produkty"
	- Dokument powinien zawierać: nazwa, cena, zapas (liczba)
	- Wyswietli ID dodanego dokumentu

	ZADANIE 2 (ŁATWE): Czytanie danych
	Mając kolekcję "produkty" z produktami, napisz kod, który:
	- Pobierze wszystkie produkty
	- Pobierze produkty droższsze niż 100 zł
	- Wyświetli liczbę wszystkich produktów

	ZADANIE 3 (ŚREDNIE): CRUD w praktyce
	Utwórz kompletny program zarządzania TODO-listą:
	- Dodawanie nowego TODO (tytuł, opis, wykonane: false)
	- Wyświetlanie wszystkich TODO
	- Oznaczanie TODO jako wykonane (update)
	- Usuwanie wykonanego TODO

	ZADANIE 4 (ŚREDNIE): Filtrowanie zaawansowane
	Baza danych zawiera pracowników z polami: imie, nazwisko, pensja, dział.
	Napisz funkcje do:
	- Znalezienia pracowników otrzymujących pensję między 3000 a 5000 zł
	- Znalezienia pracowników z określonego działu
	- Aktualizacji pensji dla wszystkich pracowników z danego działu (podwyżka 10%)

	ZADANIE 5 (TRUDNE): Projekt aplikacji
	Stwórz aplikację do zarządzania biblioteką:
	1. Kolekcja "ksiazki" z polami: tytuł, autor, rok, dostępna (boolean)
	2. Funkcja do dodania nowej książki
	3. Funkcja do wyszukania dostępnych książek po autorze
	4. Funkcja do wypożyczenia książki (zmiana dostępna na false)
	5. Funkcja do zwrotu książki (zmiana dostępna na true)
	6. Funkcja wyświetlająca statystyki (całkowita liczba, dostępne, wypożyczone)
*/
// #endregion zadania

// #region podsumowanie
/*
	PODSUMOWANIE

	Co nauczyłeś się w tej lekcji:

	MongoDB to nowoczesna baza danych NoSQL przechowująca dane w formacie JSON

	Główne różnice od SQL:
		- Elastyczny schemat (dokumenty mogą mieć różne struktury)
		- Dokumenty zamiast wierszy
		- Kolekcje zamiast tabel

	Cztery zasadnicze operacje (CRUD):
		- CREATE: insertOne(), insertMany()
		- READ: find(), findOne()
		- UPDATE: updateOne(), updateMany()
		- DELETE: deleteOne(), deleteMany()

	Filtrowanie danych za pomocą operatorów:
		- $gt, $lt - porównania
		- $in - zawieranie się w liście
		- $exists - sprawdzenie istnienia pola

	Struktura dokumentu MongoDB:
		- Dokumenty zawierają pole _id (unikalny identyfikator)
		- Mogą zawierać obiekty zagnieżdżone
		- Mogą zawierać tablice

	NASTĘPNE KROKI:
	- Zainstaluj MongoDB Community Edition
	- Zainstaluj MongoDB Compass (GUI do MongoDB)
	- Praktykuj pisanie zapytań
	- Przejdź do zaawansowanych operacji (agregacje, indeksy)

	PRZYDATNE ZASOBY:
	- https://docs.mongodb.com/ - oficjalna dokumentacja
	- https://www.mongodb.com/try/download/community - pobranie MongoDB
	- MongoDB Compass - graficzny interfejs do bazy danych
*/
// #endregion podsumowanie