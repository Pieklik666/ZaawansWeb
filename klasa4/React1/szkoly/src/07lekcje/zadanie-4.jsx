/*	Zadanie 4 - Średniozaawansowane (zarządzanie stanem i warunkowe renderowanie)
	Stwórz komponent 'ZarzadzaniePlanLekcji', który:
	- Przechowuje w state listę lekcji (tablica obiektów {id, nazwa, czyOdwolana})
	- Startuje z 3 lekcjami: Matematyka, Język Polski, Fizyka (żaden nie jest odwołany)
	- Wyświetla każdą lekcję wraz z:
		a) Jej nazwą
		b) Statusem: "Lekcja odwołana!" (gdy czyOdwolana=true) lub "Lekcja odbywa się" (gdy false)
		 Użyj ternary dla tej części
		c) Przycisk "Odwołaj lekcję" - tylko gdy lekcja NIE jest odwołana (operator &&)
		d) Komunikat "Skontaktuj się z wychowawcą" - tylko gdy lekcja jest odwołana (operator &&)
	- Kliknięcie "Odwołaj lekcję" zmienia stan danej lekcji na czyOdwolana=true
	- Na dole strony wyświetl liczbę odwołanych lekcji tylko gdy co najmniej 1 jest odwołana (operator &&)
*/
import { useState, useEffect } from "react";

function ZarzadzaniePlanLekcji(){
    const [listaLekcje, setListaLekcji] = useState([{id:1, nazwa:"Matematyka", czyOdwolana:false},{id:2, nazwa:"Język Polski", czyOdwolana:false},{id:3, nazwa:"Fizyka", czyOdwolana:false}]);

    const zmianaLekcji = (e) => {
        const idLekcji = e.target.id;
        let noweLekcje = listaLekcje;
        noweLekcje[idLekcji - 1].czyOdwolana = true;
        setListaLekcji(noweLekcje)
        console.log(listaLekcje)
    }
    return (
        <div>
            <br></br>
            {listaLekcje.map((lekcja) => {
                return (<div key={lekcja.id}>
                    {lekcja.nazwa}
                    {lekcja.czyOdwolana
                    ? (<>
                        <p>Lekcja odwołana!</p>
                        <p>Skontaktuj się z wychowawcą</p>
                    </>)
                    : (<>
                        <p>Lekcja odbywa się</p>
                        <button id={lekcja.id} onClick={zmianaLekcji}>Odwołaj lekcje</button>
                    </>)
                    }
                    <br></br>
                </div>)
                })
            }
        </div>
    )
}

export default ZarzadzaniePlanLekcji;