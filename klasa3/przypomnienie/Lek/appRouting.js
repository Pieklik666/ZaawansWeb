const express = require('express');
const app = express()
const PORT = 3000

app
.get('/', (req, res) => {
    res.send("App")
})
.listen(PORT, () => {
    console.log("\nSerwer dziala na porcie " + PORT)
});


let routerUser = express.Router()

routerUser
.get('/', (req, res) => {
    res.send("User")
})
.get('/add', (req, res) => {
    res.send("User Add")
})
.get('/list', (req, res) => {
    res.send("User List")
})
app.use('/user', routerUser);


let routerSubscriber = express.Router()

routerSubscriber.get('/', (req, res) => {
    res.send("Subscriber")
})
.get('/add', (req, res) => {
    res.send("Subscriber Add")
})
.get('/list', (req, res) => {
    res.send("Subscriber List")
})
app.use('/Subscriber', routerSubscriber);