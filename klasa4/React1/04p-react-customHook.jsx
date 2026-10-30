import { useState } from 'react';

export default function Przyklady() {
	return (<>
		<LicznikTradycyjny />
		<LicznikCustomHook />
		<LicznikCustomHookDodatni />
	</>);
}

// #region LicznikTradycyjny
function LicznikTradycyjny() {
	const [licznikState, setLicznikState] = useState(0);

	return (<>
		<h2>LicznikTradycyjny</h2>
		<LicznikZmniejsz
			licznikState={licznikState}
			setLicznikState={setLicznikState}
		/>
		licznikState: {licznikState}<br />
		<LicznikZwieksz
			licznikState={licznikState}
			setLicznikState={setLicznikState}
		/>
		<br /><br /><br />
	</>)
}

function LicznikZmniejsz({ licznikState, setLicznikState }) {
	function zmniejszLicznik() {
		setLicznikState(licznikState - 1);
	}

	return (<>
		<button onClick={zmniejszLicznik}>zmniejsz licznik</button>
	</>)
}

function LicznikZwieksz({ licznikState, setLicznikState }) {
	const zwiekszLicznik = () => {
		setLicznikState(licznikState + 1);
	}

	return (<>
		<button onClick={zwiekszLicznik}>zwieksz licznik</button>
	</>)
}
// #endregion

// #region LicznikCustomHook
function useLicznik(wartoscPoczatkowa) {
	const [licznikState, setLicznikState] = useState(wartoscPoczatkowa);

	function zmniejszLicznik() {
		setLicznikState(licznikState - 1);
	}

	const zwiekszLicznik = () => {
		setLicznikState(licznikState + 1);
	}

	return [licznikState, zmniejszLicznik, zwiekszLicznik];
}

function LicznikCustomHook() {
	const [licznikState, zmniejszLicznik, zwiekszLicznik] = useLicznik(0);

	return (<>
		<h2>LicznikCustomHook</h2>
		<button onClick={zmniejszLicznik}>zmniejsz licznik</button>
		{licznikState}
		<button onClick={zwiekszLicznik}>zwieksz licznik</button>
		<br /><br /><br />
	</>)
}
// #endregion

// #region LicznikCustomHook
function useLicznikDodatni(wartoscPoczatkowa) {
	const [licznikState, zmniejszLicznikOriginal, zwiekszLicznik] = useLicznik(wartoscPoczatkowa);

	function zmniejszLicznik() {
		if (licznikState <= 0) {
			return;
		}

		zmniejszLicznikOriginal();
	}

	return [licznikState, zmniejszLicznik, zwiekszLicznik]
}

function LicznikCustomHookDodatni() {
	const [licznikState, zmniejszLicznik, zwiekszLicznik] = useLicznikDodatni(0);

	return (<>
		<h2>LicznikCustomHookDodatni</h2>
		<button onClick={zmniejszLicznik}>zmniejsz licznik</button>
		{licznikState}
		<button onClick={zwiekszLicznik}>zwieksz licznik</button>
		<br /><br /><br />
	</>)
}
// #endregion
