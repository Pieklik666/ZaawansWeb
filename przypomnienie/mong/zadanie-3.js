/*	ZADANIE 3 [TRUDNE - ocena 5]
	Stwórz schemat dla oceny ucznia zawierający:
	- uczen: ObjectId (referencja do modelu Uczen, wymagane)
	- przedmiot: String (wymagane)
	- wartoscOceny (Number, min 1, max 6)
	- dataWystawienia (Date, domyślnie dzisiejsza)
	- nauczyciel: String (wymagane)
	- uwagi: String
	- wagaOceny (Number, domyślnie 1)

	Walidacja: wartoscOceny musi być między 1 a 6
	wajaOceny musi być między 0.5 a 3

	Utwórz model 'Ocena'.

	PRZYPOMNIENIE:
	ObjectId: uczen: {type: mongoose.Schema.Types.ObjectId, required: true}
	ANALOGIA DO SQL: To klucz obcy (FOREIGN KEY)
*/
const zadanie3 = () => {
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
};