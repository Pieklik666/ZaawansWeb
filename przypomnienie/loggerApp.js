
// importing the logger module (exports from logger.js)
const logger = require('./logger'); 

// testing it
logger.log('This is a message we pass to logger and it writes it out.');


// --------------event emitter-----------------------------------------------------------------------------------


const EventEmitter = require('events'); // Importing the events module
const emitter = new EventEmitter(); // Creating an instance of EventEmitter

//register a listener
emitter.on('messageLogged', ()=>{
    console.log('Listener called');
    logger.log('This is a message we pass to logger and it writes it out.');
});


// raise an event
emitter.emit('messageLogged');



//register a listener 2
emitter.on('messageLogged2', (arg)=>{
    console.log('Listener called', arg['id'], arg['url']);
});


// raise an event 2
emitter.emit('messageLogged2', { id: 1, url: 'http://testowe.com' });