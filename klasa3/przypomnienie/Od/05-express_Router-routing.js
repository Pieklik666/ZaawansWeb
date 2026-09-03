import express from 'express';

const app = express();
const port = 3000;

class Uczen {
	/* jakis kod */
}
let listaUczniow; // przechowuje obiekty z uczniami

const routerUczniowie = express.Router();
routerUczniowie
	.get('/list', (req, res) => { // /uczniowie/list
		/* jakis kod */
	});	
app.use('/uczniowie', routerUczniowie);

/* Zadanie 1
Stwórz klasę Uczen, która będzie zawierała id i nazwę (string) i profil (string)
*/

/* Zadanie 2
Stwórz same routingi (bez kodu wewnątrz) dla:
- get /uczniowie/details/:id
- get /uczniowie/add
- post /uczniowie/add
- get /uczniowie/update/:id
- post /uczniowie/update
- get /uczniowie/delete/:id
*/

/* Zadanie 3
Wypełnij routingi kodem
- get /uczniowie/list - wypisz listę uczniów
- get /uczniowie/details/:id - wypisz szczegóły ucznia
- get /uczniowie/add - wypisz formularz dodawania ucznia
- post /uczniowie/add - stwórz obiekt na bazie klasy Uczen z przesłanymi danymi i dodaj do listaUczniow
- get /uczniowie/update/:id - wypisz formularz aktualizacji ucznia
- post /uczniowie/update - zaktualizuj wybranego ucznia
- get /uczniowie/delete/:id - usun ucznia z listaUczniow
*/
