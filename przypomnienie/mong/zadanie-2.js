/*	ZADANIE 2 [ŚREDNIE - ocena 4]
	Stwórz schemat dla nauczyciela zawierający:
	- imie (String, wymagane)
	- nazwisko (String, wymagane)
	- email (String, wymagane + walidacja czy zawiera '@')
	- Phone (String)
	- lataPracyWszkole (Number, min 0, max 50)
	- przedmioty (Array of Strings - lista przedmiotów, min 1, max 5)
	- dataZatrudnienia (Date, domyślnie dzisiejsza)

	Utwórz model 'Nauczyciel'.

	PRZYPOMNIENIE:
	Tablica: przedmioty: {type: [String], minlength: 1, maxlength: 5}
	Custom validation: validate: { validator: function(v) {...} }
*/
const zadanie2 = () => {
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
		Phone: String,
		lataPracyWszkole: {
			type: Number,
			min: 0,
			max: 50
		},
		przedmioty: {
			type: [String],
			minlength: 1,
			maxlength: 5
		},
		dataZatrudnienia: {
			type: Date,
			default: Date.now
		}
	})
	
	const nauczycielmodel = mongoose.model('Nauczyciel',nauczycielSchema)
};