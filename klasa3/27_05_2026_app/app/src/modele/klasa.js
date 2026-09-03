import { getMongooseModel, poleNazwaRequired, getForeignKey } from './db.js';

const KlasaModel = getMongooseModel(
	'klasy',
	{
		nazwa: poleNazwaRequired,
		id_szkoly: getForeignKey('szkoly'),
		id_profilu: getForeignKey('profile'),
		id_wychowawcy: getForeignKey('nauczyciele')
	}
);

export async function klasaLista() {
	try {
		const wynik = await KlasaModel.find();
		if (!wynik || wynik.length === 0) {
			const error = new Error(`Nie znaleziono żadnych klas.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas pobierania:', error.message);
		throw error;
	}
}

export async function klasaPobierz(id) {
	try {
		const wynik = await KlasaModel.findById(id);
		if (!wynik) {
			const error = new Error(`Nie znaleziono klasy o ID ${id}.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas wyszukiwania:', error.message);
		throw error;
	}
}

export async function klasaZnajdz(pole, wartosc) {
	try {
		const wynik = await KlasaModel.findOne({ [pole]: wartosc });
		if (!wynik) {
			const error = new Error(`Nie znaleziono klasy. Pole:${pole}, wartość:${wartosc}.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas wyszukiwania:', error.message);
		throw error;
	}
}

export async function klasaDodaj( nazwa,id_szkoly,id_profilu,id_wychowawcy) {
	try {
		const nowaKlasa = await KlasaModel.create({ nazwa,id_szkoly,id_profilu,id_wychowawcy });

		return nowaKlasa;
	} catch (error) {
		console.log('Błąd podczas dodawania:', error.message);
		throw error;
	}
}
