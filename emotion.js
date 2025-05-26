let listeemotion = document.getElementsByClassName("boutonemotion");
let emotionsResentis = getTableau("emotionsResentis");
let commentaires = getTableau("commentaires");
let valider = document.getElementById("valider");
let commentaire = document.getElementById("commentaire")

console.log(emotionsResentis);
console.log(commentaires);

for (let i = 0; i<listeemotion.length; i++){
let emotionActuelle = listeemotion[i];

emotionActuelle.addEventListener("click",(event)=>{
    for (let j = 0; j<listeemotion.length; j++){
listeemotion[j].style.removeProperty("opacity");
//opacity='1.0'
    }
    emotionChoisie = event.target;
    emotionChoisie.style.opacity='0.5';
    
})
}
valider.addEventListener("click",()=>{
    if(emotionChoisie!== null){
    emotionsResentis.push(emotionChoisie.id)
    commentaires.push(commentaire.value)
    setTableau(emotionsResentis,"emotionsResentis")
    setTableau(commentaires,"commentaires")
    window.location.href = "Anonce.html";
    }

})
