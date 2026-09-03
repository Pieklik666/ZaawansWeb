import express from 'express';
import { szkolyConnect, szkolyDisconnect } from '../modele/db.js';
import { uczenLista, uczenPobierz, uczenZnajdz, uczenDodaj } from '../modele/uczen.js';

const UczenRouter = express.Router();

UczenRouter
	.get('/', async (req, res) => {
		try {
			await szkolyConnect();

			const wynik = await uczenLista();

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

			const wynik = await uczenPobierz(req.body.id);

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

			const wynik = await uczenZnajdz(req.body.pole, req.body.wartosc);

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
					
					if (!req.body.imie || !req.body.nazwisko) {
						const error = new Error(`Pola 'imie' oraz 'nazwisko' są wymagane.`);
						error.statusCode = 400;
						throw error;
					}

					const nowyElement = await uczenDodaj(req.body.imie, req.body.nazwisko, req.body.email, req.body.aktywny, req.body.wiek, req.body.id_klasy);
		
					res.status(201).json(nowyElement);
				} catch (error) {
					console.log('Błąd podczas dodawania:', error.message);
					res.status(error.statusCode || 500).json({ message: error.message });
				} finally {
					await szkolyDisconnect();
				}
			});


export default UczenRouter;
