let illustration=document.querySelector("h1")
let revelation=document.querySelector("a")
console.log(illustration)
let index = parseInt(sessionStorage.getItem("indexBoucle"))
index++
if (index < listepeintures.length){
    illustration.textContent="Peinture " +index
sessionStorage.setItem("indexBoucle", index);}
else{

    stopRecording()

    illustration.textContent="C'est fini !"

    revelation.textContent = 'Acceuil'
    revelation.href= 'plateform.html'
    
    let situationoeil=getTableau("situationoeil")
    console.log(situationoeil)
    
    let timestamp=getTableau("timestamp")
    console.log(timestamp)

    let emotionsResentis=getTableau("emotionsResentis")
    console.log(emotionsResentis)

    let commentaires=getTableau("commentaires")
    console.log(commentaires)

    let participant = {
    id : parseFloat(localStorage.getItem("startTime")),   
    situationoeil,
    timestamp,
    emotionsResentis,
    commentaires
}
  fetch("http://localhost:3000/api/emotion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(participant)
  })
  .then(res => res.json())
  .then(data => { console.log("Réponse du serveur :", data);
    alert("Objet envoyé !");
  })
  .catch(error => {
    console.error("Erreur :", error);
  });
}
