"use strict"

var flagcreat=false;

var prezzi = ["15", "30", "60", "5"];
var text = ["Start!", "Pause", "Faster"];

function openGame() {
    document.getElementById('game').classList.add('shown');
    var element = document.getElementById("menu");
    element.parentNode.removeChild(element);
    element = document.getElementById("infos");
    element.parentNode.removeChild(element);
    setDims();
}

function openTutorial() {
    document.getElementById('modal-overlay').classList.add('shown');
    document.getElementById('infos').classList.add('shown');
}

function closeTutorial() {
    document.getElementById('modal-overlay').classList.remove('shown');
    document.getElementById('infos').classList.remove('shown');
}


function endCreation(){
  if(!initdone){
    alert("Seleziona un background!");
    return;
  }
  var ret = checkmat();
  if(!ret){
     alert("Mappa sbagliata!");
     return;
   }
  maincanvas.removeEventListener("contextmenu", deletep);
  flagcreat=true;
  for(var i=0; i<8; i++){
    ctxAction[i].clearRect(0, 0, canvasAction[i].width, canvasAction[i].height);
  }
  for(var i=5; i<8; i++){
    ctxAction[i].font = tileH+"px Arial";
    ctxAction[i].textAlign = "center";
    ctxAction[i].strokeText(text[i-5], canvasAction[i].width/2, canvasAction[i].height-canvasAction[i].height/3);
  }
  canvasAction[5].removeEventListener("click", clickP);
  canvasAction[6].removeEventListener("click", setP);
  canvasAction[7].removeEventListener("click", setP);

  canvasAction[5].addEventListener("click", startWave);
  canvasAction[6].addEventListener("click", pauseGame);
  canvasAction[7].addEventListener("click", faster);

  for(var i=8; i<10; i++){
    canvasAction[i].style.display = "none";
  }
  var collection = document.getElementsByClassName("pieces");
  for(var i=0; i<prezzi.length; i++){
    collection[i].title = "costo: "+prezzi[i];
  }
  drawElements();
  makepath();

}

function gameOver(){
  for(var i=0; i<8; i++){
    ctxAction[i].clearRect(0, 0, canvasAction[i].width, canvasAction[i].height);
    ctxAction[i].font = canvasAction[i].height/2.5+"px Arial";
    ctxAction[i].textAlign = "center";
    ctxAction[i].strokeText("GameOver", canvasAction[i].width/2, canvasAction[i].height-canvasAction[i].height/3);
  }
  addEventListener("resize", setDims);

}

function faster(){
  if(flaginitstart){
    for(var i=0; i<wave.length; i++){
      wave[i].setStep(4);
      wave[i].setIncRad(0.1);
    }
    canvasAction[7].removeEventListener("click", faster);
    ctxAction[7].clearRect(0, 0, canvasAction[7].width, canvasAction[7].height);
    ctxAction[7].strokeText("Slower", canvasAction[7].width/2, canvasAction[7].height-canvasAction[7].height/3);

    canvasAction[7].addEventListener("click", slower);
  }
}

function slower(){
  for(var i=0; i<wave.length; i++){
    wave[i].setStep(2);
    wave[i].setIncRad(0.05);
  }
  canvasAction[7].removeEventListener("click", slower);
  canvasAction[7].removeEventListener("click", faster);
  ctxAction[7].clearRect(0, 0, canvasAction[7].width, canvasAction[7].height);
  ctxAction[7].strokeText("Faster", canvasAction[7].width/2, canvasAction[7].height-canvasAction[7].height/3);
  canvasAction[7].addEventListener("click", faster);
}
