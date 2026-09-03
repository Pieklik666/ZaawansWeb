import Aplikacja from './aplikacja.js';
import KlasaRouter from './routery/klasa-web.js';
import NauczycielRouter from './routery/nauczyciel-web.js';
import ProfilRouter from './routery/profil-web.js';
import SzkolaRouter from './routery/szkola-web.js';
import UczenRouter from './routery/uczen-web.js';

Aplikacja
	.get('/', (req, res) => {
		res.status(200).json({ message: 'Witaj w API zarządzania szkołami!' });
	})
	.use('/klasy', KlasaRouter)
	.use('/nauczyciele', NauczycielRouter)
	.use('/profile', ProfilRouter)
	.use('/szkoly', SzkolaRouter)
	.use('/uczniowie', UczenRouter);

Aplikacja.nasluchuj();
