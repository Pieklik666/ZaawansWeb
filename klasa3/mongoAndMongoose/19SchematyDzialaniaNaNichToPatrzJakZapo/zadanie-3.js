import {MongoClient} from 'mongodb';
import mongoose from 'mongoose'

await mongoose.connect('mongodb://localhost:27017/szkola')


const ocenyuczniaSchema = new mongoose.Schema({
    uczen: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    przedmiot: {
        type: String, 
        required: true
    },
    wartoscOceny: {
        type: Number,
        min:1,
        max:6,
        validate: {
            validator: function(ocena){
                return ocena>=1 && ocena <=6;
            },
            message: 'Ocena musi być z przedziału [1,6]'
        }
    },
    dataWystawienia: {
        type: Date,
        default: Date.now
    },
    nauczyciel: {
        type: String,
        required: true
    },
    uwagi: String,
    wagaOceny: {
        type: Number,
        default: 1,
        validate: {
            validator: function(waga){
                return waga>=0.5 && waga<=3;
            },
            message: 'Waga oceny musi być w przedziale [0.5 ; 3]'
        }
    }
    
})
const Ocena = mongoose.model('Ocena',ocenyuczniaSchema)

try {


    


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