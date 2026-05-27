import express from 'express';
import { szkolyConnect, szkolyDisconnect } from '../modele/db.js';
import { uczenLista, uczenPobierz, uczenZnajdz } from '../modele/uczen.js';

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
	});

export default UczenRouter;
