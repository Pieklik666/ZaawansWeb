import Aplikacja from './aplikacja.js';
import KlasaRouter from './src/routery/klasa-api.js';
import NauczycielRouter from './src/routery/nauczyciel-api.js';
import ProfilRouter from './src/routery/profil-api.js';
import SzkolaRouter from './src/routery/szkola-api.js';
import UczenRouter from './src/routery/uczen-api.js';

Aplikacja
	.get('/', (req, res) => {
		res.status(200).json({ message: 'Witaj w API zarządzania szkołami!' });
	})
	.use('/api/klasy', KlasaRouter)
	.use('/api/nauczyciele', NauczycielRouter)
	.use('/api/profile', ProfilRouter)
	.use('/api/szkoly', SzkolaRouter)
	.use('/api/uczniowie', UczenRouter);

Aplikacja.nasluchuj();
