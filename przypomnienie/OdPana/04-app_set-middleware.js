import express from 'express';

const app = express();
const port = 3000;

app
	.use(express.urlencoded({ extended: true })) // obsługa danych z formularzy
	// .use(express.json()) // obsługa danych JSON
	.use((req, res, next) => {
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
		res.setHeader('Pragma', 'no-cache');
		res.setHeader('Expires', '0');
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		next();
	})
	.use((request, response, next) => {
		console.log(`${request.method} ${request.url}`); //  http://localhost:3000/user/:id -> 'GET /user/:id'
		next();
	})
	// .use(cors({ origin: 'http://localhost:4200' }))
	.get('/', (request, response) => {
		response.send('Hello World!');
	})
	.listen(port, () => {
		console.log(`Server is running at http://localhost:${port}`);
	});
