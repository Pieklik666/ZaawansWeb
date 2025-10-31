import express from 'express';

const app = express()
const PORT = 3000

app.use(express.urlencoded({extended:true}))

var sendHeadres = (res, headers = []) => {
    res.setHeader('Charset', 'UTF-8')
    res.setHeader('Content-Type', 'text/html')
    if(headers){
        for(let header of headers){
            res.setHeader(header[0], header[1])
        }
    }
}

app
    .get('/', (req ,res) => {//localhost:3000/
        res.write("WItaj w app")
        res.end()
    })
    .get('/user', (req ,res) => {//localhost:3000/user
        res.write("WItaj w app")
        res.write("Modul user")
        res.end()
    })
    
    .get('/uczen', (req ,res) => {//localhost:3000/uczen?imie=filip
        sendHeadres(res)
        res.write("WItaj w app.js modul uczen\n")
        

        res.write('<form method="POST"><input type="text" name="nazwisko"/></form>')
        res.end()
    })
    .post('/uczen', (req, res) => {
        sendHeadres(res)
        //res.send("Przesylanie danych POST")
        if(req.query.imie)
        {
            res.write("\nCzesc " + req.query.imie + "\n")
        }
        if(req.body.nazwisko)
        {
            res.write("\nCzesc " + req.body.nazwisko)
        }
        res.end()
    })
    .listen(PORT, () => {
        console.log("\nSerwer dziala na porcie " + PORT)
    });

