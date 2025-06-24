/**
 * fichier: plateforme_connection.js 
 * 
 * Description : petit cheks que tout soit bien prêt pour le début de l'experience
 *  
 * navigation: envoie vers la page de test_vision après self verification 
*/

// sélection des élements html
let emotech_connection = document.getElementById("Emotech-connection")
let suite = document.getElementById("suite") 
 
//evenement liquer sur le bouton OFF pour le rendre ON et continuer l'experience 
emotech_connection.addEventListener("click",()=> {    
    if (emotech_connection.textContent==="OFF"){
        emotech_connection.classList.add("ON")
    emotech_connection.classList.remove("OFF")
    emotech_connection.textContent="ON"
    suite.setAttribute("href","test_vision.html")
}
// ça sert à rien mais si on reclique il redevient OFF
        else{
        emotech_connection.classList.add("OFF")
    emotech_connection.classList.remove("ON")
    emotech_connection.textContent="OFF"
    suite.removeAttribute("href","test_vision.html")
}
})
