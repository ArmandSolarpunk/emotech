/**
 * Fichier : baseline.js
 * 
 * Description : temps calme qui permet de récuperer les emotions de base d'une personne  
 * 
 * Navigation : à la fin du temps calme, redirection vers la le debut des tableaux 
 */

//selection des éléments de la page 
let petitbambou = document.getElementById("petitBambou")
let body=document.querySelector("body")

// petit racourcis pour skip en cliquant sur la page  
body.addEventListener("click",()=>{
  window.location.href = "Anonce.html"
})

// communication avec le serveur pour le lancer 
startRecording()

//recupératione du temps 0
const temps=startTimer()
console.log(temps)

//ammorce de l'indice d'avancement 
let index=0
sessionStorage.setItem("indexBoucle", index);

// reset des tableaux dans le local storage 
let timestamp = []
setTableau(timestamp,"timestamp")

let emotionsResentis = []
setTableau(emotionsResentis,"emotionsResentis")

let commentaires = []
setTableau(commentaires,"commentaires")

// Messages petit bambou qui popent régulièrement 
setTimeout(() => {
  petitbambou.textContent = "Posez-vous un instant et Respirez";
}, 5000);
setTimeout(() => {
  petitbambou.textContent = "Il y a rien faire, que écouter votre souffle";
}, 10000);
setTimeout(() => {
  petitbambou.textContent = " Écouter le silence";
}, 15000);
setTimeout(() => {
  petitbambou.textContent = "Même au milieu du bruit, il y a un espace calme en vous";
}, 20000);
setTimeout(() => {
  petitbambou.textContent = "Reposez-vous dans cet espace";
}, 25000);

// fin de la baseline 
setTimeout(() => {
  window.location.href = "Anonce.html";
}, 30000);