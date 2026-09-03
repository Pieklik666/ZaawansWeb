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