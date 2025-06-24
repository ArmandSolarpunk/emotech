/**
 * Fichier : emotion.js
 * 
 * Description : ce fichier permet de récupérer les émotions resentis (et un commentaire) par la personne devant un tableau. 
 * 
 * Navigation : redirection vers l'annonce de la prochaine image  
 */

//Récupération dans le local storage des tableaux
let emotionsResentis = getTableau("emotionsResentis");
let commentaires = getTableau("commentaires");

//selection des éléments html à prendre  
let listeemotion = document.getElementsByClassName("boutonemotion");
let valider = document.getElementById("valider");
let commentaire = document.getElementById("commentaire")

// petites verification des éléments déjà donnés 
console.log(emotionsResentis);
console.log(commentaires);

//programme qui permet de séléctionner un émotion 
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
// Actualisation des nouvelles informations dans le local storage et changement de page 
valider.addEventListener("click",()=>{
    if(emotionChoisie!== null){
    emotionsResentis.push(emotionChoisie.id)
    commentaires.push(commentaire.value)
    setTableau(emotionsResentis,"emotionsResentis")
    setTableau(commentaires,"commentaires")
    window.location.href = "Anonce.html";
    }

})
