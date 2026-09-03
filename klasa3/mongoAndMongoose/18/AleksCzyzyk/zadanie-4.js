const zadanie4 = () => {
    const szkolaSchema = new mongoose.Schema({
        nazwa: {
            type: String,
            required: true,
            unique: true
        },
        adres: {
            ulica: {
                type: String,
                required: true
            },
            numer: {
                type: String,
                required: true
            },
            miasto: {
                type: String,
                required: true
            },
            kodPocztowy: {
                type: String,
                validate: {
                    validator: function(kod){
                        return kod.length==5;
                    },
                    message: 'Kod pocztowy musi mieć 5 cyfr'
                }
            }
        },
        telefon: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            validate: {
                validator: function(email){
                    return email.includes('@');
                },
                message: 'Email musi mieć w sobie @'
            }
        },
        liczbaUczniow: {
            type: Number,
            default: 0,
            validate: {
                validator: function(liczba_uczniow){
                    let suma = 0;

                    for (let i=0; i< this.klasy.length; i++) {
                        suma += this.klasy[i].liczbaUczniow;
                    }
                    return liczba_uczniow >= suma;
                }
            }
        },
        liczbaNauczycieli: {
            type: Number,
            default: 0
        },
        liczbaSal: {
            type: Number,
            min: 5,
            max: 200
        },
        klasy: [{
            nazwa: String,
            poziom: String,
            liczbaUczniow: Number
        }],
        godzinyOtwarcia: {
            type: String
        },
        godzinyZamkniecia: {
            type: String
        },
        dataZalozenia: {
			type: Date,
			default: Date.now
		}

    })
    const szkolamodel = mongoose.model('Szkola', szkolaSchema);
};
