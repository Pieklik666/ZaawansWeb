

function PrzyciskZapisz({czyZapisano, onZapis}){
    

    return(
        <>
            {czyZapisano
                ? (<>Zmiany zostały zapisane</>)
                : (<button onClick={onZapis}>Zapisz zmiany</button> )
            }
        </>
    )
}

export default PrzyciskZapisz