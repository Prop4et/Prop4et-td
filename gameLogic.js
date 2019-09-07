"use strict"
var flaginitstart = false;
var flagstart = false;
var wave;
var time;
var flaggameover= false;
var sworm;
var timepause;
var money = 1000;
var add=0;

function startWave(){

  if(!flaggameover){
    if(!flaginitstart){
      money+=5*add;
      
      add=0;
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
      document.addEventListener("keydown", controlHero);
      document.addEventListener("keyup", startHeroPost);

      time = setInterval(drawAnimations, 15);
    }
  }

function pauseGame(){
    document.removeEventListener("keydown", controlHero);
    flagstart=false;
    clearInterval(time);
}

function drawAnimations(){
  ctxenemy.clearRect(0, 0, ctxenemy.canvas.width, ctxenemy.canvas.height);
  ctxhero.clearRect(0, 0, ctxhero.canvas.width, ctxhero.canvas.height);
  hero.show(wave)
  var counterdeaths=0;
  for(var i=0; i<wave.length; i++){
    if(wave[i].alive){
      wave[i].drawEnemy();
      for(var j=0; j<turrets.length; j++){
        var d = new Date();
        var time = d.getTime();
        turrets[j].shot(wave[i], wave, time);
      }
    }
    else{
      counterdeaths++;
    }
  }
  ctxAction[4].clearRect(0, 0, canvasAction[4].width, canvasAction[4].height);
  ctxAction[4].strokeText(money + counterdeaths*5+ "$", canvasAction[4].width/2, canvasAction[4].height-canvasAction[4].height/3);
  if(counterdeaths+1==wave.length){
    add=counterdeaths+1;
    flagstart=false;
    flaginitstart=false;

    addEventListener("resize", setDims);
  }
}
//when it reaches the end delete wave
