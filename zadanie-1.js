import {MongoClient} from 'mongodb';
import mongoose from 'mongoose'
import express from 'express';

const app = express();

// Połączenie z MongoDB
await mongoose.connect('mongodb://localhost:27017/szkola');

// Schemat i model
const schemaNauczyciel = new mongoose.Schema({
	imie: String,
	nazwisko: String,
	przedmiot: String
});
const Nauczyciel = mongoose.model('Nauczyciel', schemaNauczyciel);

app.get('/api/nauczyciele', async (req, res) => {
	try {
		const nauczyciele = await Nauczyciel.find();
        res.status(200).json(nauczyciele);
	} catch (blad) {
		res.status(500).json({ blad: 'Błąd serwera' });
	}
});

app.get('/api/nauczyciele/:id', async (req, res) => {
	try {
        const nauczyciel1 = await Nauczyciel.findById(req.id);
        res.status(200).json(nauczyciel1);
	} catch (blad) {
		res.status(500).json({ blad: 'Błąd serwera' });
	}
});

app.post('/api/nauczyciele', async (req, res) => {
	try {
        const nowyNauczyciel = await Nauczyciel.create(body.req);
        res.status(201).json(nowyNauczyciel);
	} catch (blad) {
		res.status(500).json({ blad: 'Błąd serwera' });
	}
});

app.delete('/api/nauczyciele/:id', async (req, res) => {
    try{
	const usuniety = await Nauczyciel.findByIdAndDelete(req.id);
	if (!usuniety) {
		return res.status(404).json({ blad: 'Nauczyciel nie znaleziony' });
	}
	res.status(200).json(
		{ wiadomosc: 'Nauczyciel usunięty' }
    );
    } catch (blad) {
		res.status(500).json({ blad: 'Błąd serwera' });
	}
});


app.listen(3000, () => {
	console.log('Serwer działa na porcie 3000');
});
