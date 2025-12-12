const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Users page');
});

router.get('/new', (req, res) => {
  res.send('Users new page');
});

router.post('/', (req, res) => {
  res.send('Create a new user');
});


router
    .route('/:id')
    .get((req, res) => { // dynamic route always at the end
        res.send(`User ${req.user.name} with ID: ${req.params.id}`); 
        console.log(req.user);
    })
    .put((req, res) => { 
        res.send(`Update User with ID: ${req.params.id}`);   // params is used to get dynamic values from the URL
    })
    .delete((req, res) => {
        res.send(`Delete User with ID: ${req.params.id}`);  
    });


    



const users = [{ name: 'John', surname: 'Anielski' }, { name: 'Jane' }, { name: 'Bob' }];
router.param('id', (req, res, next, id) => {
    req.user = users[id]; // wszędzie od teraz możemy używać req.user
    console.log(`something just happened: User ID param: ${id}`);
    next();
});

module.exports = router; //exporting the router to use in the main app
