/**
 * Fichier : data.js
 * 
 * Description : contient les principales fonctions utilisées par la plateforme web 
 * la liste des tableaux utilisées pour l'expérience 
 * ainsi que des rapelles des noms de listes utilisés pour le local storage 
 * 
 */

/**
 * Rappels Local storage
 * 
 * situationoeil=[]  
 * timestamp = []
 * emotionsResentis = []
 * arousal= []
 * valence = []
 * 
 * version
 * score = []
 * 
 */

// listes des tableaux pour l'expérience
let listepeintures=['https://uploads6.wikiart.org/images/richard-wilson/italian-landscape-morning-1765.jpg',
'https://uploads4.wikiart.org/images/oscar-dominguez/m-quina-de-coser-electro-sexual-1934.jpg',
'https://uploads1.wikiart.org/images/jean-honore-fragonard/young-girl-reading.jpg',
'https://uploads3.wikiart.org/00144/images/jean-francois-millet/jean-fran-ois-millet-gleaners-google-art-project.jpg',
'https://uploads6.wikiart.org/images/william-hamilton/john-philip-kemble-1757-1823-as-richard-in-richard-iii-by-william-shakespeare-1788.jpg',
'https://uploads5.wikiart.org/images/eugeniusz-ak/shepherd-1910.jpg',
'https://uploads2.wikiart.org/images/eyvind-earle/green-hillside-1970.jpg',
'https://uploads7.wikiart.org/00103/images/maarten-de-vos/portrait-of-antonius-anselmus-his-wife-and-their-children-1577.jpg',
'https://uploads5.wikiart.org/images/jules-pascin/in-the-hotel-room-1908.jpg',
'https://uploads8.wikiart.org/00157/images/oleg-holosiy/1991-8.jpg',
'https://uploads5.wikiart.org/images/jacob-jordaens/as-the-old-sang-so-the-young-pipe-1640.jpg',
'https://uploads1.wikiart.org/images/arnulf-rainer/untitled-death-mask-1978-1.jpg',
'https://uploads6.wikiart.org/images/marie-bracquemond/woman-with-an-umbrella-1880.jpg',
'https://uploads7.wikiart.org/images/william-turner/the-shipwreck.jpg',
'https://uploads1.wikiart.org/images/giuseppe-santomaso/incanto-1958.jpg',
'https://uploads6.wikiart.org/images/henry-herbert-la-thangue/portrait-of-a-young-girl-1880.jpg',
'https://uploads3.wikiart.org/images/john-william-godward/dolce-far-niente-1904.jpg',
'https://uploads5.wikiart.org/images/jean-michel-basquiat/boxer.jpg',
'https://uploads6.wikiart.org/images/william-orpen/the-spanish-woman-1905.jpg',
'https://uploads5.wikiart.org/images/pierre-auguste-renoir/jeanne-samary-in-a-low-necked-dress-1877.jpg'
]

let liste2peintures=["https://uploads5.wikiart.org/images/max-ernst/the-virgin-spanking-the-christ-child-before-three-witnesses-andre-breton-paul-eluard-and-the-1926.jpg",
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



const version = parseFloat(localStorage.getItem("version"));



//fonction de definition d'un objet dans le local storage 
console.log(urls);
function setTableau(tableau, nomTableau){
localStorage.setItem(nomTableau, JSON.stringify(tableau));
}

// fonction de récupération d'un objet dans le local storage 
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

// fonction qui communique avec le serveur nodemon et va demarer sur l'app le début de l'aquisition de données 
function startRecording() {
    fetch('http://localhost:3000/start-recording')
      .then(response => response.text())
      .then(data => {
          console.log('Réponse serveur :', data);
      })
      .catch(error => console.error('Erreur :', error));
}

// fonction qui communique avec le serveur nodemon et va demarer sur l'app le début de l'aquisition de données 
function stopRecording() {
    fetch('http://localhost:3000/stop-recording')
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Erreur :', error));
}

function baseline(){
      fetch('http://localhost:3000/baseline')
      .then(response => response.text())
      .then(data => {
          console.log('Réponse serveur :', data);
      })
      .catch(error => console.error('Erreur :', error));
}

function stopBaseline(){
      fetch('http://localhost:3000/stopBaseline')
      .then(response => response.text())
      .then(data => {
          console.log('Réponse serveur :', data);
      })
      .catch(error => console.error('Erreur :', error));
    }

function startDetection(){
      fetch('http://localhost:3000/startDetection')
      .then(response => response.text())
      .then(data => {
          console.log('Réponse serveur :', data);
      })
      .catch(error => console.error('Erreur :', error));
    }

async function getEmotion() {
    try {
        const response = await fetch('http://localhost:3000/stopDetection');
        const data = await response.json();
        return data.emotion;  // contient l’émotion détectée
    } catch (error) {
        console.error("Erreur lors de la récupération de l'émotion :", error);
        return "Erreur";
    }
}

getEmotion().then(emotion => {
    let reponse = document.getElementById("reponse");
    reponse.textContent = emotion;
});