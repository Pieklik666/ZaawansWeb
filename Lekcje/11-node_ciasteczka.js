// #region informacje
/*	WSTEP DO CIASTECZEK W EXPRESS.JS
 *	Ciasteczka (cookies) to małe pliki tekstowe przechowywane w przeglądarce. Można w nich zapisywać informacje o np. preferencjach użytkownika, sesjach logowania itp. W Express.js  możemy łatwo zarządzać ciasteczkami za pomocą 'cookie-parser' (npm install cookie-parser) w middleware: 'app.use(cookieParser())'.
 *
 *	Różnice między ciasteczkami a sesjami:
 *	- Ciasteczka są przechowywane po stronie klienta (w przeglądarce)
 *	- Sesje są przechowywane po stronie serwera
 *	- Ciasteczka mają ograniczenie rozmiaru (~4KB)
 *	- Ciasteczka mogą być łatwo odczytane/zmodyfikowane przez użytkownika
 *	- Sesje są bezpieczniejsze dla wrażliwych danych
 *
 *	Ciasteczka podpisane (signed cookies):
 *	app.use(cookieParser('tajny-klucz-do-podpisywania'));
 *
 *	Ustawienie podpisanego ciasteczka:
 *	res.cookie('userId', '12345', { signed: true });
 *
 *	Odczytanie podpisanego ciasteczka:
 *	const userId = req.signedCookies.userId;
 */
// #endregion

// #region podstawowa konfiguracja
const cookieParser = require('cookie-parser')
const express = require('express')
const PORT = 3000;
const app = express();
const htmlHeader = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Ciasteczka w Express</title>
</head>
<body>`;
const htmlFooter = `
	</body>
</html>`;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// #endregion

// #region ustawienie ciasteczek
app.get('/', (req, res) => {
	form = `<form method=get>Czarne<input type=radio name=theme value=dark>Biale<input type=radio name=theme value=light><input type=submit></form>`
	form2 = `<form method=get>Czarne<input type=radio name=bg value=dark>Biale<input type=radio name=bg value=light><input type=submit></form>`
	html = `${htmlHeader}Strona główna. Ciasteczka zostały ustawione! Przejdź do <a href="/dashboard">dashboard</a>.${htmlFooter}`
	res.cookie('username', 'JanKowalski', {
		maxAge: 1000 * 60 * 30, // 30 minut
		httpOnly: true // niedostępne dla JavaScript (bezpieczeństwo)
	});
	// res.cookie('theme', 'dark', { maxAge: 1000 * 60 * 60 * 24 * 365 }); // 1 rok
	html+=form
	if(req.query.theme=='dark'){
		res.cookie('theme','dark')
	}else(
		res.cookie('theme','light')
	)
	if(req.query.bg=='dark'){
		res.cookie('bg','dark')
	}else(
		res.cookie('bg','light')
	)
	res.send(html);
});
// #endregion

// #region Odczyt ciasteczek
app.get('/dashboard', (req, res) => {
	// Odczytanie ciasteczek
	const username = req.cookies.username || 'Gość';
	const theme = req.cookies.theme || 'light';
	html =`${htmlHeader}
		<h1>Witaj, ${username}!</h1>
		<p>Wybrany motyw: ${theme}</p>
		<p><a href="/cookies">Zobacz wszystkie ciasteczka</a></p>
		<p><a href="/delete-cookie">Usuń ciasteczko username</a></p>`
	
	jezyk=res.cookie('lang')
	if(jezyk){
		html+='Język jest'
		if(jezyk=='pl'){
			html+=' polski'
		}else{
			html+=' angielski'
		}
	}
	html+=`${htmlFooter}`
	res.send(html);
});
// #endregion

// #region Wyświetlenie wszystkich ciasteczek
app.get('/cookies', (req, res) => {
	res.send(`
		${htmlHeader}
		<h1>Wszystkie ciasteczka:</h1>
		<pre>${JSON.stringify(req.cookies, null, 2)}</pre>
		<p><a href="/">Strona główna</a></p>
		${htmlFooter}
	`);
});
// #endregion

// #region Usunięcie ciasteczka
app.get('/delete-cookie', (req, res) => {
	// Usunięcie ciasteczka
	res.clearCookie('username');
	res.send(`${htmlHeader}Ciasteczko "username" zostało usunięte! <a href="/dashboard">Wróć do dashboard</a>${htmlFooter}`);
});

//path /set-language
app.get('/set-language' , (req,res) => {
	s = req.query.lang
	res.cookie('lang',s)
	res.send('Ustawiono język')
});

app.listen(PORT, () => {
	console.log(`Serwer działa na porcie ${PORT}`);
});
// #endregion

// #region Zadania
/* Zadanie 1:
1. Uruchom powyższy kod serwera Express.
2. Otwórz przeglądarkę i przejdź do http://localhost:3000/.
3. Przejdź do /dashboard, aby zobaczyć odczytane ciasteczka.
4. Sprawdź ciasteczka w narzędziach deweloperskich przeglądarki (F12 -> Application/Storage -> Cookies).
5. Przetestuj usuwanie ciasteczka poprzez /delete-cookie.
*/

/* Zadanie 2:
1. Dodaj trasę /set-language, która przyjmuje parametr query string (np. ?lang=pl lub ?lang=en).
2. Zapisz wybrany język w ciasteczku o nazwie 'language'.
3. Na stronie /dashboard wyświetl komunikat w odpowiednim języku na podstawie ciasteczka.
4. Przetestuj przełączanie między językami.
*/

/* Zadanie 3:
1. Utwórz formularz na stronie głównej, który pozwala użytkownikowi wybrać preferowany kolor tła (np. red, blue, green).
2. Po przesłaniu formularza, zapisz wybrany kolor w ciasteczku.
3. Na stronie /dashboard zastosuj wybrany kolor tła na podstawie ciasteczka.
4. Dodaj możliwość resetowania preferencji koloru.
*/

/* Zadanie 4:
1. Zaimplementuj licznik wizyt używając ciasteczek.
2. Przy każdej wizycie na stronie głównej zwiększaj wartość licznika w ciasteczku.
3. Wyświetl informację "To Twoja [X] wizyta na tej stronie".
4. Przetestuj, czy licznik działa poprawnie po odświeżeniu strony.
*/

/* Zadanie 5:
1. Zaimplementuj system zapamiętywania ostatnio odwiedzonych stron (maksymalnie 5).
2. Zapisuj historię odwiedzin w ciasteczku jako JSON.
3. Utwórz trasę /history, która wyświetla listę ostatnio odwiedzonych stron.
4. Upewnij się, że ciasteczko nie przekracza limitów rozmiaru.
*/

/* Zadanie 6 (zaawansowane):
1. Zaimplementuj podpisane ciasteczka do bezpiecznego przechowywania identyfikatora użytkownika.
2. Utwórz prosty system "zapamiętaj mnie" przy logowaniu.
3. Jeśli użytkownik zaznaczy "zapamiętaj mnie", ustaw ciasteczko z długim czasem życia.
4. Automatycznie loguj użytkownika, jeśli ciasteczko istnieje i jest poprawnie podpisane.
*/
// #endregion
