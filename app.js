import express from 'express';

const app = express();
const PORT = 3000;


app
    .get('/', (req, res) => {
        res.write('Hello, World!\n');
        res.write('Hello, World! again...');
        res.end();
    })
    .post('/', (req, res) => {
        res.send('Data received!');
    })
    .listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });

