import { createContext, useContext, useState } from "react";

const StudentContext = createContext(null);
function StudentProvider() {
    const [ student, setStudent] = useState({ name: 'Jan Kowalski', class: '1A' });

    function changeClass(klasa) {
        setStudent({name: student.name, class: klasa});
    }

    return (
        <>
            <StudentContext.Provider value={student}>
                <StudentInfo/>
            </StudentContext.Provider>
            <StudentContext.Provider value={changeClass}>
                <ClassChanger/>
            </StudentContext.Provider>
        </>
    )
}

function StudentInfo() {
    const student = useContext(StudentContext);

    return (
        <>
            <p>Imię i nazwisko: {student.name}<br/>Klasa: {student.class}</p>
        </>
    )
}

function ClassChanger() {
    const changeClass = useContext(StudentContext);

    return (
        <>
            <button onClick={() => {changeClass('1A')}}>1A</button> <button onClick={() => {changeClass('2B')}}>2B</button> <button onClick={() => {changeClass('3C')}}>3C</button>
        </>
    )
}

export default StudentProvider;