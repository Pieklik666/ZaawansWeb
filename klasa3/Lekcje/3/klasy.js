import express from 'express';

const routerKlasa = express.Router()
    .get('/list', (req, res) => {

    })
    .get('/details/:id', (req, res) => {

    })
    .get('/add/', (req, res) => {

    })
    .post('/add', (req, res) => {

    })
    .get('/update/:id', (req, res) => {

    })
    .post('/update', (req, res) => {

    })
    .get('/delete/:id', (req, res) => {

    });

applicationCache.use('/klasy', routerKlasa);