import express from 'express';
import { szkolyConnect, szkolyDisconnect } from '../modele/db.js';
import { klasaLista, klasaPobierz, klasaZnajdz, klasaDodaj } from '../modele/klasa.js';

const KlasaRouter = express.Router();

KlasaRouter
	.get('/', async (req, res) => {
		try {
			await szkolyConnect();

			const wynik = await klasaLista();

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

			const wynik = await klasaPobierz(req.body.id);

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

			const wynik = await klasaZnajdz(req.body.pole, req.body.wartosc);

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
			
						if (!req.body.nazwa) {
							const error = new Error(`Pole 'nazwa' jest wymagane.`);
							error.statusCode = 400;
							throw error;
						}

						const nowyElement = await klasaDodaj(req.body.nazwa, req.body.id_szkoly, req.body.id_profilu, req.body.id_wychowawcy);
			
						res.status(201).json(nowyElement);
					} catch (error) {
						console.log('Błąd podczas dodawania:', error.message);
						res.status(error.statusCode || 500).json({ message: error.message });
					} finally {
						await szkolyDisconnect();
					}
				});

export default KlasaRouter;
