import express from 'express';
import { szkolyConnect, szkolyDisconnect } from '../modele/db.js';
import { nauczycielLista, nauczycielPobierz, nauczycielZnajdz, nauczycielDodaj } from '../modele/nauczyciel.js';

const NauczycielRouter = express.Router();

NauczycielRouter
	.get('/', async (req, res) => {
		try {
			await szkolyConnect();

			const wynik = await nauczycielLista();

			res.json(wynik);
		} catch (error) {
			res.status(error.statusCode || 500).json({ message: error.message });
		} finally {
			await szkolyDisconnect();
		}
	})
	.get('/id/', async (req, res) => {
		try {
			await szkolyConnect();

			const wynik = await nauczycielPobierz(req.body.id);

			res.json(wynik);
		} catch (error) {
			res.status(error.statusCode || 500).json({ message: error.message });
		} finally {
			await szkolyDisconnect();
		}
	})
	.get('/znajdz/', async (req, res) => {
		try {
			await szkolyConnect();

			const wynik = await nauczycielZnajdz(req.body.pole, req.body.wartosc);

			res.json(wynik);
		} catch (error) {
			res.status(error.statusCode || 500).json({ message: error.message });
		} finally {
			await szkolyDisconnect();
		}
	})
	.post('/', async (req, res) => {
					try {
						await szkolyConnect();
			
						const nowyElement = await nauczycielDodaj(req.body.imie, req.body.nazwisko, req.body.email, req.body.aktywny, req.body.doswiadczenie, req.body.id_szkoly);
			
						if (!req.body.imie || !req.body.nazwisko) {
							const error = new Error(`Pola 'imie' oraz 'nazwisko' są wymagane.`);
							error.statusCode = 400;
							throw error;
						}

						res.status(201).json(nowyElement);
					} catch (error) {
						console.log('Błąd podczas dodawania:', error.message);
						res.status(error.statusCode || 500).json({ message: error.message });
					} finally {
						await szkolyDisconnect();
					}
				});

export default NauczycielRouter;
