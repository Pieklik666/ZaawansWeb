import express from 'express';
import { szkolyConnect, szkolyDisconnect } from '../modele/db.js';
import { nauczycielLista, nauczycielPobierz, nauczycielZnajdz } from '../modele/nauczyciel.js';

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
	});

export default NauczycielRouter;
