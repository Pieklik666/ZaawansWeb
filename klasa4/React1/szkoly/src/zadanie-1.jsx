
function InfoUczen({imie, czyObecny, numerDziennika}){

    return(
        <>
            {numerDziennika}. {imie}
            {czyObecny && " (Obecny)"}
            {!czyObecny && " (Nieobecny)"}
        </>
    )
}
export default InfoUczen