/* Niezbędne biblioteki react
globalne:
	npm install -g vite create-vite create-react-app
	npm install axios dotenv eslint @eslint/js redis
dodatkowe:
	npm install jest lodash prettier
	npm install -g typescript vite create-vite create-react-app
npm install typescript vite create-vite create-react-app react prop-types react-hook-form react-jsx-runtime react-dom react-router-dom axios redux framer-motion redis @babel/core @babel/preset-react @types/react @types/react-dom @vitejs/plugin-react eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
*/
// #region Informacje ogólne
// #region Cele lekcji:
/* 1. Zrozumienie fundamentalnych różnic między React a Angularem
 * 2. Poznanie koncepcji komponentów funkcyjnych w React
 * 3. Opanowanie JSX jako składni do definiowania UI
 * 4. Zrozumienie jak JSX konwertuje się na JavaScript
 * 5. Praktyczne wykorzystanie React w pierwszych projektach
 */
// #endregion

// #region Informacje o React:
/* Biblioteka JavaScript do budowania interfejsów użytkownika
 * Stworzona przez Facebooka, szeroko stosowana w branży
 * Skupia się na komponentach i deklaratywnym podejściu do UI
 * Używa wirtualnego DOM dla optymalizacji wydajności
 * Ma ogromny ekosystem narzędzi i bibliotek wspierających rozwój aplikacji
 * Jest open-source i ma dużą społeczność deweloperów
 * W przeciwieństwie do Angulara, React jest biblioteką, a nie frameworkiem, co daje większą elastyczność w wyborze narzędzi i architektury aplikacji
 * można tworzyć zarówno aplikacje webowe (React DOM), jak i mobilne (React Native) używając tej samej składni i koncepcji komponentów
 * Można używać do tworzenia frontendu w różnych językach, takich jak JavaScript, TypeScript, a nawet z wykorzystaniem JSX, który jest rozszerzeniem składni JavaScript i backendu (np. z Next.js) w pełnym stacku JavaScript
 * React promuje podejście "learn once, write anywhere", co oznacza, że umiejętności nabyte w React można zastosować w różnych kontekstach i platformach, nie tylko w przeglądarce
 * React ma bogaty ekosystem narzędzi do zarządzania stanem (Redux, MobX), routingu (React Router) i wielu innych aspektów rozwoju aplikacji, co pozwala na tworzenie skalowalnych i złożonych projektów
 */
// #endregion

// #region Struktura katalogów w projekcie React:
/* aplikacja/
 * ├── node_modules/          # Zainstalowane zależności
 * ├── public/                # Pliki statyczne (index.html, favicon, itp.)
 * ├── src/                   # Kod źródłowy aplikacji
 * │   ├── components/        # Komponenty React
 * │   ├── App.js             # Główny komponent aplikacji
 * │   ├── index.js           # Punkt wejścia do aplikacji
 * │   └── ...                # Inne pliki JS, CSS, itp.
 * ├── package.json           # Konfiguracja projektu i zależności
 * ├── README.md              # Dokumentacja projektu
 * └── ...                    # Inne pliki konfiguracyjne (np. .gitignore)
 */
// #endregion

// #region INSTALACJA NIEZBĘDNYCH WTYCZEK
/*	globalne:
	npm install -g typescript vite create-vite create-react-app

	lokalne (w katalogu projektu):
	npm install react prop-types react-hook-form react-jsx-runtime react-dom react-router-dom axios redux
	// npm install framer-motion
	// npm install redis

	Create React App:
	npm install @babel/core @babel/preset-react
*/

// #region INSTALACJA I KONFIGURACJA za pomocą VITE - alternatywa dla Create React App:
/* szybsze od Create React App, nowoczesne narzędzie do budowania aplikacji webowych, które wykorzystuje natywne moduły ES i jest zoptymalizowane pod kątem wydajności.
instalacja i konfiguracja VITE:
npm install -g vite create-vite
npm create vite@latest szkoly -- --template react
cd szkoly
npm install
npm run dev
 */
// #endregion

// #region INSTALACJA I KONFIGURACJA za pomocą Create React App:
/* 1. Globalnie zainstaluj Create React App:
 *    npm install -g create-react-app
 *    npm install @babel/core @babel/preset-react
 *
 * 2. Utwórz nowy projekt:
 npm install -g create-react-app
 create-react-app szkola
 cd szkola
 *
 * 3. Uruchom serwer deweloperski:
 *    npm start
 *
 * 4. Otwórz http://localhost:3000 w przeglądarce
 */
// #endregion
// #endregion// #endregion


// #region JSX - JavaScript XML
/* JSX to składnia rozszerzająca JavaScript, pozwalająca na pisanie kodu przypominającego HTML w plikach JavaScript.
 * JSX jest przekształcany przez Babel do wywołań React.createElement, co umożliwia tworzenie elementów React.
 * JSX pozwala na łatwe definiowanie struktury UI w sposób deklaratywny, co jest jednym z kluczowych aspektów Reacta.
 * W JSX można używać wyrażeń JavaScript, umieszczając je w nawiasach klamrowych {}.
 * JSX jest opcjonalny, ale jest szeroko stosowany w społeczności React ze względu na swoją czytelność i wygodę.
 * JSX pozwala na tworzenie komponentów, które mogą być wielokrotnie używane i łatwo komponowane, co jest podstawą budowania złożonych interfejsów użytkownika w React.
 * JSX umożliwia również stosowanie warunkowego renderowania, iteracji po kolekcjach i innych zaawansowanych technik, co czyni go potężnym narzędziem do tworzenia dynamicznych interfejsów użytkownika.
 * JSX jest często używany w połączeniu z narzędziami do stylowania, takimi jak CSS-in-JS, co pozwala na definiowanie stylów bezpośrednio w komponentach React, co zwiększa modularność i reużywalność kodu.
 */
// #endregion


// #region Przykłady
// #region PRZYKŁAD 1: Prosty komponent funkcyjny (różnica od Angular)
/*
 * Angular:
 * @Component({
 *   selector: 'app-greeting',
 *   template: `<h1>Hello {{name}}</h1>`
 * })
 * export class GreetingComponent {
 *   name = 'World';
 * }
 *
 * React:
 */
import React from "react";
function Greeting() {
	const name = 'World';
	const html = <h1>Hello {name}</h1>;
		// ten HTML to JSX, który zostanie przekształcony na JavaScript
		// wynik: '<h1>Hello World</h1>'
	return html;
}
// #endregion

// #region PRZYKŁAD 2: JSX - co to jest w rzeczywistości?
/* JSX jest przekształcany przez Babel:
 */
// JSX:
import React from "react";
const element = <div className="container"><p>Hello React!</p></div>;
// zawartość element: '<div className="container"><p>Hello React!</p></div>'

// Przekształcone na JavaScript:
// const element = React.createElement(
//   'div',
//   { className: 'container' },
//   React.createElement('p', null, 'Hello React!')
// );
// #endregion

// #region PRZYKŁAD 3: Komponenty z propsami (jak @Input w Angularze)
import React from "react";
function Welcome({ name, age }) {
	return (
		<div>
			<h2>Hello, {name}!</h2>
			<p>You are {age} years old.</p>
		</div>
	);
}

/* Użycie:
	<div>
		<Welcome name="John" age={30} />
		<Welcome name="Jane" age={25} />
	</div>
*/
// #endregion

// #region PRZYKŁAD 4: useState Hook (zastępuje component state w Angularze)
import React from "react";
function Counter() {
	const wartoscPoczatkowa = 0;
	const [count, setCount] = React.useState(wartoscPoczatkowa);

	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>Increment</button>
		</div>
	);
}
function Imie() {
	const [imie, setImie] = React.useState('jakaś wartość początkowa');

	return (
		<div>
			<p><input type="text" value={imie} onChange={e => setImie(e.target.value)} /></p>
			<button onClick={() => setImie('')}>Clear</button>
		</div>
	);
}
// #endregion

// #region PRZYKŁAD 5: Warunkowe renderowanie w JSX
import React from "react";
function LoginStatus({ isLoggedIn }) {
	return (
		<div>
			{isLoggedIn ? (
				<p>Welcome back!</p>
			) : (
				<p>Please log in.</p>
			)}
		</div>
	);
}
// #endregion
// #endregion


// #region Zadania praktyczne
/*	Odpowiedzi do zadań proszę zapisać:
	w formacie 'zadanie-X.js' (X to numer zadania np. 'zadanie-1.js')
	w katalogu 'W:\numerKlasy\przedmiot\data-nazwaPlikuBezRozszerzenia\ImieNazwisko\'
		np. 'W:\1a\algorytmy\20260325-10-tabliceJednowymiarowe\JanKowalski\zadanie-1.js'
	Nie wrzucaj katalogu 'node_modules' ani innych zbędnych (zwłaszcza dużych)
		katalogów, tylko same pliki z rozwiązaniami
*/

// #region ZADANIE PRAKTYCZNE 1: Twój pierwszy komponent
/* Treść:
 * Utwórz komponent funkcyjny o nazwie "Profile", który wyświetla kartę profilową.
 * Komponent powinien przyjmować props: username, email, avatar.
 *
 * Instrukcje:
 * 1. Otwórz plik src/App.js
 * 2. Stwórz komponent Profile jako funkcję
 * 3. Zwróć JSX z divem zawierającym avatar (img), username (h2) i email (p)
 * 4. Użyj każdego prop w odpowiednim miejscu
 *
 * Oczekiwany rezultat:
 * Komponent wyświetla kartę z danym profilu użytkownika
 */
// #endregion

// #region ZADANIE PRAKTYCZNE 2: JSX vs JavaScript
/* Treść:
 * Stwórz komponent, który generates listę produktów.
 *
 * Instrukcje:
 * 1. Utwórz tablicę produktów: [{id: 1, name: 'Product A', price: 10}...]
 * 2. W JSX użyj .map() do iteracji po produktach
 * 3. Dla każdego produktu zwróć <li> z ID, nazwą i ceną
 * 4. Każdy element powinien mieć unikalny key
 *
 * Oczekiwany rezultat:
 * Lista produktów renderowana dynamicznie z danych w JavaScript
 */
// #endregion

// #region ZADANIE PRAKTYCZNE 3: Stan komponentu z useState
/* Treść:
 * Stwórz komponent "TodoList" z funkcjonalnością dodawania i usuwania zadań.
 *
 * Instrukcje:
 * 1. Zaimportuj useState z React
 * 2. Utwórz state dla listy todos (tablica)
 * 3. Utwórz input do wpisywania nowego todo
 * 4. Stwórz przycisk "Dodaj" który dodaje todo do listy
 * 5. Wyświetl todos w li z przyciskiem usunięcia obok każdego
 * 6. Przycisk usunięcia powinien filtrować element z listy
 *
 * Oczekiwany rezultat:
 * W pełni funkcjonalna aplikacja do zarządzania listą zadań
 */
// #endregion

// #region ZADANIE PRAKTYCZNE 4: Warunkowe renderowanie
/* Treść:
 * Stwórz komponent "UserCard" wyświetlający różne treści w zależności od stanu
 * użytkownika (zalogowany/niezalogowany).
 *
 * Instrukcje:
 * 1. Stwórz state isLoggedIn (boolean, domyślnie false)
 * 2. Utwórz przycisk "Login/Logout" zmieniający stan
 * 3. Jeśli zalogowany: pokaż powitanie i informacje użytkownika
 * 4. Jeśli niezalogowany: pokaż formularz logowania (tylko UI)
 * 5. Użyj operatora ternary lub && do warunkowego renderowania
 *
 * Oczekiwany rezultat:
 * Komponent zmieniający zawartość w zależności od stanu logowania
 */
// #endregion

// #region ZADANIE PRAKTYCZNE 5: Reusable komponenty
/* Treść:
 * Stwórz reusable komponenty Button i Card, a następnie użyj ich w głównym
 * komponencie aplikacji.
 *
 * Instrukcje:
 * 1. Stwórz komponent Button z props: label, onClick, type (primary/secondary)
 * 2. Stwórz komponent Card z props: title, children
 * 3. W App.js użyj tych komponentów razem
 * 4. Styluj komponenty przy użyciu className i CSS
 * 5. Upewnij się, że komponenty są reużywalne w różnych miejscach
 *
 * Oczekiwany rezultat:
 * Zestaw reusable komponentów będących podstawą scalable aplikacji React
 */
// #endregion
// #endregion
