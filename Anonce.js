/**
 * Fichier : Annonce.js
 * 
 * Description : ce fichier permet de préparer le spéctateur à la vud'une image avant qu'il la voit vraiment 
 * Sert aussi de fin d'experience  
 * 
 * Navigation : redirection vers la baseline une fois le quetionnair envoyé et appui du bouton 
 */

//selection des éléments html
if (version == 0){
  liste_peintures = listepeintures
}
else{
  liste_peintures = liste2peintures
}

let illustration=document.querySelector("h1")
let revelation=document.querySelector("a")

//change le numero de la peinture 
let index = parseInt(sessionStorage.getItem("indexBoucle"))
if (index < liste_peintures.length){
    illustration.textContent="Peinture " + (index+1);}

// Si il n'y a plus de peinture on passe sur la page de fin     
else{

    illustration.textContent="The End"

    revelation.textContent = 'Accueil'
    revelation.href= 'plateform.html'

    
    if (version == 0){
    // Récuperation de toutres les informations données précédements
    let situationoeil=getTableau("situationoeil")
    console.log(situationoeil)
    
    let timestamp=getTableau("timestamp")
    console.log(timestamp)

    let emotionsResentis=getTableau("emotionsResentis")
    console.log(emotionsResentis)

    let arousal=getTableau("arousal")
    console.log(arousal)

    let valence=getTableau("valence")
    console.log(valence)
//création d'un objet participant avec tous les tableaux 

    let participant = {
    id : parseFloat(localStorage.getItem("startTime")),   
    situationoeil,
    timestamp,
    emotionsResentis,
    arousal,
    valence

// on envoie l'objet au serveur Nodemon pour qu'il soit traité     
}
fetch("http://localhost:3000/save-csv", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(participant)
})
.then(res => res.json())
.then(data => { console.log("CSV enregistré :", data); })
.catch(error => { console.error("Erreur :", error); });

// arret de l'enregistrement voir app.js
  stopRecording()
}
}