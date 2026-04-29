import mongoose from 'mongoose';

const URI = 'mongodb://localhost:27017/szkola';

async function polaczZBaza() {
	try {
		await mongoose.connect(URI);
		console.log('Połączono z bazą szkola');

		const nauczycieleSchema = new mongoose.Schema({
			imie:{ 
				type:String, 
				required: true
			},			
			przedmiot: {
				type:String,
				required: true
			},		
			doswiadczenie: {
				type:Number,
				default: 0
			},			
			zatrudniony: {
				type:Boolean,
				default: true
			}		
		});

		const Nauczyciel = mongoose.model('usuarios', nauczycieleSchema);
		
		const nowyNauczyciel = new Nauczyciel({
			imie: 'Anna',
			przedmiot: 'Matematyka',
			doswiadczenie: 5,
			zatrudniony: true
		});

		nowyNauczyciel.save();

		console.log(Nauczyciel);

		return Nauczyciel;
		
	} catch (blad) {
		console.log('Nie można połączyć się z bazą:', blad.message);
		process.exit(1);
	}
}

polaczZBaza();
