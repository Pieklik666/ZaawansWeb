import express from 'express';
import cors from 'cors';
import session from 'express-session';
import flash from 'express-flash';
import path from 'path';
import { fileURLToPath } from 'url';
import KlasaRouter from './routery/klasa-api.js';
import NauczycielRouter from './routery/nauczyciel-api.js';
import ProfilRouter from './routery/profil-api.js';
import SzkolaRouter from './routery/szkola-api.js';
import UczenRouter from './routery/uczen-api.js';

const PORT = 3000;

const app = express();

app
	.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')))
	.use(session({
		secret: 'T@jny-Kluc2-D0-52yfr0w@n!@-M!n-32-2n@k!-N@jlep!ej-Wygener0w@ny-L050w0',
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 365
		}
	}))
	.use(flash())
	.set('views', './layout/')
	.set('view engine', 'ejs')
	.use(cors({ origin: ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:4202'] }));

app
	.use(express.urlencoded({ extended: true }))
	.use(express.json());

app
	.get('/', (req, res) => {
		res.status(200).json({ message: 'Witaj w API zarządzania szkołami!' });
	})
	.use('/klasy', KlasaRouter)
	.use('/nauczyciele', NauczycielRouter)
	.use('/profile', ProfilRouter)
	.use('/szkoly', SzkolaRouter)
	.use('/uczniowie', UczenRouter);

app.listen(PORT, () => {
	console.log(`Serwer działa na porcie ${PORT}`);
});
