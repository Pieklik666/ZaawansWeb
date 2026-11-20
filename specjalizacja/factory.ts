// #region Interface i class Spaghetti
Interface PotrawaInterface {
	createPotrawe()
}
Interface SpaghettiInterface implements PotrawaInterface {
	ugotujSpaghetti();
	dodajDodatki();
}
Interface SpaghettiPomidoroweInterface implements SpaghettiInterface {
	dodajPomidory();
}

Interface PizzaInterface implements PotrawaInterface {
	PrzygotujCiasto();
	dodajDodatki();
}
Interface PizzaCarbonaraInterface implements PizzaInterface {
	dodajSalami();
}

class Spaghetti implements SpaghettiInterface {
	createPotrawe() {
		this.ugotujSpaghetti();
		this.dodajDodatki();
	}
	ugotujSpaghetti() {
		// wrzuć makaron do wody i ugotuj
	}
	dodajDodatki() {
		// dodaj jakieś dodatki
	}
}

class SpaghettiPomidorowe implements SpaghettiPomidoroweInterface {
	createPotrawe() {
		this.ugotujSpaghetti();
		this.dodajPomidory();
		this.dodajDodatki();
	}
	dodajPomidory() {
		// dodaj pomidory do potrawy
	}
	dodajDodatki() {
		// posyp parmezanem
	}
}

class SpaghettiCzosnkowe implements SpaghettiCzosnkoweInterface {
	createSpaghetti() {
		this.ugotuj();
		this.dodajCzosnek();
	}
	dodajCzosnek() {
		// dodaj czosnek do potrawy
	}
	dodajDodatki() {
		// połóż na wierzchu listki bazylii
	}
}
// #endregion

// #region SpaghettiFactory
class potrawaFactory {
	getSingleton() {
		// znajdź obiektKlasyJakasKlasa
		return obiektKlasyJakasKlasa;
	}
	createFactory() {
		const factory;
		switch (typPotrawy) {
			case 'pizza':
				factory = this.getSingleton(PizzaFactory);
				break;
			case 'spaghetti':
			default:
				factory = this.getSingleton(SpaghettiFactory);
				break;
		}
		return factory;
	}
	createPotrawa() {
		const factory = this.createFactory(); // pizza || spaghetti
		const potrawa = factory.createPotrawa(); // spaghettiPOmidorowe, czosnkowe, krewektowe
		return potrawa;
	}
}
class SpaghettiFactory extends potrawaFactory {
	createSpaghetti() {
		if (pomidorowe) {
			const potrawa = this.getSingleton(SpaghettiPomidorowe);
			if (potrawa) {
				return potrawa
			}
			potrawa = new SpaghettiPomidorowe();
			// zrób coś dodatkowego z potrawa
			return potrawa;
		} else {
			const potrawa = this.getSingleton(SpaghettiCzosnkowe);
			if (potrawa) {
				return potrawa
			}
			potrawa = new SpaghettiCzosnkowe();
			// zrób coś dodatkowego z potrawa
			return potrawa;
		}
	}
}
// #endregion

// #region Wywołanie SpaghettiFactory
function ugotujPotrawe() {
	const potrawa = SpaghettiFactory.createSpaghetti();
	// obiekt spaghetti może implementowac interface 'SpaghettiPomidoroweInterface'
	// obiekt spaghetti może implementowac interface 'SpaghettiCzosnkoweInterface'
	// obiekt spaghetti może być klasą 'SpaghettiPomidorowe'
	// obiekt spaghetti może być klasą 'SpaghettiCzosnkowe'
	potrawa.ugotuj();
	return potrawa;
}

function dodajDodatki(PotrawaInterface potrawa) {
	potrawa.dodajDodatki();
	return potrawa;
}

const potrawa = ugotujPotrawe();
potrawa.dodajDodatki();
// #endregion
