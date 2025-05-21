let demarer = document.getElementById("demarer")
let baliseDefaillances = document.querySelectorAll('input[type="checkbox"]')
let situationoeil=[] 

const form =document.querySelector('form')
form.addEventListener("submit", (event)=>{
    for (let i=0; i<baliseDefaillances.length; i++){ 
    situationoeil.push(baliseDefaillances[i].checked)}
    setTableau(situationoeil,"situationoeil")
    console.log(situationoeil)
    event.preventDefault();
    demarer.setAttribute("href","baseline.html")
})

