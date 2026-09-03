import {MongoClient} from 'mongodb';
import mongoose from 'mongoose'
import express from 'express';

const app = express();
app.use(express.json());

await mongoose.connect('mongodb://localhost:27017/szkola');

const schemaKlasa = new mongoose.Schema({
    nazwa: String,
    poziom: Number,
    liczbaUczniow: {
        type: Number,
        validate: {
            validator: function (liczbaUczniow) {
                return liczbaUczniow >= 0;
            },
            message: 'liczbaUczniow musi być większa lub równa 0' 
        }
    },
    profil: {
        type: String,
        validate: {
            validator: function (klasa) {
                return ["matematyczny", "programistyczny"].includes(klasa);
            },
            message: 'Klasa musi być z profilu [matematyczny, programistyczny]'
        }
    }
});


const Klasa = mongoose.model('Klasa', schemaKlasa);


app.get('/api/klasy', async (req, res) => {
    try {
        let klasy;
        if (req.body.id){
            klasy = await Klasa.findById(req.body.id)
        }
        else{
            klasy = await Klasy.find();
        }

        res.status(200).json(klasy);
    } catch (blad) {
        res.status(500).json({ blad: blad.message });
    }
});
app.post('/api/klasy', async (req, res) => {
    try {
        const nowaKlasa = await Klasa.create(req.body);
        res.status(201).json(nowaKlasa);
    } catch (blad) {
        res.status(400).json({ blad: blad.message });
    }
});
app.put('/api/klasy', async (req, res) => {
    try {
        const zaktualizowana = await Klasa.findByIdAndUpdate(
            req.body.id,
            req.body,
            { new: true} 
        );
        if (!zaktualizowana) {
            return res.status(404).json({ blad: 'Klasa nie znaleziona' });
        }
        res.status(200).json(zaktualizowana);
    } catch (blad) {
        res.status(400).json({ blad: blad.message });
    }
});
app.delete('/api/klasy', async (req, res) => {
    try {
        const usuniety = await Klasa.findByIdAndDelete(req.body.id);
        if (!usuniety) {
            return res.status(404).json({ blad: 'Klasa nie znaleziona' });
        }
        res.status(200).json({ wiadomosc: 'Klasa usunięta' });
    } catch (blad) {
        res.status(500).json({ blad: blad.message });
    }
});

app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});