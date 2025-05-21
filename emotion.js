let listeemotion = document.getElementsByClassName("boutonemotion")
let emotionsResentis = getTableau("emotionsResentis")
console.log(emotionsResentis)
for (let i = 0; i<listeemotion.length; i++){
let emotionActuelle = listeemotion[i]

emotionActuelle.addEventListener("click",(event)=>{
    emotionChoisie = event.target
    emotionsResentis.push(emotionChoisie.id)
    setTableau(emotionsResentis,"emotionsResentis")
    window.location.href = "Anonce.html";
})
}
