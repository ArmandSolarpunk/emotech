/**
 * Fichier : emotion.js
 * 
 * Description : ce fichier permet de récupérer les émotions ressenties, la valence et l’arousal choisis par la personne devant un tableau.
 * 
 * Navigation : redirection vers l'annonce de la prochaine image  
 */

// Récupération dans le local storage des tableaux
let emotionsResentis = getTableau("emotionsResentis");

// Sélection des éléments HTML
let listeemotion = document.getElementsByClassName("boutonemotion");
let valider = document.getElementById("valider");

let emotionChoisie = null;


        console.log(emotionsResentis)
// --- Gestion des clics pour les émotions ---
for (let i = 0; i < listeemotion.length; i++) {
    let emotionActuelle = listeemotion[i];

    emotionActuelle.addEventListener("click", (event) => {
        for (let j = 0; j < listeemotion.length; j++) {
            listeemotion[j].style.removeProperty("opacity");
        }
        emotionChoisie = event.target;
        emotionChoisie.style.opacity = '0.5';
    });
}

// --- Validation : mise à jour du localStorage et redirection ---
valider.addEventListener("click", () => {
    if (emotionChoisie !== null) {
        emotionsResentis.push(emotionChoisie.id);
        setTableau(emotionsResentis, "emotionsResentis");
        window.location.href = "Anonce.html";
    } else {
        alert("Merci de sélectionner une émotion avant de valider.");
    }
});