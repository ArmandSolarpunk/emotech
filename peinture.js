/**
 * Fichier : peinture.js
 * 
 * Description : Affiche successivement des peintures pendant 5 secondes chacune, 
 * enregistre le timestamp d'affichage  de la peinture afin de pouvoir découper l'enregistrement.
 * redirige l'utilisateur vers une page de sélection d'émotion
 * CLIQUE SUR L'IMAGE POUR PASER DIRECTEMENT AUX EMOTIONS 
 * 
 * Navigation : redirection automatique vers emotions.html après chaque image
 */

// Recupération de la variable timestamp dans le local storage
let timestamp = getTableau("timestamp")

// Récupération du timestamp de l'affichafe de de l'image 
timestamp.push(getTime())

// mise à jour du tableau dans le local storage 
setTableau(timestamp,"timestamp")

// recupération de l'indice d'avancement de l'experience dans le local storage 
let index = parseInt(sessionStorage.getItem("indexBoucle"))

// changement de l'image affiché 
let illustation=document.querySelector("img")
illustation.src=listepeintures[index]

// augmentation de l'indice et stockage dans le local storage 
index++
sessionStorage.setItem("indexBoucle", index)

// duréee de l'affichage de l'image 5s puis redirection vers la page de choix d'émotions 
setTimeout(() => {
  window.location.href = "emotions.html";
}, 5000);
