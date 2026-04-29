import bcrypt from 'bcrypt';

// Hashowanie hasła (przy rejestracji)
const haslo_zwykłe = 'ZbrojUczeń2024!';
const haslo_zahashowane = await bcrypt.hash(haslo_zwykłe, 10);

// Weryfikacja (przy logowaniu)
const czy_zgodne = await bcrypt.compare('ZbrojUczeń2023!', haslo_zahashowane);
console.log(czy_zgodne);
// Wynik: true







import jwt from 'jsonwebtoken';

const klucz_tajny = 'mojamojaTajnaZmienna12321';

// Tworzenie tokena (przy logowaniu)
const token = jwt.sign(
	{
		id_uzytkownika: '123abc',
		rola: 'admin'
	},
	klucz_tajny,
	{ expiresIn: '1h' }
);

// Weryfikacja tokena (przy każdym żądaniu)
try {
	const odkodowany = jwt.verify(token, klucz_tajny);
	console.log(odkodowany.rola);
} catch (blad) {
	console.log('Token nieważny lub wygasł');
}
    






//Middleware funkcja do sprawdzania
const sprawdzToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ blad: 'Brak tokena' });

    try {
        req.uzytkownik = jwt.verify(token, klucz_tajny);
        if (req.uzytkownik.rola!="nauczyciel") return res.status(403).json({ blad: 'Brak potrzebnej roli nauczyciel' });

        next();
    } catch {
        return res.status(403).json({ blad: 'Token nieważny' });
    }
};



// Żądanie:
// GET /api/uczniowie
// Headers: Authorization: Bearer
// eyJ0eXAiOiJKV1QiLjsjLCJhbGciOiJIUzI1NiJ9...






import express from 'express';

const app = express();
	const baza_url = 'mongodb://localhost:27017';

	app.use(express.json());


 //app get na potrzeby testowania trzeba zrobić...
 

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
    app.listen(3000);
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