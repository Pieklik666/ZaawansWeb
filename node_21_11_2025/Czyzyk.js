import express from 'express';
import EventEmitter from 'events'

const app = express()
const PORT = 3000




const emitter = new EventEmitter()

emitter.on('jakiesZdarzenie', (parametr) => {
	console.log(`\nwywolano zdarzenie z parametrem, ${parametr}!`)
});
emitter.emit('jakiesZdarzenie', 'parametr testowy')




app.use(express.urlencoded({extended:true}));

app
    .get('/', (req, res) => {
        res.write('<html><form method="POST">Podaj miasto:<input type="text" name="miasto"/> <input type="submit"/> </form></html>')
        res.end()
    })
    .post('/', (req, res) => {
        res.write(req.body.miasto)
        emitter.emit('jakiesZdarzenie', 'parametr testowy')
        res.end()
    })
    .listen(PORT, () => {
        console.log("\nSerwer dziala na porcie " + PORT)
    });


