import { getMongooseModel, poleNazwaUnique } from './db.js';

const ProfilModel = getMongooseModel(
	'profile',
	{
		nazwa: poleNazwaUnique
	}
);

export async function profilLista() {
	try {
		const wynik = await ProfilModel.find();
		if (!wynik || wynik.length === 0) {
			const error = new Error(`Nie znaleziono żadnych profili.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas pobierania:', error.message);
		throw error;
	}
}

export async function profilPobierz(id) {
	try {
		const wynik = await ProfilModel.findById(id);
		if (!wynik) {
			const error = new Error(`Nie znaleziono profilu o ID ${id}.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas wyszukiwania:', error.message);
		throw error;
	}
}

export async function profilZnajdz(pole, wartosc) {
	try {
		const wynik = await ProfilModel.findOne({ [pole]: wartosc });
		if (!wynik) {
			const error = new Error(`Nie znaleziono profilu. Pole:${pole}, wartość:${wartosc}.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas wyszukiwania:', error.message);
		throw error;
	}
}
