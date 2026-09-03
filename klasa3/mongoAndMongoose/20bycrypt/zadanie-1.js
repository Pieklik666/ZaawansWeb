import bcrypt from 'bcrypt';

const haslo_zwykłe = 'UczenMalysz2024!';
const haslo_zahashowane = await bcrypt.hash(haslo_zwykłe, 10);

console.log('Zahashowane hasło: ', haslo_zahashowane)
// Weryfikacja
const czy_zgodne1 = await bcrypt.compare('UczenMalysz2024!', haslo_zahashowane);
console.log('UczenMalysz2024! się zgadza: ', czy_zgodne1);
// Wynik: true
const czy_zgodne2 = await bcrypt.compare('UczenMalysz2023!', haslo_zahashowane);
console.log('UczenMalysz2023! się zgadza: ', czy_zgodne2);
// false
