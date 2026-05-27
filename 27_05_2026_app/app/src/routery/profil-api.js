import express from 'express';
import { szkolyConnect, szkolyDisconnect } from '../modele/db.js';
import { profilLista, profilPobierz, profilZnajdz } from '../modele/profil.js';

const ProfilRouter = express.Router();

ProfilRouter
	.get('/', async (req, res) => {
		try {
			await szkolyConnect();

			const wynik = await profilLista();

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

			const wynik = await profilPobierz(req.body.id);

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

			const wynik = await profilZnajdz(req.body.pole, req.body.wartosc);

			res.json(wynik);
		} catch (error) {
			res.status(error.statusCode || 500).json({ message: error.message });
		} finally {
			await szkolyDisconnect();
		}
	});

export default ProfilRouter;
