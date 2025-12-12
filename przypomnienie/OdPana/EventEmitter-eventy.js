import EventEmitter from 'events';

const emitter = new EventEmitter();

// Nasłuchiwanie zdarzenia
emitter.on('jakiesZdarzenie', (parametr) => {
	console.log(`wywolano zdarzenie z parametrem, ${parametr}!`);
});

// Emitowanie zdarzenia
emitter.emit('jakiesZdarzenie', 'parametr testowy');
