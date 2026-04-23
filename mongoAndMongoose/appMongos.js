import {MongoClient} from 'mongodb';

async function polaczenie_i_tworzenie() {
	const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

	try {
		await client.connect();
        const database = client.db("lekcja_mongodb");
        database.createCollection("produkty");
		const collection = database.collection("produkty");

		// Tworzenie dokumentu
		const nowyProdukt = {
			nazwa: "telegraf",
			cena: 323.99,
			zapas: 31,
		};

		let wynik = await collection.insertOne(nowyProdukt);
        console.log("Dokument dodany z ID:", wynik.insertedId);
        
        const nowyProdukt2 = {
			nazwa: "destylator",
			cena: 132.99,
			zapas: 321,
        };
        const nowyProduk3 = {
			nazwa: "globus",
			cena: 32.99,
			zapas: 0,
        };

		wynik = await collection.insertMany([nowyProdukt2, nowyProduk3]);





        const wszystkie = await collection.find({}).toArray();
		console.log("Wszystkie produkty:", wszystkie);

        wynik = await collection.find({ cena: { $gt: 100 } }).toArray();
        console.log("Produkty drozsze niz 100zl:", wynik);
        
        const ile = await collection.countDocuments();
		console.log("Ilosc produktow:", ile);


        await collection.drop();
	} finally {
		await client.close();
	}
}
polaczenie_i_tworzenie();