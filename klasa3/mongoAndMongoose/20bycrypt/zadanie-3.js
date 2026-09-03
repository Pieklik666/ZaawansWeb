import jwt from 'jsonwebtoken';

const sprawdzToken = (req, res, next) => {
    const naglowek_auth = req.headers.authorization;
		if (!naglowek_auth){
			return res.status(401).json({
				blad: 'Brak tokena w nagłówku Authorization'
			});
		}
		const token = naglowek_auth.split(' ')[1];

    try {
        const role = ['admin', 'nauczyciel'];
        if (!(req.uzytkownik.rola in role)) return res.status(403).json({ blad: 'Brak potrzebnej roli' }); //Czy ma potrzebną rolę?

        req.uzytkownik = jwt.verify(token, klucz_tajny); //jeśli verify będzie poprawnie to przypisuje do req.uzytkownik

        next();
    } catch {
        return res.status(403).json({ blad: 'Token nieważny' });
    }
};