import express from 'express';

const app = express()
const PORT = 3000




app.use(express.urlencoded({extended:true})); // by post obsługiwać 

app
	.set('views', './') // określenie miejsca z którego mają być brane szablony
	.set('view engine', 'ejs') // włączenie silnika EJS


    .get('/uzytkownik', (req, res) => {
        res.write('<html><form method="POST">Podaj imie:<input type="text" name="imie"/> </br> Podaj nazwisko:<input type="text" name="nazwisko"/> </br> Podaj login:<input type="text" name="login"/> </br> Podaj miasto:<input type="text" name="miasto"/> <input type="submit"/> </form>')
        res.end()
    })
    .post('/uzytkownik', (req, res) => {
    

		res.render("layoutIndex", req.body, (error, content) => {
			if (error) {
				console.log('[generujLayout]błąd renderowania ' + error);
				throw error;
			}
	
			res.write(content);
		});
		res.end()
    })
    .listen(PORT, () => {
        console.log("\nSerwer dziala na porcie " + PORT)
    });


