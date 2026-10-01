// #region wstęp
/*	Cel lekcji
	W tej lekcji nauczysz się, jak reagować na akcje użytkownika (zdarzenia/eventy)
	np. kliknięcia przycisków, wpisywanie tekstu, wysyłanie formularzy itd.
	React ma własny sposób obsługi zdarzeń, który jest podobny do zwykłego
	JavaScriptu, ale ma kilka ważnych różnic.
*/

/*	Co będziesz umieć po tej lekcji
	- Podłączać obsługę zdarzeń do elementów JSX (onClick, onChange, onSubmit itp.)
	- Rozumieć czym są "syntetyczne zdarzenia" w React
	- Przekazywać argumenty do funkcji obsługi zdarzeń
	- Używać 'e.preventDefault()' do blokowania domyślnych akcji przeglądarki
	- Rozumieć różnicę między funkcjami zwykłymi a strzałkowymi (arrow functions)
		jako handlery
	- Pisać czytelny i poprawny kod obsługi zdarzeń
*/
// #endregion


// #region informacje
/*	Czym jest zdarzenie (event)?
	Zdarzenie to coś, co się dzieje w przeglądarce w wyniku akcji
		użytkownika lub samej przeglądarki.
	Przykłady zdarzeń:
	- kliknięcie przycisku (click)
	- wpisanie tekstu w pole input (change)
	- wysłanie formularza (submit)
	- najechanie myszą na element (mouseover)
	- wciśnięcie klawisza (keydown / keyup)

	W zwykłym HTML piszemy np. (
		<button onclick="zrobCos()">Kliknij</button>
	)

	W React piszemy podobnie, ale z kilkoma różnicami:
	- nazwy zdarzeń piszemy camelCase: onClick, onChange, onSubmit
		(nie onclick, onchange)
	- przekazujemy referencję do funkcji, a nie wywołanie funkcji
	- używamy {} zamiast ""

	W React piszemy np. (
		function zrobCos() { ... }
		return (<button onClick={zrobCos}>Kliknij</button>);
	)
*/

/*	Syntetyczne zdarzenia (Synthetic Events)
	React nie używa bezpośrednio zdarzeń przeglądarki.
	Zamiast tego tworzy własny, ujednolicony obiekt zdarzenia zwany
	"syntetycznym zdarzeniem".

	Dlaczego? Bo różne przeglądarki mogą trochę inaczej obsługiwać
	zdarzenia. React opakowuje natywne zdarzenie i daje Ci zawsze ten
	sam, przewidywalny obiekt.

	Ten obiekt działa dokładnie tak samo jak natywny event - ma te
	same właściwości:
	- e.target - element, który wywołał zdarzenie
	- e.target.value - wartość elementu (np. tekst w inpucie)
	- e.preventDefault() - blokuje domyślną akcję przeglądarki
	- e.stopPropagation() - zatrzymuje propagację zdarzenia w górę
	  drzewa DOM
*/

/*	Przekazywanie funkcji jako handler - ważna zasada
	POPRAWNIE - przekazujemy referencję do funkcji (bez nawiasów):
	jsx (
		<button onClick={handleClick}>Kliknij</button>
	)

	NIEPOPRAWNIE - wywołujemy funkcję natychmiast przy renderowaniu
	(z nawiasami):
	jsx (
		<button onClick={handleClick()}>Kliknij</button>
	)

	Drugi zapis sprawi, że funkcja wykona się od razu podczas
	renderowania strony, a nie dopiero po kliknięciu przycisku!
*/

/*	bind vs funkcja strzałkowa - co to oznacza?
	W starszym Reakcie (z komponentami klasowymi) był problem z 'this'
	Funkcje obsługi zdarzeń traciły kontekst 'this', więc trzeba było używać
	'.bind(this)'

	W nowoczesnym Reakcie z komponentami funkcyjnymi tego problemu
	nie ma. Używamy po prostu funkji strzałkowych lub zwykłych funkcji
	zdefiniowanych wewnątrz komponentu.

	Funkja strzałkowa jako handler - najprostszy sposób:
	jsx (
		<button onClick={() => console.log('kliknięto!')}>Kliknij</button>
	)

	Osobna funkcja handlera - lepiej czytelne przy złożonej logice:
	jsx (
		const handleClick = () => {
			console.log('kliknięto!');
		};
		<button onClick={handleClick}>Kliknij</button>
	)
*/

/*	'e.preventDefault()' - blokowanie domyślnych akcji
	Niektóre elementy HTML mają domyślne zachowanie:
	- formularz po wysłaniu odświeża stronę
	- link <a> po kliknięciu przenosi na nową stronę

	W React (i ogólnie w JS) możemy to zablokować wywołując
	'e.preventDefault()'. Dzięki temu przejmujemy kontrolę nad tym,
	co się dzieje po zdarzeniu.
*/
// #endregion


// #region przydatne_funkcje
// #region onClick - obsługa kliknięcia
//	Uruchamia funkcję, gdy użytkownik kliknie element.

/*	Składnia
	<button onClick={nazwaFunkcji}>Tekst</button>
	<button onClick={() => alert('klik!')}>Tekst</button>
*/

/*	Przykład

	function PrzykładOnClick() {
		const handleClick = () => {
			alert('Kliknąłeś przycisk!');
		};

		return <button onClick={handleClick}>Kliknij mnie</button>;
	}

	// Wynik: po kliknięciu pojawia się okno z tekstem
	// "Kliknąłeś przycisk!"
*/

/*	Zadanie praktyczne
	Stwórz komponent 'LicznikKlikniec', który wyświetla liczbę kliknięć
	przycisku. Użyj useState do przechowywania liczby i onClick do jej
	zwiększania.
*/
// #endregion

// #region onChange - obsługa zmiany wartości
/*	Uruchamia się za każdym razem, gdy zmienia się wartość elementu
	formularza (input, textarea, select). Bardzo często używane razem
	z useState.
*/

/*	Składnia
	<input onChange={nazwaFunkcji} />
	<input onChange={(e) => setValue(e.target.value)} />
*/

/*	Przykład
	import React, { useState } from 'react';

	function PrzykładOnChange() {
		const [tekst, setTekst] = useState('');

		const handleChange = (e) => {
			// e.target.value to aktualna wartość wpisana w input
			setTekst(e.target.value);
		};

		return (
			<div>
				<input
					type="text"
					onChange={handleChange}
					placeholder="Wpisz coś..."
				/>
				<p>Wpisałeś: {tekst}</p>
			</div>
		);
	}

	// Wynik: tekst pod inputem aktualizuje się na bieżąco podczas
	// pisania
*/

/*	Zadanie praktyczne - onChange
	Stwórz komponent z inputem, który wyświetla liczbę wpisanych
	znaków na bieżąco.
*/
// #endregion

// #region onSubmit - obsługa wysłania formularza
/*	Uruchamia się, gdy formularz zostanie wysłany (np. kliknięciem
	przycisku submit lub Enterem). Prawie zawsze używamy razem z
	'e.preventDefault()' aby strona nie odświeżała się.
*/

/*	Przykład
	import React, { useState } from 'react';

	function PrzykładOnSubmit() {
		const [imie, setImie] = useState('');
		const [wiadomosc, setWiadomosc] = useState('');

		const handleSubmit = (e) => {
			e.preventDefault(); // zatrzymujemy odswiezenie strony
			setWiadomosc(`Cześć, ${imie}!`);
		};

		return (
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={imie}
					onChange={(e) => setImie(e.target.value)}
					placeholder="Wpisz swoje imię"
				/>
				<button type="submit">Wyślij</button>
				{wiadomosc && <p>{wiadomosc}</p>}
			</form>
		);
	}

	// Wynik: po wpisaniu imienia i kliknięciu "Wyślij" pojawia się
	// powitanie, a strona NIE odświeża się dzięki 'e.preventDefault()'
*/

/*	Zadanie praktyczne - onSubmit
	Stwórz formularz logowania z polami "login" i "hasło".
	Po wysłaniu wyświetl informację: "Zalogowano jako: [login]".
	Pamiętaj o 'e.preventDefault()'.
*/
// #endregion

// #region onMouseEnter / onMouseLeave - obsługa najechania myszą
//	Przydatne do tworzenia efektów hover kontrolowanych przez React
//	(np. zmiana koloru, podpowiedzi).

/*	Przykład
	import React, { useState } from 'react';

	function PrzykładHover() {
		const [aktywny, setAktywny] = useState(false);

		return (
			<button
				onMouseEnter={() => setAktywny(true)}
				onMouseLeave={() => setAktywny(false)}
				style={{
					backgroundColor: aktywny ? 'blue' : 'gray',
					color: 'white'
				}}
			>
				Najedź na mnie
			</button>
		);
	}

	// Wynik: przycisk zmienia kolor na niebieski gdy myszka jest na
	// nim, i wraca do szarego gdy myszka odjedzie
*/

/*	Zadanie praktyczne
	Stwórz komponent karty ucznia, która po najechaniu myszą pokazuje
	dodatkowe informacje (np. numer telefonu, adres email).
*/
// #endregion

// #region onKeyDown - obsługa klawiatury
//	Przydatne, gdy chcesz reagować na konkretne klawisze
//	(np. Enter, Escape).

/*	Przykład

	function PrzykładKlawiatura() {
		const [wiadomosc, setWiadomosc] = useState('');

		const handleKeyDown = (e) => {
			// e.key to nazwa wciśniętego klawisza
			if (e.key === 'Enter') {
				setWiadomosc('Wcisnąłeś Enter!');
			}
			if (e.key === 'Escape') {
				setWiadomosc('Wcisnąłeś Escape!');
			}
		};

		return (
			<div>
				<input
					onKeyDown={handleKeyDown}
					placeholder="Wciśnij Enter lub Escape"
				/>
				{wiadomosc && <p>{wiadomosc}</p>}
			</div>
		);
	}

	// Wynik: po wciśnięciu Enter lub Escape pojawia się odpowiednia
	// informacja
*/

/*	Zadanie praktyczne
	Rozbuduj poprzedni przykład tak, by wciśnięcie klawisza Escape
	czyściło zawartość inputa.
*/
// #endregion
// #endregion


// #region Przykłady
/*	Przykład 1 - kliknięcie przycisku zmienia wyświetlany tekst.

	function ZmieniajacyTekst() {
		// Stan przechowuje aktualny tekst
		const [tekst, setTekst] = useState('Nie kliknięto jeszcze');

		const handleClick = () => {
			// Aktualizujemy stan po kliknięciu
			setTekst('Kliknięto przycisk!');
		};

		return (
			<div>
				<p>{tekst}</p>
				<button onClick={handleClick}>Kliknij mnie</button>
			</div>
		);
	}

	export default ZmieniajacyTekst;

	// Wynik:
	// Przed kliknięciem: wyświetla "Nie kliknięto jeszcze"
	// Po kliknięciu: wyświetla "Kliknięto przycisk!"
*/

/*	Zadanie do przykładu 1
	Rozbuduj komponent tak, by przycisk działał jak przełącznik
	(toggle):
	- pierwsze kliknięcie zmienia tekst na "Włączone"
	- drugie kliknięcie zmienia tekst z powrotem na "Wyłączone"
	- i tak na przemian
*/


/*	Przykład 2 - Przekazywanie argumentów do handlera
	// Czasem chcemy, żeby jeden handler obsługiwał różne przyciski.
	// Możemy przekazać argument za pomocą funkji strzałkowej.


	function ListaOcen() {
		const [wybrana, setWybrana] = useState(null);

		// Handler przyjmuje ocenę jako argument
		const handleWybor = (ocena) => {
			setWybrana(ocena);
		};

		const oceny = [1, 2, 3, 4, 5, 6];

		return (
			<div>
				{oceny.map((ocena) => (
					// Używamy funkję strzałkową, żeby przekazać argument
					<button key={ocena} onClick={() => handleWybor(ocena)}>
						{ocena}
					</button>
				))}
				{wybrana && <p>Wybrana ocena: {wybrana}</p>}
			</div>
		);
	}

	export default ListaOcen;

	// Wynik: 6 przycisków z ocenami - po kliknięciu wybranej
	// pojawia się informacja "Wybrana ocena: X"
*/

/*	Zadanie do przykładu 2
	Stwórz listę przedmiotów szkolnych jako przyciski.
	Po kliknięciu wybranego przedmiotu wyświetl jego opis (możesz
	wymyślić opisy). Użyj obiektu lub tablicy obiektów z polami:
	nazwa, opis.
*/


/*	Przykład 3 - 'e.preventDefault()' przy formularzu
	// Formularz w systemie szkoły - dodawanie nowego ucznia.


	function DodajUcznia() {
		const [imie, setImie] = useState('');
		const [klasa, setKlasa] = useState('');
		const [lista, setLista] = useState([]);

		const handleSubmit = (e) => {
			e.preventDefault(); // bez tego strona by się odświeżyła!

			if (!imie || !klasa) {
				alert('Wypełnij oba pola!');
				return;
			}

			// Dodajemy nowego ucznia do listy
			// (nie mutujemy starej tablicy!)
			setLista([...lista, { imie, klasa }]);

			// Czyścimy formularz
			setImie('');
			setKlasa('');
		};

		return (
			<div>
				<h2>Dodaj ucznia</h2>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Imię i nazwisko"
						value={imie}
						onChange={(e) => setImie(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Klasa (np. 2A)"
						value={klasa}
						onChange={(e) => setKlasa(e.target.value)}
					/>
					<button type="submit">Dodaj</button>
				</form>

				<h3>Lista uczniów:</h3>
				<ul>
					{lista.map((uczen, index) => (
						<li key={index}>
							{uczen.imie} - klasa {uczen.klasa}
						</li>
					))}
				</ul>
			</div>
		);
	}

	export default DodajUcznia;

	// Wynik: formularz z dwoma polami i przyciskiem.
	// Po wypełnieniu i kliknięciu "Dodaj" - uczeń pojawia się na
	// liście poniżej. Formularz czyści się po dodaniu.
	// Strona nie odświeża się dzięki 'e.preventDefault()'.
*/

/*	Zadanie do przykładu 3
	Rozbuduj formularz o opcję usuwania ucznia z listy.
	Przy każdym uczniu na liście dodaj przycisk "Usuń", który po
	kliknięciu usuwa go z listy. Wskazówka: użyj metody .filter()
	do stworzenia nowej tablicy bez usuniętego elementu.
*/


/*	Przykład 4 - stopPropagation - zatrzymanie propagacji zdarzenia
	// Propagacja (bubbling) oznacza, że zdarzenie "bąbelkuje" w górę
	// drzewa DOM. Klikając element zagnieżdżony, wywołujesz też
	// zdarzenia jego rodziców. stopPropagation() zatrzymuje to
	// zachowanie.


	function PropagacjaZdarzen() {
		const [log, setLog] = useState([]);

		const dodajLog = (tekst) => {
			// Używamy funkcji aktualizującej, żeby mieć zawsze
			// aktualny stan
			setLog((prev) => [...prev, tekst]);
		};

		return (
			<div
				onClick={() => dodajLog('Kliknięto DIV zewnętrzny')}
				style={{ padding: '20px', backgroundColor: '#eee' }}
			>
				<p>Zewnętrzny DIV</p>
				<button
					onClick={(e) => {
						e.stopPropagation();
						// zatrzymujemy propagację - nie dotrze
						// do DIV-a
						dodajLog(
							'Kliknięto przycisk (propagacja zatrzymana)'
						);
					}}
				>
					Przycisk ze stopPropagation
				</button>

				<button
					onClick={() =>
						dodajLog(
							'Kliknięto przycisk (propagacja działa)'
						)
					}
				>
					Przycisk bez stopPropagation
				</button>

				<ul>
					{log.map((wpis, i) => <li key={i}>{wpis}</li>)}
				</ul>
			</div>
		);
	}

	export default PropagacjaZdarzen;

	// Wynik:
	// Kliknięcie pierwszego przycisku: pojawia się tylko
	// "Kliknięto przycisk (propagacja zatrzymana)"
	// Kliknięcie drugiego przycisku: pojawiają sie DWA wpisy:
	//	"Kliknięto przycisk (propagacja działa)"
	//	oraz "Kliknięto DIV zewnętrzny"
*/

/*	Zadanie do przykładu 4
	Stwórz komponent "KartaUcznia" - to div z onClick, który
	wyświetla szczegóły ucznia. Wewnątrz karty umieść przycisk
	"Usuń" z onClick, który usuwa ucznia. Upewnij się, że kliknięcie
	"Usuń" nie wywołuje równocześnie onClick karty.
	Użyj stopPropagation().
*/
// #endregion


// #region zadania
/*	Odpowiedzi do zadań proszę zapisać:
	w formacie 'zadanie-X.js' (X to numer zadania)
	w katalogu:
	'W:\numerKlasy\przedmiot\data-nazwaPlikuBezRozszerzenia\ImieNazwisko\'
	przykład:
	'W:\1a\algorytmy\20260325-10-tabliceJednowymiarowe\JanKowalski\
	zadanie-1.js'
	Nie wrzucaj katalogu 'node_modules' ani innych zbędnych
	(zwłaszcza dużych) katalogów, tylko same pliki z rozwiązaniami
*/

/*	Zadanie 1 - Proste
	(Przycisk zmieniający motyw kolorystyczny)
	Stwórz komponent 'ZmienMotyw', który:
	- wyświetla prostokąt (div) z dowolnym tekstem wewnątrz
	- ma przycisk "Zmień motyw"
	- po kliknięciu przycisku, div zmienia tło z białego na czarne
	  (i odwrotnie)
	- tekst wewnątrz automatycznie zmienia kolor kontrastu
	  (biały na czarnym, czarny na białym)

	Wskazówka: użyj useState do śledzenia, czy motyw jest "jasny"
	czy "ciemny". Użyj obiektu style z właściwościami
	backgroundColor i color.
*/

/*	Zadanie 2 - Proste-Srednie (Kalkulator ocen)
	Stwórz komponent 'KalkulatorOcen', który:
	- posiada input numeryczny do wpisania oceny (1-6)
	- posiada przycisk "Dodaj ocenę"
	- po kliknięciu dodaje ocenę do listy (tablicy w stanie)
	- wyświetla listę wszystkich dodanych ocen
	- wyświetla średnią z dodanych ocen (obliczoną na bieżąco)
	- wczytuje tylko oceny od 1 do 6 (walidacja - jeśli poza
	  zakresem, pokazuje błąd)

	Wskazówka: do obliczenia średniej użyj reduce():
	javascript (
		const srednia = oceny.reduce((suma, o) => suma + o) / oceny.length;
	)
*/

/*	Zadanie 3 - Srednie (Formularz obecności)
	Stwórz komponent 'ListaObecnosci' dla systemu zarządzania szkołą:
	- wyświetl listę uczniów (możesz zdefiniować tablicę z imionami
	  na początku komponentu)
	- przy każdym uczniu wyświetl dwa przyciski: "Obecny"
	  i "Nieobecny"
	- po kliknięciu przycisku zmień status ucznia (zapisz w stanie)
	- wyświetl podsumowanie: ilu uczniów jest obecnych, ilu
	  nieobecnych
	- uczniowie bez zaznaczonego statusu mają status
	  "Nie zaznaczono"

	Wskazówka: przechowuj stan jako obiekt lub tablicę obiektów
	z polami: imie, status.
*/

/*	Zadanie 4 - Srednie (Wyszukiwarka uczniów)
	Stwórz komponent 'WyszukiwarkaUczniow':
	- zdefiniuj tablicę uczniów (co najmniej 10 imion i nazwisk)
	- dodaj input z onChange do filtrowania listy na bieżąco
	  podczas pisania
	- wyświetl tylko tych uczniów, których imię lub nazwisko
	  zawiera wpisany tekst
	- wyszukiwanie ma być niewrażliwe na wielkie/małe litery
	  (użyj .toLowerCase())
	- wyświetl informację ile wyników znaleziono
	- dodaj przycisk "Wyczyść" który czyści input i pokazuje
	  wszystkich uczniów
	- kliknięcie "Wyczyść" ma być obsługiwane przez osobny handler
	  (funkcja zdefiniowana poza JSX)
*/

/*	Zadanie 5 - Trudne (Interaktywny plan lekcji)
	Stwórz komponent 'PlanLekcji':
	- wyświetl tabelę z planem lekcji
	  (min. 3 dni tygodnia, min. 4 godziny lekcyjne)
	- dane planu zdefiniuj jako tablicę obiektów w stanie
	- po kliknięciu w komórkę tabeli - komórka przechodzi w tryb
	  edycji (input zamiast tekstu)
	- po wciśnięciu Enter (onKeyDown) lub kliknięciu poza polem
	  (onBlur) - zmiany są zapisywane
	- po wciśnięciu Escape - anuluj zmiany i wróć do poprzedniej
	  wartości
	- wyróżnij wizualnie komórkę, która jest aktualnie edytowana
	  (np. żółte tło)
	- wyświetl pod tabelą historia zmian (co było przed zmianą,
	  co po zmianie)

	Wskazówka: przechowuj w stanie który element jest edytowany
	(np. { dzien, godzina }). Użyj osobnego stanu na tymczasową
	wartość edytowanej komórki.
*/

/*	Zadanie 6 - Bardzo trudne
	(System oceniania z wieloma zdarzeniami)
	Stwórz rozbudowany komponent 'SystemOceniania' dla szkoły:

	Struktura danych (
		const uczniowie = [
			{ id: 1, imie: 'Anna Kowalska', klasa: '2A' },
			{ id: 2, imie: 'Jan Nowak', klasa: '2A' },
			{ id: 3, imie: 'Maria Wiśniewska', klasa: '2B' },
			// dodaj wiecej...
		];
		const przedmioty = ['Matematyka', 'Polski', 'Fizyka',
		'Historia'];
	)

	Funkcjonalności:
	1. Filtrowanie uczniów po klasie (przyciski z klasami, onClick)
	2. Wyszukiwanie uczniów po imieniu (input z onChange)
	3. Po kliknięciu ucznia (onClick z propagacją) - otwierają się
	   jego szczegóły
	4. W szczegółach ucznia - formularz (onSubmit z preventDefault)
	   do dodawania oceny:
		- select z przedmiotami (onChange)
		- input numeryczny z oceną 1-6 (onChange z walidacją)
		- input z komentarzem (onChange)
		- przycisk "Dodaj ocenę" (submit)
	5. Wyświetl listę ocen ucznia z możliwością usuwania
	   (onClick ze stopPropagation)
	6. Oblicz i wyświetl średnią ocen ucznia z każdego przedmiotu
	7. Przycisk "Zamknij szczegóły" (onClick) - z obsługą Escape
	   (onKeyDown na poziomie dokumentu)

	Technicznie wymagane:
	- useState dla: lista uczniow, aktywny uczen, stan filtra,
	  wartości formularza, błędy walidacji
	- Przynajmniej 5 różnych typów zdarzeń: onClick, onChange,
	  onSubmit, onKeyDown, onBlur
	- e.preventDefault() przy formularzu
	- e.stopPropagation() przy usuwaniu oceny (żeby nie wywołać
	  onClick ucznia)
	- Obsługa błędów walidacji wyświetlana inline (zdefiniowana
	  i od razu przypisana w JSX)
*/
// #endregion


// #region podsumowanie
/*	Najważniejsze informacje z lekcji

	1. Zdarzenia w React piszemy camelCase: onClick, onChange,
	   onSubmit, onKeyDown itd. (nie onclick, onchange jak w HTML)

	2. Przekazujemy referencję do funkcji, nie wywołanie:
		- DOBRZE: onClick={handleClick}
		- ZLE: onClick={handleClick()}	// to wykona się od razu!

	3. Syntetyczne zdarzenia - React opakowuje natywne zdarzenia
	   przeglądarki. Działają tak samo, ale są ujednolicone i działają
	   tak samo we wszystkich przeglądarkach.

	4. Parametr 'e' (event) w handlerze daje dostęp do:
		- e.target - element który wywołał zdarzenie
		- e.target.value - wartość elementu (np. tekst w inpucie)
		- e.preventDefault() - blokuje domyślną akcję
		  (np. przeładowanie strony)
		- e.stopPropagation() - zatrzymuje bąbelkowanie zdarzenia
		  w górę DOM

	5. Przekazywanie argumentów do handlera - używamy funkję
	   strzałkową: onClick={() => handleClick(argument)}

	6. W komponentach funkcyjnych nie ma problemu z 'this'.
	   Możemy używać zwykłych funkcji lub funkji strzałkowych
	   zdefiniowanych wewnątrz komponentu.
*/

/*	Kluczowe zasady i wnioski
	- Zawsze używaj e.preventDefault() przy formularzach, żeby
	  strona się nie odświeżała
	- Używaj stopPropagation() gdy nie chcesz, żeby zdarzenie
	  "wędrowało" do rodziców
	- Jeśli handler ma złożoną logikę - zdefiniuj go jako osobną
	  funkcję (czytelność kodu)
	- Jeśli handler jest prosty i jednolinijkowy - funkja strzałkowa
	  inline (zdefiniowana i od razu przypisana w JSX) jest w porządku
	- Pamiętaj: przekazujesz funkcję, nie wywołujesz jej - bez
	  nawiasów w atribucie!
	- Zdarzenia onBlur i onFocus są przydatne do walidacji
	  formularzy
	- Zdarzenia onMouseEnter/onMouseLeave pozwalają na efekty hover
	  kontrolowane przez React
	- Zdarzenie onKeyDown z e.key === 'Enter' to częsty wzorzec
	  przy polach tekstowych
*/
// #endregion
