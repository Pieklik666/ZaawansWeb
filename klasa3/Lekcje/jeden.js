
var poteguj = liczba => liczba * liczba;
console.log(poteguj(5));

var mnoz3 = (l1, l2, l3) => l1 * l2 * l3;
console.log(mnoz3(11,3,2));

var wypiszLiczby = (doIlu, coIle) => {
    for (i=0; i < doIlu; i+=coIle){
        console.log(i);
    }
}
wypiszLiczby(100, 6)

l4 = 13
while (l4 > 0){
    console.log(l4*l4)
    l4--;
}

do{
    l4++
    console.log(l4)
}while(l4<13)



var tab100 = []
for(i=1; i<=100; i++){
    tab100.push(i*i)
}
console.log(tab100.join(' '))



var sumuj = (...liczby) => {
    let wynik = 0;

    for (liczba of liczby){
        wynik+=liczba
    }

    return wynik
}

console.log(sumuj(1,2,3,4,5,6,7,8,9,0,8,8,7,6,5,1,5,153431534,3))



var wypisz = (...napisy) => {
    for (napis of napisy){
        console.log(napis)
    }
}

wypisz("1230", "co teraz", "jest,", "heja")
wypisz("120", "co teraz", "jest,", "heja")







