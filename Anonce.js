let illustration=document.querySelector("h1")
let revelation=document.querySelector("a")
console.log(illustration)
let index = parseInt(sessionStorage.getItem("indexBoucle"))
if (index < listepeintures.length){
    illustration.textContent="Peinture " + (index+1);}
else{

    illustration.textContent="The End"

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


  stopRecording()
}
