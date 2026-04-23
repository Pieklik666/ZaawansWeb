/*	ZADANIE 4 [EXPERT - ocena 6]
	Stwórz zaawansowany schemat dla szkoły zawierający:
	1. Główne pola szkoły:
		- nazwa (String, wymagane, unikalne)
		- adres (obiekt zagnieżdżony):
			* ulica (String, wymagane)
			* numer (String, wymagane)
			* miasto (String, wymagane)
			* kodPocztowy (String, walidacja: 5 cyfr)
		- telefon (String, wymagane)
        - email (String, wymagane, walidacja czy zawiera @)

	2. Pola o liczbach:
		- liczbaUczniow (Number, domyślnie 0)
		- liczbaNauczycieli (Number, domyślnie 0)
		- liczbaSal (Number, min 5, max 200)

	3. Tablica klas:
		- klasy (Array):
			* nazwa (String)
			* poziom (String)
			* liczbaUczniow (Number)

	4. Godziny:
		- godzinyOtwarcia (String, np. '8:00 - 16:00')
		- godzinyZamkniecia (String)

	5. Walidacja niestandardowa:
		- liczbaUczniow nie może być mniejsza niż suma uczniów we wszystkich klasach
	- kodPocztowy musi mieć dokładnie 5 znaków

	6. Wartość domyślna:
		- dataZalozenia (Date, domyślnie dzisiejsza)

	Utwórz model 'Szkola'.
	To zadanie wymaga myślenia o strukturze, walidacjach i relacjach między danymi.

	ANALOGIA DO SQL:
	unique: true		↔ UNIQUE constraint
	Custom validation	↔ TRIGGER (np. aby sprawdzić sumę uczniów)

	PSQL:
	CREATE TABLE szkoły (
		nazwa VARCHAR(100) NOT NULL UNIQUE,
		liczbaUczniow INT DEFAULT 0,
		...
		CHECK (liczbaUczniow >= 0)
	)
	CREATE TRIGGER sprawdz_uczniow BEFORE UPDATE ON szkoły...
*/
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
            default: 0
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
        klasy: {
            type: {
                nazwa: String,
                poziom: String,
                liczbaUczniow: Number
            }
        },
        godzinyOtwarcia: {
            type: String
        },
        godzinyZamkniecia: String,
    })
    const szkolamodel = mongoose.model('Szkola', szkolaSchema);
};
