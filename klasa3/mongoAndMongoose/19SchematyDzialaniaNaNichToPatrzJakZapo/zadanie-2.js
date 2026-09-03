import {MongoClient} from 'mongodb';
import mongoose from 'mongoose'

await mongoose.connect('mongodb://localhost:27017/szkola')


const nauczycielSchema = new mongoose.Schema({
    imie: {
        type: String,
        required: true
    },
    nazwisko: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(wartosc) {
                return wartosc.includes('@');
            },
            message: 'Email musi zawierać @'
        }
    },
    przedmioty:{
        type: [String],
        minlength: 1,
        maxlength: 5
    },
    doswiadczenie: {
        type: Number,
        default: 0
    }
})
const Nauczyciel = mongoose.model('Nauczyciel',nauczycielSchema)

try {

    const nauczyciel1 = await Nauczyciel.create({
        imie: "Marta",
        nazwisko: "Walewska",
        email: "Marta1@email",
        przedmioty: ["Polski", "Angielski"],
        doswiadczenie: 13
    })
    console.log("Dodano: ", nauczyciel1._id)

    const nauczyciel2 = await Nauczyciel.create({
        imie: "Marta",
        nazwisko: "Walewska",
        email: "Marta2@email",
        przedmioty: ["Angielski"],
        doswiadczenie: 1
    })
    console.log("Dodano: ", nauczyciel2._id)

    const nauczyciel3 = await Nauczyciel.create({
        imie: "Marta",
        nazwisko: "Walewska",
        email: "Marta3@email",
        przedmioty: ["Angielski"],
        doswiadczenie: 3
    })
    console.log("Dodano: ", nauczyciel3._id)

    const nauczyciel4 = await Nauczyciel.create({
        imie: "Marta",
        nazwisko: "Walewska",
        email: "Marta4@email",
        przedmioty: ["Polski", "Matematyka", "Angielski"]
        })
        console.log("Dodano: ", nauczyciel4._id)

    const nauczyciel5 = await Nauczyciel.create({
        imie: "Marta",
        nazwisko: "Walewska",
        email: "Marta5@email",
        przedmioty: ["Matematyka"]
    })
    console.log("Dodano: ", nauczyciel5._id)

    


    const wszyscyPrzed = await Nauczyciel.find()
    console.log("Ile nauczycieli: ", wszyscyPrzed.length)



    const nauczycielePolskiego = await Nauczyciel.find({przedmioty: "Polski"});
    console.log('nauczyciele Polskiego:', nauczycielePolskiego.map(n => n.imie + " - " + n.email));


    await Nauczyciel.findByIdAndUpdate(		
        nauczyciel5._id,
		{ $set: { przedmioty: ["Polski"], doswiadczenie: 5 } },
		{ new: false }		// by nie zwracał
    )
    await Nauczyciel.findByIdAndDelete(nauczyciel4._id)

    const wszyscyPo = await Nauczyciel.find()
    console.log("Ile nauczycieli: ", wszyscyPo.length)

} catch (blad) {
    console.log('Błąd:', blad.message)
}