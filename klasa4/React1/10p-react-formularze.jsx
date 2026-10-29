import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Przyklady() {
	return (<div>
		<PrzykladOnChange />
		<PrzykladUseRefInput />
		<PrzykladUseRefWartosc />
		<PrzykladOnSubmitPrzeladowanie />
		<PrzykladOnSubmitBezPrzeladowania />
		<PrzykladWalidacja />
		<PrzykladReactHookForm />
	</div>)
}

function PrzykladOnChange() {
	const [imie, setImie] = useState('Ziuta');

	function inputChange(event) {
		setImie(event.target.value);
	}

	return (<>
		<h2>PrzykladOnChange</h2><br />
		<form>
			<input
				type="text"
				name="imie"
				value={imie}
				onChange={inputChange}
			/><br />
			Imię: {imie}
		</form>
		<br /><br />
	</>);
}

function PrzykladUseRefInput() {
	const imieRef = useRef(); // {current: wartoscDomyslna_tutajNull}
	const [imie, setImie] = useState('Ziuta');

	function formSubmit(event) {
		event.preventDefault();
		setImie(imieRef.current.value);
	}

	return (<>
		<h2>PrzykladUseRef w input</h2><br />
		<form onSubmit={formSubmit}>
			Imie: {imie}<br />
			<input type="text" name="imie" defaultValue={imie} ref={imieRef} />
			<button type="submit">
				zapisz imie
			</button>
		</form>
		<br /><br />
	</>);
}

function PrzykladUseRefWartosc() {
	const imieRef = useRef();
	const [imie, setImie] = useState('Ziuta');
	const [imieRefState, setImieRefState] = useState('Ziuta');0

	function formSubmit(event) {
		event.preventDefault();
		imieRef.current = imie;
		setImieRefState(imieRef.current);
	}

	return (<>
		<h2>PrzykladUseRef z wartościami</h2><br />
		<form onSubmit={formSubmit}>
			Imie: {imie}<br />
			<input type="text" name="imie" value={imie} onChange={(e) => setImie(e.target.value)} /><br />
			imieRef: {imieRefState}<br />
			<button type="submit">
				przypisz imie do imieRef
			</button>
		</form>
		<br /><br />
	</>);
}

function PrzykladOnSubmitPrzeladowanie() {
	const imieRef = useRef();
	const [imie, setImie] = useState('Ziuta');

	function formSubmit(event) {
		setImie(imieRef.current.value);
		alert('submit z przeladowaniem')
	}

	return (<>
		<h2>PrzykladOnSubmitPrzeladowanie</h2><br />
		<form onSubmit={formSubmit}>
			Imie: {imie}<br />
			<input type="text" name="imie" defaultValue={imie} ref={imieRef} />
			<button type="submit">
				zapisz imie
			</button>
		</form>
		<br /><br />
	</>);
}

function PrzykladOnSubmitBezPrzeladowania() {
	const imieRef = useRef();
	const [imie, setImie] = useState('Ziuta');

	function formSubmit(event) {
		event.preventDefault();
		setImie(imieRef.current.value);
	}

	return (<>
		<h2>PrzykladOnSubmitBezPrzeladowania</h2><br />
		<form onSubmit={formSubmit}>
			Imie: {imie}<br />
			<input type="text" name="imie" defaultValue={imie} ref={imieRef} />
			<button type="submit">
				submit bez przeladowania
			</button>
		</form>
		<br /><br />
	</>);
}

function PrzykladWalidacja() {
	const [email, setEmail] = useState('');
	const [haslo, setHaslo] = useState('');
	const [komunikat, setKomunikat] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!email || !haslo) {
			setKomunikat('Wypełnij wszystkie pola!');
			return;
		}

		setKomunikat(`Zalogowano jako: ${email}`);
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>PrzykladWalidacja</h2>
			<h3>Logowanie do systemu szkolnego</h3>

			<div>
				<label htmlFor="email">Email:</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="twoj@email.pl"
				/>
			</div>

			<div>
				<label htmlFor="haslo">Hasło:</label>
				<input
					id="haslo"
					type="password"
					value={haslo}
					onChange={(e) => setHaslo(e.target.value)}
					placeholder="Wpisz hasło"
				/>
			</div>

			{komunikat && <p>{komunikat}</p>}

			<button type="submit">Zaloguj się</button>
			<br /><br /><br />
		</form>
	);
}

function PrzykladReactHookForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm();

	const onSubmit = (data) => {
		console.log('Dane formularza:', data);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2>PrzykladReactHookForm</h2>
			<h3>Formularz kontaktowy</h3>

			<div>
				<label>Imię:</label>
				<input
					{...register('imie', {
						required: 'Imię jest wymagane',
						minLength: {
							value: 2,
							message: 'Imię musi mieć co najmniej 2 znaki'
						}
					})}
					type="text"
					placeholder="Twoje imię"
				/>
				{errors.imie && <span style={{ color: 'red' }}>{errors.imie.message}</span>}
			</div>

			<div>
				<label>Email:</label>
				<input
					{...register('email', {
						required: 'Email jest wymagany',
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: 'Podaj poprawny adres email'
						}
					})}
					type="email"
					placeholder="twoj@email.pl"
				/>
				{errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
			</div>

			<div>
				<label>Wiadomość:</label>
				<textarea
					{...register('wiadomość', {
						required: 'Wiadomość jest wymagana',
						maxLength: {
							value: 500,
							message: 'Wiadomość może mieć maksymalnie 500 znaków'
						}
					})}
					rows={4}
					placeholder="Twoja wiadomość..."
				/>
				{errors.wiadomość && <span style={{ color: 'red' }}>{errors.wiadomość.message}</span>}
			</div>

			<button type="submit">Wyślij wiadomość</button>
			<br /><br />
		</form>
	);
}
