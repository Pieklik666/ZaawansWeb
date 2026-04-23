/*	ZADANIE 1 [ŁATWE - ocena 3]
	Stwórz schemat dla ucznia z polami:
	- imie (String, wymagane)
	- nazwisko (String, wymagane)
	- email (String, wymagane)
	- numer_indeksu (Number, wymagane)
	- aktywny (Boolean, domyślnie true)

	Następnie utwórz model 'Uczen' z tym schematem.
	Wypisz strukturę w konsoli (użyj console.log).

	PRZYPOMNIENIE:
	required: true	↔ NOT NULL w SQL
	default: true	↔ DEFAULT TRUE w SQL
*/
const zadanie1 = () => {
	const uczenSchema = new mongoose.Schema({
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
            required: true
        },
        numer_indeksu: {
            type: Number,
            required: true
        },
        aktywny: {
            type: Boolean,
            default: true
        }
    })

    const uczenModel = mongoose.model('Uczen',uczenSchema);
    console.log(uczenModel)
};