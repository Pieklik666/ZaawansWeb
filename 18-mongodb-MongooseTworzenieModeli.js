// #region wstep
/*	Cel lekcji
	Nauczysz się tworzyć modele w bazie danych MongoDB za pomocą biblioteki Mongoose.
	Modele to struktury, które definiują, jak wyglądają dane w bazie i jakie reguły muszą spełniać.
	Dzięki modelom Twoja aplikacja będzie mieć porządek i bezpieczeństwo danych.
*/

/*	Co będziesz umieć po tej lekcji
	- Zdefiniować schemat danych za pomocą Mongoose
	- Tworzyć modele na podstawie schematów
	- Używać walidacji i wartości domyślnych
	- Pracować z typami danych w MongoDB
	- Dodawać niestandardowe metody do modeli
	- Zarządzać relacjami między dokumentami
*/
// #endregion


// #region informacje
/*	Czym jest model Mongoose
	Model w Mongoose to konstruktor, który umożliwia czytanie i zapisywanie danych w bazie MongoDB.
	Model jest tworzony na podstawie schematu - opisu struktury dokumentu.
	Każdy dokument w bazie to instancja modelu z określoną strukturą i regułami.
*/

/*	Schemat (Schema) - budowa dokumentu
	Schemat definiuje:
	- Jakie pola zawiera dokument (nazwa, email, wiek itp.)
	- Jakiego typu są te pola (String, Number, Date, Boolean itp.)
	- Które pola są wymagane
	- Jakie są wartości domyślne
	- Jakie reguły muszą spełniać dane (np. email musi być prawidłowy)
	Schemat to Plan budowy domu - określa wszystkie pokoje i ich cechy.
*/

/*	Typy danych dostępne w Mongoose
	String - tekst (np. 'Adam Kowalski')
	Number - liczby (np. 25, 3.14)
	Date - daty (np. new Date())
	Boolean - prawda/fałsz (true, false)
	Array - tablica (np. [1, 2, 3] lub ['jeden', 'dwa'])
	ObjectId - unikalny identyfikator dokumentu
	Mixed - dowolny typ danych
	Decimal128 - liczby z dziesiętną dokładnością
*/

/*	Walidacja danych
	Walidacja to sprawdzenie, czy dane spełniają określone reguły.
	W Mongoose możemy:
	- Wymagać pola (required)
	- Sprawdzać minimalną i maksymalną długość (minlength, maxlength)
	- Sprawdzać wartości liczbowe (min, max)
	- Stworzyć własną funkcję walidacji (custom validation)
	- Sprawdzać format email, URL itp.
*/

/*	Wartości domyślne
	Wartość domyślna to wartość, którą pole otrzymuje automatycznie,
	jeśli podczas tworzenia dokumentu nie podamy wartości.
	Przykład: jeśli data rejestracji domyślnie to dzisiejsza data.
*/
// #endregion


// #region przydatne-funkcje
/*	1. new Schema - tworzymy nowy schemat
	Opis: Schema to szablon dla dokumentu. Definiujemy, jakie pola ma zawierać.
	Składnia: new mongoose.Schema({ pole: typ, ... })

	Przykład: Schemat dla ucznia szkoły
*/
const exempleSchemaPrzydatne1 = () => {

	// Tworzymy schemat dla ucznia
	const uczniowieSchema = new mongoose.Schema({
		imie: String,					// Imię ucznia
		nazwisko: String,				// Nazwisko ucznia
		wiek: Number,					// Wiek ucznia
		aktywny: Boolean				// Czy uczeń aktywnie uczęszcza
	});

	// Wynik: Schemat zawiera 4 pola do przechowywania danych ucznia
};

/*	Zadanie praktyczne 1
	Stwórz schemat dla nauczyciela zawierający:
	- imie (String)
	- przedmiot (String)
	- doswiadczenie (Number - liczba lat)
	- zatrudniony (Boolean)
	Wypisz schemat w konsoli. 
*/

const nauczycieleSchema = new mongoose.Schema({
	imie: String,			
	przedmiot: String,		
	doswiadczenie: Number,			
	zatrudniony: Boolean		
});

/*	2. required - wymagane pola
	Opis: Pole z 'required: true' musi być podane, gdy tworzymy nowy dokument.
	Bez tego pola, dokument się nie zapisze.

	Przykład: Email jest obowiązkowy dla ucznia
*/
const exemplePrzydatne2 = () => {

	const uczniowieSchema = new mongoose.Schema({
		imie: {
			type: String,
			required: true					// To pole jest obowiązkowe
		},
		email: {
			type: String,
			required: true					// Email też musi być podany
		},
		wiek: Number
	});

	// Wynik: Jeśli spróbujemy stworzyć ucznia bez imienia lub emaila - błąd!
};

/*	Zadanie praktyczne 2
	Zmień schemat nauczyciela z poprzedniego zadania, tak aby:
	- 'imie' było wymagane
	- 'przedmiot' było wymagane
	- 'doswiadczenie' miało wartość domyślną 0
	- 'zatrudniony' miało wartość domyślną true
*/
const nauczycieleSchema = new mongoose.Schema({
	imie:{ 
		type:String, 
		required: true
	},			
	przedmiot: {
		type:String,
		required: true
	},		
	doswiadczenie: {
		type:Number,
		default: 0
	},			
	zatrudniony: {
		type:Boolean,
		default: true
	}		
});




/*	3. default - wartość domyślna
	Opis: Jeśli nie podamy wartości dla pola, automatycznie otrzyma wartość domyślną.

	Przykład: Data rejestracji domyślnie to dzisiejsza data
*/
const exemplePrzydatne3 = () => {

	const uczniowieSchema = new mongoose.Schema({
		imie: String,
		dataRejestracji: {
			type: Date,
			default: Date.now				// Domyślnie ustawiana na teraz
		},
		aktywny: {
			type: Boolean,
			default: true					// Domyślnie uczeń jest aktywny
		}
	});

	// Wynik: Nowy uczeń będzie miał aktualną datę rejestracji i będzie aktywny
};

/*	Zadanie praktyczne 3
	Stwórz schemat dla klasy szkoły zawierający:
	- nazwa (String, wymagane)
	- wychowawca (String, wymagane)
	- liczbaUczniow (Number, domyślnie 0)
	- czySalaDostepna (Boolean, domyślnie true)
	- dataZalozenia (Date, domyślnie data dzisiejsza)
*/
// #endregion


const klasySchema = new mongoose.Schema({
	nazwa: {
		type:String,
		required: true
	},
	wychowawca: {
		type:String,
		required: true
	},
	liczbaUczniow:{
		type:Number,
		default: 0
	},
	czySalaDostepna:{
		type:Boolean,
		default: true
	},
	dataZalozenia:{
		type:Date,
		default: Date.now
	}
});











// #region przykłady
/*	Przykład 1: Tworzenie prostego schematu i modelu
	Pokażemy, jak krok po kroku stworzyć schemat i model dla ucznia.
*/
const przyklad1 = () => {

	// Krok 1: Połączenie z bazą (upewnij się, że MongoDB jest uruchomiona)
	// mongoose.connect('mongodb://localhost:27017/szkola');

	// Krok 2: Definiujemy schemat ucznia
	const uczniowieSchema = new mongoose.Schema({
		imie: {
			type: String,
			required: true					// Imię jest obowiązkowe
		},
		nazwisko: {
			type: String,
			required: true					// Nazwisko jest obowiązkowe
		},
		email: {
			type: String,
			required: true					// Email jest obowiązkowy
		},
		wiek: {
			type: Number,
			min: 10,						// Minimum 10 lat
			max: 20							// Maximum 20 lat
		},
		aktywny: {
			type: Boolean,
			default: true					// Domyślnie aktywny
		},
		dataRejestracji: {
			type: Date,
			default: Date.now				// Data dzisiejsza
		}
	});

	// Krok 3: Tworzymy model na podstawie schematu
	const Uczen = mongoose.model('usuarios', uczniowieSchema);
	// 'Uczen' to nazwa modelu (używana w kodzie)
	// 'usuarios' to nazwa kolekcji w bazie (MongoDB automatycznie ją utworzy)

	// Krok 4: Możemy teraz użyć modelu do zapisania danych
	// const nowyUczen = new Uczen({
	// 	imie: 'Anna',
	// 	nazwisko: 'Nowak',
	// 	email: 'anna@szkola.pl',
	// 	wiek: 16
	// });
	// nowyUczen.save();

	// Wynik: W bazie MongoDB powstała kolekcja usuarios z dokumentem ucznia

	return Uczen;
};

/*	Zadanie praktyczne do przykładu 1
	Na podstawie kodu powyżej, zmień schemat aby:
	- dodaj pole 'klasa' (String, wymagane)
	- dodaj pole 'srodekTransportu' (String, domyślnie 'pieszo')
	- zmień max wiek na 22
	Zapisz schemat do zmiennej 'UczenPoprawiony'
*/
const uczenPoprawiony = new mongoose.Schema({
	imie: {
		type: String,
		required: true					// Imię jest obowiązkowe
	},
	nazwisko: {
		type: String,
		required: true					// Nazwisko jest obowiązkowe
	},
	klasa:{
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true					// Email jest obowiązkowy
	},
	srodekTransportu:{
		type: String,
		default: "pieszo"
	},
	wiek: {
		type: Number,
		min: 10,						// Minimum 10 lat
		max: 22							// Maximum 22 lat
	},
	aktywny: {
		type: Boolean,
		default: true					// Domyślnie aktywny
	},
	dataRejestracji: {
		type: Date,
		default: Date.now				// Data dzisiejsza
	}
});






/*	Przykład 2: Schemat z tablicą i obiektami zagnieżdżonymi
	Pokażemy bardziej zaawansowany schemat dla nauczyciela z listą przedmiotów.
*/
const przyklad2 = () => {

	// Definiujemy schemat dla nauczyciela
	const nauczycieleSchema = new mongoose.Schema({
		imie: {
			type: String,
			required: true
		},
		nazwisko: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},

		// Tablica przedmiotów, które naucza
		przedmioty: [
			{
				nazwa: String,				// Nazwa przedmiotu
				poziom: String,				// np. 'podstawowy', 'zaawansowany'
				liczbaGodzin: Number		// Liczba godzin na tydzień
			}
		],

		// Zagnieżdżony obiekt z informacjami o doświadczeniu
		doswiadczenie: {
			lataPracy: {
				type: Number,
				default: 0
			},
			stopienNaukowy: String,			// np. 'licencjat', 'magister'
			specjalizacja: String
		},

		// Czy nauczyciel pracuje pełny etat
		pelnyCzas: {
			type: Boolean,
			default: true
		}
	});

	const Nauczyciel = mongoose.model('nauczyciele', nauczycieleSchema);

	// Wynik: Model ma bardziej skomplikowaną strukturę z tablicami i zagnieżdżonymi obiektami

	return Nauczyciel;
};

/*	Zadanie praktyczne do przykładu 2
	Stwórz schemat dla sali szkolnej zawierający:
	- numer (Number, wymagane)
	- pietro (Number)
	- dostepne (Boolean, domyślnie true)
	- wyposazenie (tablica z polami: nazwa, liczba)
	- pojemnosc (Number, min 10, max 50)
*/

const SaleSchema = new mongoose.Schema({
	numer:{
		type: Number,
		required: true
	},
	pietro: Number,
	dostepne:{
		type: Boolean,
		default: true
	},
	wyposazenie: [
		{
			nazwa: String,
			liczba: Number
		}
	],
	pojemnosc:{
		type:Number,
		min: 10,
		max: 50
	}
});



/*	Przykład 3: Walidacja niestandardowa (custom validation)
	Pokażemy, jak sprawdzić, czy email ma właściwy format.
*/
const przyklad3 = () => {

	const uczniowieSchema = new mongoose.Schema({
		imie: {
			type: String,
			required: true
		},

		email: {
			type: String,
			required: true,

			// Niestandardowa walidacja
			validate: {
				validator: function(wartosc) {
					// Sprawdzamy, czy email zawiera '@' i '.'
					return wartosc.includes('@') && wartosc.includes('.');
				},
				message: 'Email musi zawierać @ i .'	// Komunikat błędu
			}
		},

		wiek: {
			type: Number,
			validate: {
				validator: function(wartosc) {
					// Wiek musi być między 10 a 20
					return wartosc >= 10 && wartosc <= 20;
				},
				message: 'Wiek musi być od 10 do 20 lat'
			}
		}
	});

	const Uczen = mongoose.model('uczniowie', uczniowieSchema);

	// Wynik: Jeśli email nie zawiera '@', zapisanie się nie powiedzie

	return Uczen;
};

/*	Zadanie praktyczne do przykładu 3
	Stwórz schemat dla klasy z walidacją:
	- nazwa: wymagane, string
	- liczbaUczniow: liczba, min 1, max 35, własna walidacja aby być podzielną przez 5
	- rok: liczba, walidacja że rok jest nie wcześniejszy niż 2000
*/
// #endregion


const klasySchema = new mongoose.Schema({
	nazwa:{
		type: String,
		required: true
	},
	liczbaUczniow:{
		type: Number,
		min: 1,
		max: 35,
		validate: {
			validator: function(wartosc){
				return wartosc % 5 === 0;
			}
		}
	},
	rok:{
		type:Number,
		validate: {
			validator: function(wartosc){
				return wartosc>=2000;
			}
		}
	}
});






// #region zadania
/*	ZADANIE 1 [ŁATWE]
	Stwórz schemat dla ucznia z polami:
	- imie (String, wymagane)
	- nazwisko (String, wymagane)
	- email (String, wymagane)
	- numer_indeksu (Number, wymagane)
	- aktywny (Boolean, domyślnie true)

	Następnie utwórz model 'Uczen' z tym schematem.
	Wypisz strukturę w konsoli (użyj console.log).
*/
const zadanie1 = () => {
	// Tutaj napisz swój kod
};


/*	ZADANIE 2 [ŁATWE]
	Stwórz schemat dla przedmiotu szkolnego zawierający:
	- nazwa (String, wymagane)
	- opis (String)
	- liczbaGodzin (Number, min 1, max 10)
	- obowiązkowy (Boolean, domyślnie true)
	- dataDodania (Date, domyślnie dzisiejsza data)

	Utwórz model 'Przedmiot'.
*/
const zadanie2 = () => {
	// Tutaj napisz swój kod
};


/*	ZADANIE 3 [ŚREDNIE]
	Stwórz schemat dla nauczyciela zawierający:
	- imie (String, wymagane)
	- nazwisko (String, wymagane)
	- email (String, wymagane + walidacja czy zawiera '@')
	- Phone (String)
	- lataPracyWszkole (Number, min 0, max 50)
	- przedmioty (Array of Strings - lista przedmiotów, min 1, max 5)
	- dataZatrudnienia (Date, domyślnie dzisiejsza)

	Utwórz model 'Nauczyciel'.
*/
const zadanie3 = () => {
	// Tutaj napisz swój kod
};


/*	ZADANIE 4 [ŚREDNIE]
	Stwórz schemat dla klasy szkolnej zawierający:
	- nazwa (String, wymagane)
	- poziom (String - np. 'I', 'II', Required)
	- liczbaUczniow (Number, walidacja min 10, max 30)
	- wychowawca (String, wymagane)
	- sala (Number)
	- czySalaDostepna (Boolean, domyślnie true)
	- rokAkademicki (String, domyślnie '2024/2025')

	Utwórz model 'Klasa'.
*/
const zadanie4 = () => {
	// Tutaj napisz swój kod
};


/*	ZADANIE 5 [TRUDNE]
	Stwórz schemat dla oceny ucznia zawierający:
	- uczen: ObjectId (referencja do modelu Uczen, wymagane)
	- przedmiot: String (wymagane)
	- wartoscOceny (Number, min 1, max 6)
	- dataWystawienia (Date, domyślnie dzisiejsza)
	- nauczyciel: String (wymagane)
	- uwagi: String
	- wagaOceny (Number, domyślnie 1)

	Walidacja: wartoscOceny musi być między 1 a 6
	wajaOceny musi być między 0.5 a 3

	Utwórz model 'Ocena'.
*/
const zadanie5 = () => {
	// Tutaj napisz swój kod
};


/*	ZADANIE 6 [EXPERT]
	Stwórz zaawansowany schemat dla szkoły zawierający:

	1. Główne pola szkoły:
	   - nazwa (String, wymagane, unikalne)
	   - adres (obiekt zagnieżdżony):
		 * ulica (String, wymagane)
		 * numer (String, wymagane)
		 * miasto (String, wymagane)
		 * kodPocztowy (String, walidacja: 5 cyfr)
	   - telefon (String, wymagane)
	   - email (String, wymagane, walidacja czy zawiera @)

	2. Pola o liczbach:
	   - liczbaUczniow (Number, domyślnie 0)
	   - liczbaNauczycieli (Number, domyślnie 0)
	   - liczbaSal (Number, min 5, max 200)

	3. Tablica klas:
	   - klasy (Array):
		 * nazwa (String)
		 * poziom (String)
		 * liczbaUczniow (Number)

	4. Godziny:
	   - godzinyOtwarcia (String, np. '8:00 - 16:00')
	   - godzinyZamkniecia (String)

	5. Walidacja niestandardowa:
	   - liczbaUczniow nie może być mniejsza niż suma uczniów we wszystkich klasach
	   - kodPocztowy musi mieć dokładnie 5 znaków

	6. Wartość domyślna:
	   - dataZalozenia (Date, domyślnie dzisiejsza)

	Utwórz model 'Szkola'.
	To zadanie wymaga myślenia o strukturze, walidacjach i relacjach między danymi.
*/
const zadanie6 = () => {
	// Tutaj napisz swój kod

	// Podpowiedź: Pamiętaj o zagnieżdżonych obiektach, tablicach i walidacji niestandardowej!
	// Podpowiedź: Funkcja validate może mieć dostęp do całego dokumentu poprzez 'this'
	// Podpowiedź: Do sprawdzenia kodPocztowego użyj wyrażenia regularnego lub .length
};
// #endregion


// #region podsumowanie
/*	Kluczowe punkty z lekcji

	1. Schema i Model
	   Schema to plan/szablon (jak powinny wyglądać dane)
	   Model to konstruktor do pracy z danymi w bazie

	2. Typy danych
	   String, Number, Date, Boolean, Array, ObjectId, Mixed, Decimal128
	   Wybierz odpowiedni typ dla każdego pola

	3. Wymagane pola (required)
	   Bez required: true pole jest opcjonalne
	   Z required: true pole musi być zawsze podane

	4. Wartości domyślne (default)
	   Jeśli nie podasz wartości, pole otrzyma wartość domyślną
	   Np. default: true, default: Date.now, default: 0

	5. Walidacja (validation)
	   Sprawdzenie czy dane spełniają reguły
	   Wbudowana: required, min, max, minlength, maxlength
	   Niestandardowa: validate z funkcją

	6. Tablic i zagnieżdżone obiekty
	   Możesz mieć tablice pól: przedmioty: [{ ... }]
	   I obiekty zagnieżdżone: doswiadczenie: { lataPracy: ... }

	7. Referencje między modelami
	   ObjectId to unikalny identyfikator do powiązania z innymi dokumentami
	   np. uczen: ObjectId (powiązanie do modelu Uczen)

	Wszyscy modelami w Mongoose zaczynają się od schematu!

	Schemat -> Model -> Dane w bazie

	Następne kroki:
	- Nauka zapisywania dokumentów do bazy (save)
	- Wyszukiwanie dokumentów (find, findById)
	- Aktualizacja dokumentów (updateOne, updateMany)
	- Usuwanie dokumentów (deleteOne, deleteMany)
	- Powiązywanie modeli za pomocą referencji (populate)
*/
// #endregion
