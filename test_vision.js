/**
 * Fichier : test_vision.js
 * 
 * Description : ce fichier permet de récupérer si la personne à des problèmes visuels ou pas. 
 * 
 * Navigation : redirection vers la baseline une fois le quetionnair envoyé et appui du bouton 
 */

//selection du bouton démarer
let demarer = document.getElementById("demarer")

// selection des case à cocher 
let baliseDefaillances = document.querySelectorAll('input[type="checkbox"]')

// déclaration de la liste de booléens des problèmes de vu 
let situationoeil=[] 

//selection du formulaire à remmplir 
const form =document.querySelector('form')

//création d'un événement pour l'envoie du formulaire, et stockage des résultats dans le local storage.  
form.addEventListener("submit", (event)=>{
    for (let i=0; i<baliseDefaillances.length; i++){ 
    situationoeil.push(baliseDefaillances[i].checked)}
    setTableau(situationoeil,"situationoeil")
    console.log(situationoeil)
    event.preventDefault();
    
    // rend le bouton démarrer utilisable 
    demarer.setAttribute("href","baseline.html")
})

