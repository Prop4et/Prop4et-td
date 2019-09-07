"use strict"


var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

/*potenzialmente questi 3 potrei settarli all' onclick event e spostare l'onclick di là, poi ci ragiono*/
/*NO, NON FARLO*/
var maincanvas = document.getElementById("main-canvas");
var ctxmain = maincanvas.getContext("2d");

var enemycanvas = document.getElementById("enemy-canvas");
var ctxenemy = enemycanvas.getContext("2d");

var herocanvas = document.getElementById("hero-canvas");
var ctxhero = herocanvas.getContext("2d");

var dragdropcanvas = document.getElementById("dragdrop");
var ctxdragdrop = dragdropcanvas.getContext("2d");

var dragturretcanvas = document.getElementById("dragturret");
var ctxdragturret = dragdropcanvas.getContext("2d");

var canvasAction = [];
var ctxAction = [];

var flagclick=false;

var trt1 = new Image();
var trt2 = new Image();
var trt3 = new Image();
var trt4 = new Image();
var img1 = new Image();
var img2 = new Image();
var img3 = new Image();
var hero;

var m;

var index;
addEventListener("resize", setDims);


function setDims(){


  var w = window.innerWidth;

  var h = window.innerHeight ;

  var w1=Math.floor(w*68/100);
  var h1=Math.floor(h*73/100);


  document.getElementById("gamebox").style.height = h1+"px";
  document.getElementById("gamebox").style.width = w1+"px";
  m = w1*2/100;
  document.getElementById("gamebox").style.marginLeft = m+"px";
  document.getElementById("gamebox").style.marginRight = m+"px";

  ctx.canvas.width = w1;
  ctxmain.canvas.width = w1;
  ctxenemy.canvas.width = w1;
  ctxdragturret.canvas.width = w1;
  ctxhero.canvas.width = w1;


  ctx.canvas.height = h1;
  ctxmain.canvas.height = h1;
  ctxenemy.canvas.height = h1;
  ctxdragturret.canvas.height = h1;
  ctxhero.canvas.height = h1;



  var w2 = Math.floor(w1/4);
  var h2 = Math.floor(h1/5);

  canvasAction[0] = document.getElementById("straightns");
  canvasAction[1] = document.getElementById("straightew");
  canvasAction[2] = document.getElementById("corner1/4");
  canvasAction[3] = document.getElementById("corner2/4");
  canvasAction[4] = document.getElementById("corner3/4");
  canvasAction[5] = document.getElementById("corner4/4");
  canvasAction[6] = document.getElementById("bg1");
  canvasAction[7] = document.getElementById("bg2");
  canvasAction[8] = document.getElementById("bg3");
  canvasAction[9] = document.getElementById("bg4");
  var i;
  for(i=0; i<10; i++){
    ctxAction[i] = canvasAction[i].getContext("2d");
    ctxAction[i].canvas.whidth = w2;
    ctxAction[i].canvas.height = h2;
    ctxAction[i].lineWidth = 5;
    ctxAction[i].strokeStyle = "#e87dcd"
  }
  ctxdragdrop.canvas.height=document.getElementById("divcont").clientHeight-m/2.5;
  ctxdragdrop.canvas.width=document.getElementById("divcont").clientWidth-m;
  ctxdragdrop.canvas.style.marginLeft = m+"px";
  ctxdragdrop.canvas.style.marginRight = m+"px";


  if(!flagcreat){
    drawStraights();
    drawCurves();
    initdone ? resizeImages() : drawImages();
  }else{
    if(!flaggameover){
      resizeElem();
      for(var i=5; i<8; i++){
        ctxAction[i].font = tileH+"px Arial";
        ctxAction[i].textAlign = "center";
        ctxAction[i].strokeText(text[i-5], canvasAction[i].width/2, canvasAction[i].height-canvasAction[i].height/3);
      }
      ctxAction[4].font = tileH+"px Arial";
      ctxAction[4].textAlign = "center";
      ctxAction[4].strokeText(money + "$", canvasAction[4].width/2, canvasAction[4].height-canvasAction[4].height/3);
      hero.resizeHero(w1/2, h1/2);
      hero.show();
    }
    else gameOver();
  }
  if(selectedBg!=0){
    resizeMap();
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}



function drawStraights(){
  var w = ctxAction[1].canvas.width;
  var h = ctxAction[1].canvas.height;
  var roadW = Math.floor(w/5);
  ctxAction[1].moveTo(roadW*2, h);
  ctxAction[1].lineTo(roadW*2, 0);
  ctxAction[1].moveTo(roadW*3, 0);
  ctxAction[1].lineTo(roadW*3, h);
  ctxAction[1].stroke();

  w = ctxAction[0].canvas.width;
  h = ctxAction[0].canvas.height;

  var roadH = Math.floor(h/3);
  var roadW = Math.floor(w/5);
  ctxAction[0].moveTo(roadW, roadH);
  ctxAction[0].lineTo(roadW*4, roadH);
  roadH = roadH*2;
  ctxAction[0].moveTo(roadW, roadH);
  ctxAction[0].lineTo(roadW*4, roadH);
  ctxAction[0].stroke();
}

function drawCurves(){
  var w;
  var h;
  var cx;
  var cy = 0;

  var radius;
  var coeff = 0.5;
  var startAngle = 0*Math.PI;
  var endAngle =  coeff*Math.PI;
  for(var i=2; i<6; i++){
    w = ctxAction[i].canvas.width;
    h = ctxAction[i].canvas.height;
    if(i<=3)
      if(i%2==0)
        cx = Math.floor(w/5);
      else
        cx = Math.floor(w/5*4);
    else{
      cy=h;
      if(i%2!=0)
        cx = Math.floor(w/5);
      else
        cx = Math.floor(w/5*4);
      }
    radius = h-(2*h/100);
    ctxAction[i].moveTo(cx,cy);
    ctxAction[i].beginPath();
    ctxAction[i].arc(cx,cy,radius,startAngle,endAngle);
    ctxAction[i].stroke();
    ctxAction[i].closePath();

    radius = h-(45*h/100);

    ctxAction[i].moveTo(cx,cy);
    ctxAction[i].beginPath();
    ctxAction[i].arc(cx,cy,radius,startAngle,endAngle);
    ctxAction[i].stroke();
    ctxAction[i].closePath();
    coeff+=0.5;
    startAngle = endAngle;
    endAngle = coeff*Math.PI;
  }
}

function drawImages(){

  img1.onload = function () {
      ctxAction[6].drawImage(img1, 0, 0, 1280, 720, 0, 0, ctxAction[6].canvas.width, ctxAction[6].canvas.height);
  };
  img1.src = 'imgs/6.jpg';
  img2.onload = function () {
    ctxAction[7].drawImage(img2, 0, 0, 1280, 720, 0, 0, ctxAction[7].canvas.width, ctxAction[7].canvas.height);
  };
  img2.src = 'imgs/7.jpg';
  img3.onload = function () {
    ctxAction[8].drawImage(img3, 0, 0, 1280, 720, 0, 0, ctxAction[8].canvas.width, ctxAction[8].canvas.height);
  };
  img3.src = 'imgs/8.jpg';
  ctxAction[9].font = canvasAction[9].height/1.5+"px Arial";
  ctxAction[9].textAlign = "center";
  ctxAction[9].strokeText("Next", canvasAction[9].width/2, canvasAction[9].height-canvasAction[9].height/6);

  for(var i=6; i<9; i++)
    canvasAction[i].addEventListener("click", setP);
}

function resizeImages(){
  ctxAction[6].drawImage(img1, 0, 0, 1280, 720, 0, 0, ctxAction[6].canvas.width, ctxAction[6].canvas.height);
  ctxAction[7].drawImage(img2, 0, 0, 1280, 720, 0, 0, ctxAction[7].canvas.width, ctxAction[7].canvas.height);
  ctxAction[8].drawImage(img3, 0, 0, 1280, 720, 0, 0, ctxAction[8].canvas.width, ctxAction[8].canvas.height);
  ctxAction[9].font = tileH+"px Arial";
  ctxAction[9].textAlign = "center";
  ctxAction[9].strokeText("Next", canvasAction[9].width/2, canvasAction[9].height-canvasAction[9].height/6);
}

function drawElements(){
  var heightp = ctxAction[0].canvas.height*70/100;
  var center = (ctxAction[0].canvas.height-heightp)/2;
  trt1.onload = function () {
      ctxAction[0].drawImage(trt1, 0, 0, 25, 25, ctxAction[0].canvas.width/3, 0+center, heightp, heightp);
  };
  trt1.src = 'imgs/turrets/laser.png';

  trt2.onload = function () {
      ctxAction[1].drawImage(trt2, 0, 0, 25, 25, ctxAction[1].canvas.width/3, 0+center, heightp, heightp);
  };
  trt2.src = 'imgs/turrets/missile.png';

  trt3.onload = function () {
      ctxAction[2].drawImage(trt3, 0, 0, 25, 25, ctxAction[2].canvas.width/3, 0+center, heightp, heightp);
  };
  trt3.src = 'imgs/turrets/mortar.png';

  trt4.onload = function () {
      ctxAction[3].drawImage(trt4, 0, 0, 25, 25, ctxAction[3].canvas.width/3, 0+center, heightp, heightp);
  };
  trt4.src = 'imgs/turrets/tazer.png';
}

function resizeElem(){
  var heightp = ctxAction[0].canvas.height*70/100;
  var center = (ctxAction[0].canvas.height-heightp)/2;
  ctxAction[0].drawImage(trt1, 0, 0, 25, 25, ctxAction[0].canvas.width/3, 0+center, heightp, heightp);
  ctxAction[1].drawImage(trt2, 0, 0, 25, 25, ctxAction[1].canvas.width/3, 0+center, heightp, heightp);
  ctxAction[2].drawImage(trt3, 0, 0, 25, 25, ctxAction[2].canvas.width/3, 0+center, heightp, heightp);
  ctxAction[3].drawImage(trt4, 0, 0, 25, 25, ctxAction[3].canvas.width/3, 0+center, heightp, heightp);
}

function addEventDnD(){
  for(var j=0; j<6; j++)
    canvasAction[j].addEventListener("click", clickP);

    dragdropcanvas.addEventListener("mousemove", mousemoveP);

    document.addEventListener("keydown", function(evt){
      if(evt.keyCode==27 && flagclick){
        clearDragDrop();
      }
    });

    dragdropcanvas.addEventListener("mousedown", mousedownP);

}


function clickP(evt){
  evt.preventDefault();
  for(var i=0; i<6 && canvasAction[i].id!=this.id; i++){ }
  if(!flaggameover)
  dragdropfun(i, flagcreat);
  index=i;
}

function mousedownP(evt){
  evt.preventDefault();
  if(!flaggameover)

  drop(index, flagcreat);
}

function mousemoveP(evt){
  evt.preventDefault();
  if(!flaggameover)

  drag(index, flagcreat);
}

function setP(evt){
  evt.preventDefault();
  for(var i=6; i<10 && canvasAction[i].id!=this.id; i++){ }
  if(!flaggameover)
    init(i);

}

function controlHero(evt){
  hero.move(evt.keyCode);
}

function startHeroPost(){
  hero.resetPos();
}
