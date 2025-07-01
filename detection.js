/**
 * Fichier : detection.js
 * 
 * Description : ce fichier permet de detecter les émotions resentis par la personne devant un tableau. 
 * 
 * Navigation : redirection vers l'annonce de la prochaine image  
 */

let score = getTableau("score")
 stopDetection()

let vrai = document.getElementById("Vrai")
let faux = document.getElementById("Faux")

vrai.addEventListener("click",()=>{
    score.push(true)
    window.location.href = "Anonce.html";
})
faux.addEventListener("click",()=>{
    score.push(false)
    window.location.href = "Anonce.html";
})