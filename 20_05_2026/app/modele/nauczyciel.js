import { getMongooseModel, poleImieRequired, poleNazwiskoRequired, poleEmailUnique, poleAktywny, poleDoswiadczenie, getForeignKey } from './db.js';

const NauczycielModel = getMongooseModel(
	'nauczyciele',
	{
		imie: poleImieRequired,
		nazwisko: poleNazwiskoRequired,
		email: poleEmailUnique,
		aktywny: poleAktywny,
		doswiadczenie: poleDoswiadczenie,
		id_szkoly: getForeignKey('szkoly')
	}
);

export async function nauczycielLista() {
	try {
		const wynik = await NauczycielModel.find();
		if (!wynik || wynik.length === 0) {
			const error = new Error(`Nie znaleziono żadnych nauczycieli.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas pobierania:', error.message);
		throw error;
	}
}

export async function nauczycielPobierz(id) {
	try {
		const wynik = await NauczycielModel.findById(id);
		if (!wynik) {
			const error = new Error(`Nie znaleziono nauczyciela o ID ${id}.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas wyszukiwania:', error.message);
		throw error;
	}
}

export async function nauczycielZnajdz(pole, wartosc) {
	try {
		const wynik = await NauczycielModel.findOne({ [pole]: wartosc });
		if (!wynik) {
			const error = new Error(`Nie znaleziono nauczyciela. Pole:${pole}, wartość:${wartosc}.`);
			error.statusCode = 404;
			throw error;
		}

		return wynik;
	} catch (error) {
		console.log('Błąd podczas wyszukiwania:', error.message);
		throw error;
	}
}
