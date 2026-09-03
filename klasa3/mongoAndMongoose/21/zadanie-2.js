import {MongoClient} from 'mongodb';
import mongoose from 'mongoose'
import express from 'express';

const app = express();
app.use(express.json());

await mongoose.connect('mongodb://localhost:27017/szkola');

const schemaSala = new mongoose.Schema({
    numer: Number,
    poziom: Number,
    pojemnosc: {
        type: Number,
        validate: {
            validator: function (pojemnosc) {
                return pojemnosc > 0;
            },
            message: 'Pojemność musi być większa niż 0' 
        }
    },
    typSali: {
        type: String,
        validate: {
            validator: function (sala) {
                return ["laboratorium", "komputerowa", "tradycyjna"].includes(sala);
            },
            message: 'Sala musi być z [laboratorium, komputerowa, tradycyjna]'
        }
    }
});

const Sala = mongoose.model('Sala', schemaSala);


app.get('/api/sale', async (req, res) => {
    try {
        let sale;

        if (req.body.typSali){
            sale = await Sala.find({ typSali: req.body.typSali });
        } 
        else if (req.body.id){
            sale = await Sala.findById(req.body.id)
        }
        else{
            sale = await Sala.find();
        }
        res.status(200).json(sale);
    } catch (blad) {
        res.status(500).json({ blad: blad.message });
    }
});
app.post('/api/sale', async (req, res) => {
    try {
        const nowaSala = await Sala.create(req.body);
        res.status(201).json(nowaSala);
    } catch (blad) {
        res.status(400).json({ blad: blad.message });
    }
});
app.put('/api/sale', async (req, res) => {
    try {
        const zaktualizowana = await Sala.findByIdAndUpdate(
            req.body.id,
            req.body,
            { new: true} 
        );
        if (!zaktualizowana) {
            return res.status(404).json({ blad: 'Sala nie znaleziona' });
        }
        res.status(200).json(zaktualizowana);
    } catch (blad) {
        res.status(400).json({ blad: blad.message });
    }
});
app.delete('/api/sale', async (req, res) => {
    try {
        const usuniety = await Sala.findByIdAndDelete(req.body.id);
        if (!usuniety) {
            return res.status(404).json({ blad: 'Sala nie znaleziona' });
        }
        res.status(200).json({ wiadomosc: 'Sala usunięta' });
    } catch (blad) {
        res.status(500).json({ blad: blad.message });
    }
});

app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});