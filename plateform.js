/**
 * fichier: plateform.js 
 * 
 * Description : permet de choisir si on est sur de l'aquisition de données ou sur du test de model 
 *  
 * navigation: envoie vers la page de self verification 
*/
let donnee = document.getElementById('donnee')
let model = document.getElementById('model')

model.addEventListener("click", ()=>{
    let version = 1
    localStorage.setItem("version", version);

})

donnee.addEventListener("click", ()=>{
    let version = 0
    localStorage.setItem("version", version);

})