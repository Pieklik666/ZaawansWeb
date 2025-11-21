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
    .get('/subskrybent', (req ,res) => {//localhost:3000/subskrybent
        res.write("WItaj w app")
        res.write("Modul subskrybent")
        res.end()
    })

    .listen(PORT, () => {
        console.log("\nSerwer dziala na porcie " + PORT)
    });

