const express = require('express');

const app = express()
const PORT = 3000
//coś NIE DZIAŁA
app.use(express.urlencoded({extended:true})); // by post obsługiwać


app
	.set('view engine', 'ejs') // włączenie silnika EJS

	.use('/uzytkownik', (req, res, next) => { // use app middlewere
		console.log('URL:', req.originalUrl)
		next()
	})
	
    .get('/uzytkownik', (req, res) => {
		res.render("layoutUzytkownik", {} , (error, contentBody) => {
			if (error) {
				console.log('[generujLayout]błąd renderowania ' + error);
				throw error;
			}
	
			res.render("layoutMain", {nazwa: "Podawanie Danych", body: contentBody, style: "<style>*{background-color: #A9D67B;}</style>"} , (error, contentMain) => {
				if (error) {
					console.log('[generujLayout]błąd renderowania ' + error);
					throw error;
				}
		
				res.write(contentMain);
				res.end()
			});
		});

    })
    .post('/uzytkownik', (req, res) => {
		res.render("layoutUzytkownikPost", {dane: req.body} , (error, contentBody) => {
			if (error) {
				console.log('[generujLayout]błąd renderowania ' + error);
				throw error;
			}
	
			res.render("layoutMain", {nazwa: "Uzytkownik", body: contentBody, style: "<style>*{background-color: #7FFF00;}</style>"} , (error, contentMain) => {
				if (error) {
					console.log('[generujLayout]błąd renderowania ' + error);
					throw error;
				}
		
				res.write(contentMain);
				res.end()
			});
		});
		
	})
    .listen(PORT, () => {
        console.log("\nSerwer dziala na porcie " + PORT)
    });



