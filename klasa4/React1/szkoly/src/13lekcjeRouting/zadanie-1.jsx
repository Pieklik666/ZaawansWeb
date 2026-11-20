import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

function Home() {
    return (
        <h1>Home</h1>
    );
}

function Help() {
    return (
        <h1>Help</h1>
    );
}

function Zadanie1() {
	return (
		<BrowserRouter>
			<nav>
				<Link to="/">Home</Link>
				---
				<Link to="/help">Help</Link>
			</nav>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/help" element={<Help />} />
			</Routes>
		</BrowserRouter>
	);
}

export default Zadanie1;