import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017';
const dbName = 'szkoly';

export async function szkolyConnect() {
	try {
		await mongoose.connect(`${uri}/${dbName}`);
	} catch (error) {
		console.log('Nie można połączyć się z bazą:', error.message);
		process.exit(1);
	}
}

export async function szkolyDisconnect() {
	await mongoose.disconnect();
}

export function getMongooseModel(nazwa, schemaData) {
	const schema = new mongoose.Schema(schemaData, { timestamps: true });
	return mongoose.model(nazwa, schema);
}

export const emailValidator = {
	validator: function (wartosc) {
		return wartosc.includes('@') && wartosc.includes('.');
	},
	message: 'Email musi zawierać @ i .'
};

export const poleNazwaRequired = {
	type: String,
	required: true
};

export const poleNazwaUnique = {
	type: String,
	unique: true
};

export const poleEmailUnique = {
	type: String,
	unique: true,
	validate: emailValidator
};

export const poleImieRequired = {
	type: String,
	required: true
};

export const poleNazwiskoRequired = {
	type: String,
	required: true
};

export const poleAktywny = {
	type: Boolean,
	default: true
};

export const poleDoswiadczenie = {
	type: Number,
	required: true,
	validate: {
		validator: function (wartosc) {
			return wartosc > 1;
		},
		message: 'Doświadczenie musi być większe niż 1 rok'
	}
};

export const poleWiek = {
	type: Number,
	required: true,
	validate: {
		validator: function (wartosc) {
			// Wiek musi być między 10 a 20
			return wartosc >= 10 && wartosc <= 20;
		},
		message: 'Wiek musi być pomiędzy 10 a 20 lat'
	}
};

export function getForeignKey(ref) {
	return {
		type: mongoose.Schema.Types.ObjectId,
		ref: ref,
		required: true
	};
}
