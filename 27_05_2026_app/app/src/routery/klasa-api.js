import express from 'express';
import { szkolyConnect, szkolyDisconnect } from '../modele/db.js';
import { klasaLista, klasaPobierz, klasaZnajdz } from '../modele/klasa.js';

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
	});

export default KlasaRouter;
