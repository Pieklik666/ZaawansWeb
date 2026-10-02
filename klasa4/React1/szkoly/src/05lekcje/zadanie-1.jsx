import { useState } from "react"



function ZmienMotyw(){
    const [kolor, setKolor] = useState('#fff')

    return (
        <>
            <div id="prostokat" style={{backgroundColor: kolor, color: (kolor == '#fff' ? '#000' : '#fff')}}>
                Teraz jest kolor {kolor == '#000' ? "ciemny" : "jasny"}
            </div>

            <button style={{height: '60px'}} onClick={()=>{
                if(kolor == '#fff') { 
                    setKolor('#000')
                } 
                else { 
                    setKolor('#fff')
                }

            }}>Zmien Motyw</button>
        </>
    )
}

export default ZmienMotyw