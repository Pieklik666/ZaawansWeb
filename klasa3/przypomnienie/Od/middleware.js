import express from 'express';

let app = express();
app.use(express.json()); // format JSON
app.use(express.urlencoded({ extended: true })); // formularze post
app.use(express.static('public')); // pliki statyczne
app.use((request, response, next) => {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});
app.use((request, response, next) => {
	console.log(`${request.method} ${request.url}`);
	next();
});

/* Zadanie 1:
Utwórz middleware, który będzie dodawał timestamp do każdego żądania
Dodaj właściwość request.timestamp z aktualną datą
*/

/* Zadanie 2:
Utwórz middleware, który będzie zliczał liczbę żądań
Użyj zmiennej globalnej requestCount i zwiększaj ją przy każdym żądaniu
*/

/* Zadanie 3:
Utwórz middleware, który będzie dodawał niestandardowy nagłówek X-Powered-By: "MyApp"
do każdej odpowiedzi
*/
