let petitbambou = document.getElementById("petitBambou")
let body=document.querySelector("body")
body.addEventListener("click",()=>{
  window.location.href = "Anonce.html"
})
const temps=startTimer()
console.log(temps)

let index=0
sessionStorage.setItem("indexBoucle", index);

let timestamp = []
setTableau(timestamp,"timestamp")

let emotionsResentis = []
setTableau(emotionsResentis,"emotionsResentis")

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
setTimeout(() => {
  window.location.href = "Anonce.html";
}, 30000);