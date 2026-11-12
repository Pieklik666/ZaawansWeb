
import { useState } from "react";

function ListaObecnosci() {
  const [uczniowie, setUczniowie] = useState([
    { id: 1, imie: "im1" },
    { id: 2, imie: "im2" },
    { id: 3, imie: "im3" }
  ]);

  const [nowyUczen, setNowyUczen] = useState("");
  const [edytowanyId, setEdytowanyId] = useState(null);
  const [edytowaneImie, setEdytowaneImie] = useState("");

  const dodajUcznia = () => {
    if (nowyUczen.trim() === "") return;

    const uczen = {
      id: Date.now(),
      imie: nowyUczen.trim()
    };

    setUczniowie([...uczniowie, uczen]);
    setNowyUczen("");
  };

  const usunUcznia = (id) => {
    setUczniowie(
      uczniowie.filter((uczen) => uczen.id !== id)
    );
  };

  const edytujUcznia = (uczen) => {
    setEdytowanyId(uczen.id);
    setEdytowaneImie(uczen.imie);
  };

  const zapiszZmiany = (id) => {
    if (edytowaneImie.trim() === "") return;

    setUczniowie(
      uczniowie.map((uczen) =>
        uczen.id === id
          ? { ...uczen, imie: edytowaneImie.trim() }
          : uczen
      )
    );

    setEdytowanyId(null);
    setEdytowaneImie("");
  };

  return (
    <div>
      <h2>Lista obecności</h2>

      <input
        type="text"
        placeholder="Podaj imię ucznia"
        value={nowyUczen}
        onChange={(e) => setNowyUczen(e.target.value)}
      />

      <button onClick={dodajUcznia}>
        Dodaj ucznia
      </button>

      <ul>
        {uczniowie.map((uczen) => (
          <li key={uczen.id}>
            {edytowanyId === uczen.id ? (
              <>
                <input
                  type="text"
                  value={edytowaneImie}
                  onChange={(e) =>
                    setEdytowaneImie(e.target.value)
                  }
                />

                <button onClick={() => zapiszZmiany(uczen.id)}>
                  Zapisz
                </button>

                <button onClick={() => setEdytowanyId(null)}>
                  Anuluj
                </button>
              </>
            ) : (
              <>
                {uczen.imie}

                <button onClick={() => edytujUcznia(uczen)}>
                  Edytuj
                </button>

                <button onClick={() => usunUcznia(uczen.id)}>
                  Usuń
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>Liczba uczniów: {uczniowie.length}</h3>
    </div>
  );
}

export default ListaObecnosci;
