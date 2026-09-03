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