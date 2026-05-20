import {MongoClient} from 'mongodb';
import mongoose from 'mongoose'
import express from 'express';

const app = express();

await mongoose.connect('mongodb://localhost:27017/szkola');

const schemaSala = new mongoose.Schema({
    numer: Number,
    poziom: Number,
    pojemnosc: {
        type: Number,
        validate: {
            validator: function(pojemnosc){
                return pojemnosc>0;
            },
            message: 'Ocena musi być z przedziału [1,6]'
        }
    },
    typSali:{ type:String,
        validate: {
        validator: function(sala){
            return ["laboratorium", "komputerowa", "tradycyjna"].includes(sala);
        },
        message: 'Sala musi być wśród: laboratorium, komputerowa, tradycyjna'
        }
    }
});
const Sala = mongoose.model('Sala', schemaSala);

app.get('/api/Sale', async (req, res) => {
	try {
		const Sala = await Sala.find();
        res.status(200).json(Sala);
	} catch (blad) {
		res.status(500).json({ blad: 'Błąd serwera' });
	}
});

app.get('/api/sale?typSali=laboratorium', async (req, res) => {
	try {
        const Sala1 = await Sala.find({typSali: "Laboratorium"});
        res.status(200).json(Sala1);
	} catch (blad) {
		res.status(500).json({ blad: 'Błąd serwera' });
	}
});

app.get('/api/Sale/:id', async (req, res) => {
	try {
        const Sala1 = await Sala.findById(req.id);
        res.status(200).json(Sala1);
	} catch (blad) {
		res.status(500).json({ blad: 'Błąd serwera' });
	}
});

app.post('/api/Sala', async (req, res) => {
	try {
        const nowySala = await Sala.create(body.req);
        res.status(201).json(nowySala);
	} catch (blad) {
		res.status(500).json({ blad: 'Błąd serwera' });
	}
});

app.put('/api/Sala:id', async (req, res) => {
	try {
        //nie zdążyłem
	} catch (blad) {
		res.status(500).json({ blad: 'Błąd serwera' });
	}
});

app.delete('/api/Sala/:id', async (req, res) => {
    try{
	const usuniety = await Sala.findByIdAndDelete(req.id);
	if (!usuniety) {
		return res.status(404).json({ blad: 'Sala nie znaleziona' });
	}
	res.status(200).json(
		{ wiadomosc: 'Sala usunięta' }
    );
    } catch (blad) {
		res.status(500).json({ blad: 'Błąd serwera' });
	}
});


app.listen(3000, () => {
	console.log('Serwer działa na porcie 3000');
});
