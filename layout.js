"use strict"

var flagcreat=false;

var prezzi = ["30", "60", "15", "5"];
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
  ctxAction[4].font = tileH+"px Arial";
  ctxAction[4].textAlign = "center";
  
  ctxAction[4].strokeText(money + "$", canvasAction[4].width/2, canvasAction[4].height-canvasAction[4].height/3);
  canvasAction[4].removeEventListener("click", clickP);
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
  hero.show();

}

function gameOver(){
  flaggameover=true;
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
        wave[i].setStep(wave[i].step*2);
        wave[i].setIncRad(wave[i].incradiants*2);
    }
    for(var i=0; i<turrets.length; i++){
      if(turrets[i] instanceof Missile)
        turrets[i].setStep(4);
        if(turrets[i] instanceof Mortar){
          turrets[i].setPstep(3);
          turrets[i].setTime(250);
        }
        if(turrets[i] instanceof Laser)
          turrets[i].setTime(250);
        if(turrets[i] instanceof Taser)
          turrets[i].setVel(4);
    }
    hero.step=16;
    canvasAction[7].removeEventListener("click", faster);
    ctxAction[7].clearRect(0, 0, canvasAction[7].width, canvasAction[7].height);
    ctxAction[7].strokeText("Slower", canvasAction[7].width/2, canvasAction[7].height-canvasAction[7].height/3);
    canvasAction[7].addEventListener("click", slower);
  }

}


function slower(){
  for(var i=0; i<wave.length; i++){
      wave[i].setStep(wave[i].step/2);
      wave[i].setIncRad(wave[i].incradiants/2);
  }
  for(var i=0; i<turrets.length; i++){
    if(turrets[i] instanceof Missile)
      turrets[i].setStep(2);
    if(turrets[i] instanceof Mortar){
      turrets[i].setPstep(1.5);
      turrets[i].setTime(500);
    }
    if(turrets[i] instanceof Laser)
      turrets[i].setTime(500);
    if(turrets[i] instanceof Taser)
      turrets[i].setVel(2);

  }
  hero.step=8;
  canvasAction[7].removeEventListener("click", slower);
  canvasAction[7].removeEventListener("click", faster);
  ctxAction[7].clearRect(0, 0, canvasAction[7].width, canvasAction[7].height);
  ctxAction[7].strokeText("Faster", canvasAction[7].width/2, canvasAction[7].height-canvasAction[7].height/3);
  canvasAction[7].addEventListener("click", faster);
}
