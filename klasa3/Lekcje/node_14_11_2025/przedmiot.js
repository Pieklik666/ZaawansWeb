import express from 'express';
const app = express();
const PORT = 3000
app
.get('/przedmiot/:id', (req ,res) => {
    console.log('GET /przedmiot/:id');
    res.send(`jestes w przedmiocie ${req.params.id}`)
})
.listen(PORT, () => {
    console.log("\nSerwer dziala na porcie " + PORT)
});
