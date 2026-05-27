import { getMongooseModel, poleNazwaUnique } from './db.js';

const SzkolaModel = getMongooseModel(
	'szkoly',
	{
		nazwa: poleNazwaUnique
	}
);

export async function szkolaLista() {
	try {
		const wynik = await SzkolaModel.find();
		if (!wynik || wynik.length === 0) {
			const error = new Error(`Nie znaleziono żadnych szkół.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas pobierania:', error.message);
		throw error;
	}
}

export async function szkolaPobierz(id) {
	try {
		const wynik = await SzkolaModel.findById(id);
		if (!wynik) {
			const error = new Error(`Nie znaleziono szkoły o ID ${id}.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas wyszukiwania:', error.message);
		throw error;
	}
}

export async function szkolaZnajdz(pole, wartosc) {
	try {
		const wynik = await SzkolaModel.findOne({ [pole]: wartosc });
		if (!wynik) {
			const error = new Error(`Nie znaleziono szkoły. Pole:${pole}, wartość:${wartosc}.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas wyszukiwania:', error.message);
		throw error;
	}
}

export async function szkolaDodaj(nazwa) {
	try {
		const wynik = await SzkolaModel.findOne({ nazwa });
		if (wynik) {
			const error = new Error(`Szkoła o nazwie '${nazwa}' już istnieje.`);
			error.statusCode = 409; // conflict
			throw error;
		}

		const nowaSzkola = await SzkolaModel.create({ nazwa });

		return nowaSzkola;
	} catch (error) {
		console.log('Błąd podczas dodawania:', error.message);
		throw error;
	}
}
