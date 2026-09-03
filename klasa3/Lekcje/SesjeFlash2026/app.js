import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
// npm install express express-session connect-flash

const PORT = 3000;
const app = express();

app.use(express.urlencoded({extended:true})); // by post obsługiwać

app.set('view engine', 'ejs') // włączenie silnika EJS

app.use(session({
	secret: 'T@jny-Kluc2-D0-52yfr0w@n!@-M!n-32-2n@k!-N@jlep!ej-Wygener0w@ny-L050w000',
	resave: false, // zapisywac sesję przy każdym żądaniu, nawet bez zmian? Zwykle false
	saveUninitialized: true, // zapisywać nową sesję, zanim zostanie zmodyfikowana? Zwykle true
	cookie: {
		maxAge: 1000 * 60 * 30
	}
}))
app.use(flash());

/* Przykładowe użycie sesji i flash messages */
app.get('/', (req, res) => {
	// Ustawienie wartości w sesji
    //req.session.username = 'JanKowalski';
	//req.session.lesson = 'ZaawansowaneWebowe';
    // Ustawienie wiadomości flash
    res.render("layoutBody", {} , (error, contentBody) => {
        if (error) {
            console.log('[generujLayout]błąd renderowania ' + error);
            throw error;
        }
        res.render("layoutMain", {nazwa: "Strona Logowania", body: contentBody, style: "<style>*{background-color: #A9D67B;}</style>"} , (error, contentMain) => {
            if (error) {
                console.log('[generujLayout]błąd renderowania ' + error);
                throw error;
            }
    
            res.write(contentMain);
            res.end()
        });
    });
	//req.flash('info', 'Witamy na stronie głównej!');
	//res.send('Strona główna. Przejdź do /dashboard, aby zobaczyć sesję i wiadomości flash.');
});

app.post('/', (req, res) => {
    req.session.username = req.body.username;
    res.redirect('/dashboard')
})

app.get('/dashboard', (req, res) => {
	// Pobranie wartości z sesji
	const username = req.session.username || 'Gość';
	const lesson = req.session.lesson || 'Matematyka';
	const course = req.session.course || 'Brak';
	// Pobranie wiadomości flash
	const messages = req.flash('info');
	res.send(`Witaj, ${username}!<br>Wiadomości: ${messages.join('<br>')}<br>Lekcja: ${lesson}<br>Kurs: ${course}<br><br><a href="http://localhost:3000/logout">Wyloguj</a>`);
});

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
});

app.listen(PORT, () => {
	console.log(`Serwer działa na porcie ${PORT}`);
});
// Teraz serwer Express obsługuje sesje i wiadomości flash. Przykładowe trasy pokazują, jak ustawiać i pobierać dane z sesji oraz jak korzystać z flash messages.

/* Zadanie 1: Zrobione!
1. Uruchom powyższy kod serwera Express.
2. Otwórz przeglądarkę i przejdź do http://localhost:3000/.
3. Następnie przejdź do http://localhost:3000/dashboard, aby zobaczyć ustawioną wartość sesji i wiadomości flash.
4. Zmodyfikuj kod, aby dodać więcej informacji do sesji i wyświetlić je na stronie dashboard. 
*/

/* Zadanie 2: Zrobione!
1. Dodaj trasę /logout, która usuwa dane sesji i przekierowuje użytkownika z powrotem na stronę główną z wiadomością flash informującą o wylogowaniu.
2. Przetestuj działanie trasy /logout.
*/

/* Zadanie 3: Zrobione!
1. Dodaj formularz logowania na stronie głównej, który pozwala użytkownikowi wprowadzić nazwę użytkownika.
2. Po przesłaniu formularza, zapisz nazwę użytkownika w sesji i przekieruj użytkownika do dashboard.
3. Wyświetl nazwę użytkownika na stronie dashboard.
*/
