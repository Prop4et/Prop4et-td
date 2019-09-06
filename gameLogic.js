"use strict"
var flaginitstart = false;
var flagstart = false;
var wave;
var time;
var flaggameover= false;
var sworm;
var counterdeaths;
var timepause;

function startWave(){
  if(!flaggameover){
    if(!flaginitstart){
      counterdeaths=0;
      var wherex = 0;
      sworm = Math.floor(Math.random() * 20) + 1;
      enemycanvas.style.zIndex = "9";
      wave = new Array(sworm);
      for(var i=0; i<wave.length; i++){
        wave[i] = new Enemy(wherex, pad+piecedistance/2, piecedistance, i);
        wherex-=tileW/2;
      }
      clearInterval(time);
      for(var j=0; j<turrets.length; j++){
          turrets[j].targeti=0;
          turrets[j].counter=0;
        }
      }
    }
    flaginitstart = true;

    if(!flagstart){
      flagstart = true;
      removeEventListener("resize", setDims);
      time = setInterval(drawAnimations, 15);
    }
  }

function pauseGame(){
    flagstart=false;
    clearInterval(time);
}

function drawAnimations(){
  ctxenemy.clearRect(0, 0, ctxenemy.canvas.width, ctxenemy.canvas.height);
  for(var i=0; i<wave.length; i++){
    if(wave[i].alive){
      wave[i].drawEnemy();
      for(var j=0; j<turrets.length; j++){
        var d = new Date();
        var time = d.getTime();
        turrets[j].shot(wave[i], wave, time);
      }
    }
    else
      counterdeaths++;
  }

  if(counterdeaths==wave.length-1){
    flagstart=false;
    flaginitstart=false;
    addEventListener("resize", setDims);
  }
}
//when it reaches the end delete wave
