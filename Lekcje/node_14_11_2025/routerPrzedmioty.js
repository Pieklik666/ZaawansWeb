import express from 'express';
const routerPrzedmioty = express.Router();
const PORT = 3000

routerPrzedmioty
.get('/:id', (req, res) => {
    console.log('\nGET /przedmiot/:id');
    res.send(`przeglądasz przedmiot ${req.params.id}`);
})



const app = express();
app
.use('/przedmiot', routerPrzedmioty)


.listen(PORT, () => {
    console.log("\nSerwer dziala na porcie " + PORT)
});
