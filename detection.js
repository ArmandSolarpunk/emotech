/**
 * Fichier : detection.js
 * 
 * Description : ce fichier permet de detecter les émotions resentis par la personne devant un tableau. 
 * 
 * Navigation : redirection vers l'annonce de la prochaine image  
 */

let score = getTableau("score")
let reponse = document.getElementById("reponse")

let emotion = getEmotion()
reponse.textContent = emotion

let vrai = document.getElementById("Vrai")
let faux = document.getElementById("Faux")

vrai.addEventListener("click",()=>{
    score.push(true)
    let emotionsResentis = getTableau("emotionsResentis");
    emotionsResentis.push(emotion);
    setTableau(emotionsResentis, "emotionsResentis");
    window.location.href = "Anonce.html";
})
faux.addEventListener("click",()=>{
    score.push(false)
    window.location.href = "EmotionsBis.html";
})