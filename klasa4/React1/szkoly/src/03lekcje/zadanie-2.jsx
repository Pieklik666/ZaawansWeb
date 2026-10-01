
function PersonCard({firstName, lastName, age, occupation = "Bezrobotny"}) {   
    return (
        <>
            Imie i Nazwisko: {firstName} {lastName} {age} lat. Praca: {occupation}
        </>
    )
}

export default PersonCard;