import { getMongooseModel, poleImieRequired, poleNazwiskoRequired, poleEmailUnique, poleAktywny, poleWiek, getForeignKey } from './db.js';

const UczenModel = getMongooseModel(
	'uczniowie',
	{
		imie: poleImieRequired,
		nazwisko: poleNazwiskoRequired,
		email: poleEmailUnique,
		aktywny: poleAktywny,
		wiek: poleWiek,
		id_klasy: getForeignKey('klasy')
	}
);

export async function uczenLista() {
	try {
		const wynik = await UczenModel.find();
		if (!wynik || wynik.length === 0) {
			const error = new Error(`Nie znaleziono żadnych uczniów.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas pobierania:', error.message);
		throw error;
	}
}

export async function uczenPobierz(id) {
	try {
		const wynik = await UczenModel.findById(id);
		if (!wynik) {
			const error = new Error(`Nie znaleziono ucznia o ID ${id}.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas wyszukiwania:', error.message);
		throw error;
	}
}

export async function uczenZnajdz(pole, wartosc) {
	try {
		const wynik = await UczenModel.findOne({ [pole]: wartosc });
		if (!wynik) {
			const error = new Error(`Nie znaleziono ucznia. Pole:${pole}, wartość:${wartosc}.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas wyszukiwania:', error.message);
		throw error;
	}
}
