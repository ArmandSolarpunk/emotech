let emotech_connection = document.getElementById("Emotech-connection")
let suite = document.getElementById("suite") 
 //changer le ecent pour reperer la connection avec le device//
emotech_connection.addEventListener("click",()=> {    
    if (emotech_connection.textContent==="OFF"){
        emotech_connection.classList.add("ON")
    emotech_connection.classList.remove("OFF")
    emotech_connection.textContent="ON"
    suite.setAttribute("href","test_vision.html")
}
        else{
        emotech_connection.classList.add("OFF")
    emotech_connection.classList.remove("ON")
    emotech_connection.textContent="OFF"
    suite.removeAttribute("href","test_vision.html")
}
})
