import express from 'express';
import cors from 'cors';
import session from 'express-session';
import flash from 'express-flash';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;

const Aplikacja = express();

Aplikacja
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

Aplikacja
	.use(express.urlencoded({ extended: true }))
	.use(express.json());

Aplikacja.nasluchuj = () => {
	Aplikacja.listen(PORT, () => {
		console.log(`Serwer działa na porcie ${PORT}`);
	});
};

export default Aplikacja;
