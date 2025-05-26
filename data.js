// situationoeil=[]  
// timestamp = []
// emotionsResentis = []
//commentaires=[]

let listepeintures=[ "https://uploads3.wikiart.org/00123/images/charles-courtney-curran/in-the-luxembourg-garden-1889.jpg", 
  "https://uploads1.wikiart.org/images/keith-haring/the-marriage-of-heaven-and-hell-1984.jpg",
   "https://uploads3.wikiart.org/images/j-zsef-rippl-r-nai/uncle-piacsek-in-front-of-the-black-sideboard-1906.jpg", 
   "https://uploads2.wikiart.org/00124/images/vadym-meller/monk-for-the-play-mazeppa-1920.jpg"]


console.log(urls);
function setTableau(tableau, nomTableau){
localStorage.setItem(nomTableau, JSON.stringify(tableau));
}

function getTableau(nomTableau){
let tableauRecupere = JSON.parse(localStorage.getItem(nomTableau));
return tableauRecupere
}

// Démarre le timer
function startTimer() {
  const startTime = Date.now(); // En ms 
  localStorage.setItem("startTime", startTime);
  return startTime
}

// Récupère le temps écoulé en millisecondes
function getTime() {
  const startTime = parseFloat(localStorage.getItem("startTime"));
  return Date.now() - startTime;
}

function finAquisition(){
  localStorage.removeItem("startTime")
}
  function startRecording() {
    fetch('/start-recording');
  }

  function stopRecording() {
    fetch('/stop-recording');
  }