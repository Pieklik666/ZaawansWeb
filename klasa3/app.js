import express from 'express';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

const baza_url = 'mongodb://localhost:27017/szkola';

app.post('/api/rejestracja', async (req, res) => {
    const klient = new MongoClient(baza_url);
    try {
        const { email, haslo, imie, nazwisko, rola } = req.body;

        if (!email || !haslo || !imie || !nazwisko) {
            return res.status(400).json({
                blad: 'Brak wymaganych pól'
            });
        }

        if (haslo.length < 8){
            return res.status(400).json({
                blad: 'Za krótkie hasło'
            });
        }

        if (!(/\d/.test(haslo))){
            return res.status(400).json({
                blad: 'Hasło potrzebuje chociaż jedną cyfrę'
            });
        }

        await klient.connect();
        const baza = klient.db('szkola');
        const uzytkownicy = baza.collection('uzytkownicy');

        const istniejacy = await uzytkownicy.findOne({ email });
        if (istniejacy) {
            return res.status(409).json({
                blad: 'Email już zarejestrowany'
            });
        }

        const haslo_zahashowane = await bcrypt.hash(haslo, 10);

        const wynik = await uzytkownicy.insertOne({
            email,
            haslo: haslo_zahashowane,
            imie,
            nazwisko,
            rola: rola || 'nauczyciel',
            data_rejestracji: new Date()
        });

        res.status(201).json({
            wiadomosc: 'Konto utworzone pomyślnie',
            id_uzytkownika: wynik.insertedId
        });

    } catch (blad) {
        console.error(blad);
        res.status(500).json({ blad: 'Błąd rejestracji' });
    } finally {
        await klient.close();
    }
});

app.get('/', (req, res) => {
    res.send('działa!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});


const fetchTest = async (opis, body, oczekiwanyStatus) => {
    try {
        const res = await fetch('http://localhost:3000/api/rejestracja', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        const wynik = res.status === oczekiwanyStatus ? 'OK' : 'FAIL';

        console.log(`[${wynik}] ${opis}`);
        console.log('Status:', res.status);
        console.log('Response:', data);
        console.log('-----------------------------');

    } catch (err) {
        console.log(`[ERROR] ${opis}`, err.message);
    }
};

const runTests = async () => {
    await fetchTest(
        'Brak pola email',
        {
            haslo: 'haslo1',
            imie: 'Jan',
            nazwisko: 'Kowalski'
        },
        400
    );

    await fetchTest(
        "Hasło 'abc123' (za krótkie)",
        {
            email: 'test1@test.pl',
            haslo: 'abc123',
            imie: 'Jan',
            nazwisko: 'Kowalski'
        },
        400
    );

    await fetchTest(
        "Hasło 'abcdefgh' (brak cyfry)",
        {
            email: 'test2@test.pl',
            haslo: 'abcdefgh',
            imie: 'Jan',
            nazwisko: 'Kowalski'
        },
        400
    );

    await fetchTest(
        'Poprawne dane',
        {
            email: 'test3@test.pl',
            haslo: 'haslo1',
            imie: 'Jan',
            nazwisko: 'Kowalski'
        },
        201
    );

    await fetchTest(
        'Email już istnieje',
        {
            email: 'test3@test.pl',
            haslo: 'haslo2',
            imie: 'Jan',
            nazwisko: 'Kowalski'
        },
        409
    );
};

runTests();