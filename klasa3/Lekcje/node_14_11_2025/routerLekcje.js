import express from 'express';
const routerLekcje = express.Router();
const PORT = 3000

routerLekcje
.get('/:id', (req, res) => {
    console.log('\nGET /lekcje/:id');
    res.send(`przeglądasz lekcje ${req.params.id}`);
})





const app = express();
app
.use('/lekcje', routerLekcje)


.listen(PORT, () => {
    console.log("\nSerwer dziala na porcie " + PORT)
});
