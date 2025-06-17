let timestamp = getTableau("timestamp")
timestamp.push(getTime())
setTableau(timestamp,"timestamp")
let index = parseInt(sessionStorage.getItem("indexBoucle"))
let illustation=document.querySelector("img")
illustation.src=listepeintures[index]
index++
sessionStorage.setItem("indexBoucle", index)
setTimeout(() => {
  window.location.href = "emotions.html";
}, 5000);
