/**
 * Fichier : emotion.js
 * 
 * Description : ce fichier permet de récupérer les émotions ressenties, la valence et l’arousal choisis par la personne devant un tableau.
 * 
 * Navigation : redirection vers l'annonce de la prochaine image  
 */

// Récupération dans le local storage des tableaux
let emotionsResentis = getTableau("emotionsResentis");
let arousal = getTableau("arousal");
let valence = getTableau("valence");

// Sélection des éléments HTML
let listeemotion = document.getElementsByClassName("boutonemotion");
let listearousal = document.querySelectorAll("#arousal .bouton");
let listevalence = document.querySelectorAll("#valence .bouton");
let valider = document.getElementById("valider");

let emotionChoisie = null;
let arousalChoisi = null;
let valenceChoisie = null;

        console.log(emotionsResentis)
        console.log(arousal)
        console.log(valence)
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

// --- Gestion des clics pour arousal ---
for (let i = 0; i < listearousal.length; i++) {
    let arousalActuel = listearousal[i];

    arousalActuel.addEventListener("click", (event) => {
        listearousal.forEach(bouton => bouton.style.removeProperty("opacity"));
        arousalChoisi = event.target;
        arousalChoisi.style.opacity = '0.5';
    });
}

// --- Gestion des clics pour valence ---
for (let i = 0; i < listevalence.length; i++) {
    let valenceActuelle = listevalence[i];

    valenceActuelle.addEventListener("click", (event) => {
        listevalence.forEach(bouton => bouton.style.removeProperty("opacity"));
        valenceChoisie = event.target;
        valenceChoisie.style.opacity = '0.5';
    });
}

// --- Validation : mise à jour du localStorage et redirection ---
valider.addEventListener("click", () => {
    if (emotionChoisie !== null && arousalChoisi !== null && valenceChoisie !== null) {
        emotionsResentis.push(emotionChoisie.id);
        arousal.push(arousalChoisi.textContent);
        valence.push(valenceChoisie.textContent);

        setTableau(emotionsResentis, "emotionsResentis");
        setTableau(arousal, "arousal");
        setTableau(valence, "valence");

        window.location.href = "Anonce.html";
    } else {
        alert("Merci de sélectionner une émotion, une valence et un niveau d arousal avant de valider.");
    }
});