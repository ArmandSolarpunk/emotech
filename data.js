// situationoeil=[]  
// timestamp = []
// emotionsResentis = []
//commentaires=[]

let listepeintures=["https://uploads5.wikiart.org/images/max-ernst/the-virgin-spanking-the-christ-child-before-three-witnesses-andre-breton-paul-eluard-and-the-1926.jpg",
   "https://uploads0.wikiart.org/00130/images/david-morier/the-battle-of-culloden-1746.jpg",
    "https://uploads3.wikiart.org/images/francisco-goya/execution-of-the-defenders-of-madrid-3rd-may-1808-1814.jpg", 
    "https://uploads0.wikiart.org/images/vasily-perov/last-journey-1865.jpg", 
    "https://uploads1.wikiart.org/images/vincent-van-gogh/prisoners-exercising-prisoners-round-1890.jpg", 
    "https://uploads0.wikiart.org/images/edvard-munch/death-in-the-sickroom-1893.jpg", 
    "https://uploads5.wikiart.org/images/oskar-kokoschka/not_detected_235852.jpg",
    "https://uploads7.wikiart.org/images/vasily-vereshchagin/the-apotheosis-of-war-1871.jpg", 
    "https://uploads8.wikiart.org/images/william-adolphe-bouguereau/dante-and-virgil-in-hell-1850.jpg", 
    "https://uploads8.wikiart.org/images/jules-dupre/calm-before-the-storm-1870.jpg", 
    "https://uploads1.wikiart.org/images/nikolai-ge/last-supper.jpg", 
    "https://uploads7.wikiart.org/images/max-pechstein/the-yellow-and-black-jersey-1909.jpg", 
    "https://uploads6.wikiart.org/images/george-catlin/h-l-te-m-l-te-t-z-te-n-ek-ee-sam-perryman-creek-chief-1834.jpg", 
    "https://uploads5.wikiart.org/images/albert-marquet/the-port-of-saint-tropez-1905.jpg", 
    "https://uploads0.wikiart.org/images/jean-honore-fragonard/the-blind-man-s-bluff-game.jpg", 
    "https://uploads5.wikiart.org/images/paul-cezanne/mont-sainte-victoire-3.jpg", 
    "https://uploads0.wikiart.org/images/john-ferren/lutte-as-ciel-1937.jpg", 
    "https://uploads5.wikiart.org/images/peter-phillips/spectrocoupling-1972.jpg", 
    "https://uploads3.wikiart.org/images/rene-magritte/collective-invention-1934(1).jpg",
     "https://uploads1.wikiart.org/images/roger-de-la-fresnaye/man-with-a-red-kerchief-1922.jpg"]


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
    fetch('http://localhost:3000/start-recording')
      .then(response => response.text())
      .then(data => {
          console.log('Réponse serveur :', data);
      })
      .catch(error => console.error('Erreur :', error));
}

function stopRecording() {
    fetch('http://localhost:3000/stop-recording')
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Erreur :', error));
}