import {MongoClient} from 'mongodb';
import mongoose from 'mongoose'


await mongoose.connect('mongodb://localhost:27017/szkola')

const schemnatauczen = new mongoose.Schema({
    imie:		String,
    nazwisko:	String,
    email:		{
        type:		String,
        required:	true,
        unique:		true	
    }
})
const Uczen = mongoose.model('uczniowie', schemnatauczen)

try {
    const uczen1 = await Uczen.create({
        imie: 'Marcin',
        nazwisko: 'Kowalski',
        email: 'ToJest2@email'
    })
    console.log('Dodano:', uczen1._id)

    const uczen2 = await Uczen.create({
        imie: 'Robert',
        nazwisko: 'Papaj',
        email: 'Rob2@edu.pl'
    })
    console.log('Dodano:', uczen2._id)

    const uczen3 = await Uczen.create({
        imie: 'Janek',
        nazwisko: 'Kowalski',
        email: 'janek2@szk.pl'
    })
    console.log('Dodano:', uczen3._id)



const uczniowie = await Uczen.find();
console.log('Uczniowie:', uczniowie.map(u => u.imie));

const pierwszy = await Uczen.findById(uczen1._id);
console.log('Znaleziony:', pierwszy.imie, pierwszy._id);










} catch (blad) {
    console.log('Błąd:', blad.message)
}