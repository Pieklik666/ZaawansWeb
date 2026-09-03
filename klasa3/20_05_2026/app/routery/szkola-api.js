import express from 'express';
import { szkolyConnect, szkolyDisconnect } from '../modele/db.js';
import { szkolaDodaj, szkolaLista, szkolaPobierz, szkolaZnajdz, szkolaAktualizuj, szkolaUsun } from '../modele/szkola.js';

const SzkolaRouter = express.Router();
SzkolaRouter
	.get('/', async (req, res) => {
		try {
			await szkolyConnect();

			const wynik = await szkolaLista();

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

			const wynik = await szkolaPobierz(req.body.id);

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

			const wynik = await szkolaZnajdz(req.body.pole, req.body.wartosc);

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

			const nowyElement = await szkolaDodaj(req.body.nazwa);

			res.status(201).json(nowyElement);
		} catch (error) {
			console.log('Błąd podczas dodawania:', error.message);
			res.status(error.statusCode || 500).json({ message: error.message });
		} finally {
			await szkolyDisconnect();
		}
	});

export default SzkolaRouter;
