const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true })); // to use stuff from forms

app.set('view engine', 'ejs'); // to use ejs as template when rendering html

app.get('/', (req, res) => {
  res.render('index.ejs', { text1: 'Hello this is some information I passed to ejs' });
});

app.post('/', (req, res) => {
  res.send('POST request to the homepage: ' + req.body.inputText); // using stuff from the form after submiting
});
//btw you can't use .send twice in one request


// has user.js router
const userRouter = require('./routes/user');
app.use('/users', userRouter);

app.listen(3000) //always needed at the end





