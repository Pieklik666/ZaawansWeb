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