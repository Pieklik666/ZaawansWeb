import express from 'express';

const app = express()
const PORT = 3000

app
	// MW: Brak '.use(express.urlencoded({ extended: true }))' do obsługi formularzy
	.get('/', (req, res) => {
		// MW: Brak imię oraz nazwisko
        res.write('<html><form method="POST">Podaj miasto:<input type="text" value="miasto" id="miasto" name="miasto"/> <input type="submit"> </form></html>')
        res.end()
    })
    .post('/', (req, res) => {
		// MW: Brak obsługi przesłanych danych np. 'req.body.imie'
        res.write("post")
        res.end()
    })

    .listen(PORT, () => {
    console.log("\nSerwer dziala na porcie " + PORT)
    });
