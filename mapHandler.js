"use strict"

var piecedistance;
var pad;
var centerx;
var dcenterx;
var dimtur;

var idbg = ["bg1", "bg2", "bg3"];

var selectedBg = 0;
var selectedPiece = 0;

var canvaswidth;
var canvasheight;

var tileW;
var tileH;

var xlen;
var ylen;

var img = new Image();


var initdone=false;
/* 0 non c'è nessun pezzo
   1 il pezzo dentro è dritto orizzontale
   2 il pezzo dentro è dritto verticale
   3,4,5,6 sono curve come nella box di lato*/
var bgmatrix;

var diff;
var coordx = [];
var coordy = [];

var map = [];
var trt = new Image();

var turrets = new Array();

function init(clickedID){
  setbg(clickedID);
  if(initdone) return;
  workMain();
  addEventDnD();
  maincanvas.style.zIndex = "8";
  maincanvas.addEventListener('contextmenu', deletep);
  initdone=true;
}

function deletep(evt){
  evt.preventDefault();
  deletePiece();
}

function setbg(param){

  img.onload = function () {
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
  };
  img.src = 'imgs/'+param+'.jpg';
  selectedBg = param;
}

function workMain(){
  canvaswidth = ctxmain.canvas.width;
  canvasheight = ctxmain.canvas.height;

  tileW = canvaswidth/8;
  tileH = canvasheight/8;
  hero = new Hero(canvaswidth/2, canvasheight/2);

  computeGrid();
  initmat();
  drawStartEnd();
}

function computeGrid(){
  var i=0, j=0;
  for (var x=0; x<=canvaswidth; x+=tileW) {
    coordx[i] = x;
    i++;
  }

  for (var y=0; y<=canvasheight; y+=tileH) {
    coordy[j] = y;
    j++;
  }

  /*for (x=0;x<=canvaswidth;x+=tileW) {
        for (y=0;y<=canvasheight;y+=tileH) {
            ctxmain.moveTo(x, 0);
            ctxmain.lineTo(x, canvasheight);
            ctxmain.stroke();
            ctxmain.moveTo(0, y);
            ctxmain.lineTo(canvaswidth, y);
            ctxmain.stroke();
        }
    }*/

    xlen = coordx.length-1;
    ylen = coordy.length-1;
}

function drawStartEnd(){
  //if(initdone)  ctxmain.clearRect(0, 0, canvaswidth, canvasheight);
  if(tileW>tileH){
    piecedistance = tileH*70/100;
    pad = (tileH-piecedistance)/2
    r2 = tileH-(pad+piecedistance);
  }else{
    piecedistance = tileW*70/100;
    pad = (tileW-piecedistance)/2;
    r2=tileW-(pad+piecedistance);
  }
  r1=pad+piecedistance;
  centerx = (tileW-piecedistance-2*pad)/2;

  ctxmain.lineWidth = 5;
  ctxmain.strokeStyle = "#e87dcd"

  var j=0;
  var i=0;
  drawHorizontal(i, j);
  i=xlen-1;
  j=ylen-1;
  drawHorizontal(i, j);
  bgmatrix[0][0] = 1;
  bgmatrix[xlen-1][ylen-1] = 1;
}

function dragdropfun(index, flag){
  flagclick=true;

  dragdropcanvas.style.zIndex = "9999";


  var mousePos = getMousePos(dragdropcanvas, event);
  ctxdragdrop.lineWidth = 5;
  ctxdragdrop.strokeStyle = "#e87dcd"
  if(!flag)
    switch (index) {
      case 0:
        dragHorizontal(mousePos.x, mousePos.y);
      break;
      case 1:
        dragVertical(mousePos.x, mousePos.y);
      break;
      case 2:
        dragCurve1(mousePos.x, mousePos.y);
      break;
      case 3:
        dragCurve2(mousePos.x, mousePos.y);
      break;
      case 4:
        dragCurve3(mousePos.x, mousePos.y);
      break;
      case 5:
        dragCurve4(mousePos.x, mousePos.y);
      break;
      default:
        dragdropcanvas.style.zIndex = "0";
    }
  else
    dragTurret(mousePos.x, mousePos.y, index);
}

function dragTurret(x, y, i, flagcreat){
  if(tileW>tileH)
    dimtur = tileH*70/100;
  else
    dimtur = tileW*70/100;
  trt.onload = function () {
      ctxdragdrop.drawImage(trt, 0, 0, 25, 25, x-dimtur/2, y-dimtur/2, dimtur, dimtur);
  };
  helpsrc(trt, i);
  Missile.drawRange();
}



function drag(index){
  var mousePos = getMousePos(dragdropcanvas, event);
  ctxdragdrop.clearRect(0, 0, ctxdragdrop.canvas.width, ctxdragdrop.canvas.height);
  if(flagclick && !flagcreat){
    switch (index) {
      case 0:
        dragHorizontal(mousePos.x, mousePos.y);
      break;
      case 1:
        dragVertical(mousePos.x, mousePos.y);
      break;
      case 2:
        dragCurve1(mousePos.x, mousePos.y);
      break;
      case 3:
        dragCurve2(mousePos.x, mousePos.y);
      break;
      case 4:
        dragCurve3(mousePos.x, mousePos.y);
      break;
      case 5:
        dragCurve4(mousePos.x, mousePos.y);
      break;
      default:
    }

  }else if(flagclick && flagcreat){
    var coord = getMousePos(maincanvas, event);
    var indexes2 = getIndexes(coord);
    ctxdragdrop.drawImage(trt, 0, 0, 25, 25, mousePos.x-dimtur/2, mousePos.y-dimtur/2, dimtur, dimtur);
    if(index==0) Missile.drawRange();
    if(index==1) Mortar.drawRange();
    if(index==2) Laser.drawRange();
    if(index==3) Taser.drawRange();

  }
}

/*
return -2 se errore a livello di indici e quindi non faccio nulla
return -1 se invece l'errore è un errore pure di posizionamento, effetto rosso o qualcosa del genere, dovrei metterlo nel drag però, qui basterebbe non fare nulla
*/
function drop(index, flagcreat){
  index++;
  var mousePos = getMousePos(dragdropcanvas, event);
  var indexes = getIndexes(mousePos);
  var indexes2 = getIndexes(mousePos);
  if(mousePos.x>coordx[coordx.length-1]-(m+m/3) || mousePos.y>coordy[coordy.length-1]-(m-m/3)) return -2;
  if(bgmatrix[indexes.i][indexes.j] != 0) return -1;
  if(!flagcreat){

      //devo controllare anche i vicini  e il pezzo che sto disegnando ma non c'ho voglia(lo faccio qunado premo conferma che ho la matrice tutta collegata)
    switch (index) {
      case 1:
        drawHorizontal(indexes.i, indexes.j);

        function onMouseMoveH(event) {
          mousePos = getMousePos(dragdropcanvas, event);
          indexes = getIndexes(mousePos);
          if(bgmatrix[indexes.i][indexes2.j] == 0)
            drawHorizontal(indexes.i, indexes2.j);
        }

        maincanvas.addEventListener("mousemove", onMouseMoveH);
        maincanvas.onmouseup = function() {
          maincanvas.removeEventListener('mousemove', onMouseMoveH);
        };
        clearDragDrop();

      break;

      case 2:
        drawVertical(indexes.i, indexes.j);
        function onMouseMoveV(event) {
          mousePos = getMousePos(dragdropcanvas, event);
          indexes = getIndexes(mousePos);
          if(bgmatrix[indexes2.i][indexes.j] == 0)
            drawVertical(indexes2.i, indexes.j);
        }

        maincanvas.addEventListener("mousemove", onMouseMoveV);
        maincanvas.onmouseup = function() {
          maincanvas.removeEventListener('mousemove', onMouseMoveV);
        };
        clearDragDrop();

      break;

      case 3:
        clearDragDrop();
        drawCurve1(indexes.i, indexes.j);
      break;

      case 4:
        clearDragDrop();
        drawCurve2(indexes.i, indexes.j);
      break;

      case 5:
        clearDragDrop();
        drawCurve3(indexes.i, indexes.j);
      break;

      case 6:
        clearDragDrop();
        drawCurve4(indexes.i, indexes.j);
      break;

      default:
        dragdropcanvas.style.zIndex = "0";
    }
  }else{
    clearDragDrop();
    ctxdragturret.clearRect(0, 0, ctxdragturret.canvas.width, ctxdragturret.canvas.height);
    //var indexescorr = getIndexes(coordx[indexes.i]+tileW/2-dimtur, coordy[indexes.j]-25);
    ctxmain.drawImage(trt, coordx[indexes.i]+tileW/2-dimtur/2, coordy[indexes.j]+tileH/2-dimtur/2, dimtur, dimtur);
    bgmatrix[indexes.i][indexes.j] = index+6;
    if(index == 1 && money>=30){
      turrets[turrets.length] = new Missile(coordx[indexes.i]+tileW/2, coordy[indexes.j]+tileH/2, indexes.i, indexes.j, piecedistance);
      money-=30;
    }
    if(index == 2 && money>=60){
      turrets[turrets.length] = new Mortar(coordx[indexes.i]+tileW/2, coordy[indexes.j]+tileH/2, indexes.i, indexes.j, piecedistance);
      money-=60
    }
    if(index == 3 && money>=15){
      turrets[turrets.length] = new Laser(coordx[indexes.i]+tileW/2, coordy[indexes.j]+tileH/2, indexes.i, indexes.j);
      money-=15;
    }
    if(index == 4 && money>=5){
      turrets[turrets.length] = new Taser(coordx[indexes.i]+tileW/2, coordy[indexes.j]+tileH/2, indexes.i, indexes.j);
      money-=5;
    }
    ctxAction[4].clearRect(0, 0, canvasAction[4].width, canvasAction[4].height);
    ctxAction[4].strokeText(money + "$", canvasAction[4].width/2, canvasAction[4].height-canvasAction[4].height/3);

  }
}

function clearDragDrop(){
  ctxdragdrop.clearRect(0, 0, ctxdragdrop.canvas.width, ctxdragdrop.canvas.height);
  dragdropcanvas.style.zIndex = "0";
  flagclick=false;

}

function deletePiece(){
  /*prima di tutto bisogna controllare che il pezzo che io voglio cancellare non sia connesso ad altri da entrambe
   le parti (anche se in linea teorica il tizio potrebbe fare come vuole ma così è più safe)*/
  var mousePos = getMousePos(maincanvas, event);
  var indexes = getIndexes(mousePos);
  if(mousePos.x>coordx[coordx.length-1]-(m+m/3) || mousePos.y>coordy[coordy.length-1]-(m-m/3)) return;
  if(bgmatrix[indexes.i][indexes.j] == 0) return;
  if((indexes.i == 0 && indexes.j == 0) || (indexes.i == xlen-1 && indexes.j == ylen-1)) return;

  ctxmain.clearRect(coordx[indexes.i], coordy[indexes.j], coordx[indexes.i+1]-coordx[indexes.i], coordy[indexes.j+1]-coordy[indexes.j]);
  bgmatrix[indexes.i][indexes.j]=0;

}


function resizeMap(){
  canvaswidth = ctxmain.canvas.width;
  canvasheight = ctxmain.canvas.height;

  tileW = canvaswidth/8;
  tileH = canvasheight/8;
  maincanvas.style.zIndex = "9999";
  computeGrid();
  drawStartEnd();
  for(var i=0; i<bgmatrix.length; i++){
    for(var j=0; j<bgmatrix[i].length; j++){
      switch(bgmatrix[i][j]){
        case 0:
        break;
        case 1:
          drawHorizontal(i, j);
        break;
        case 2:
          drawVertical(i, j);
        break;
        case 3:
          drawCurve1(i, j);
        break;
        case 4:
         drawCurve2(i, j);
        break;
        case 5:
          drawCurve3(i, j);
        break;
        case 6:
          drawCurve4(i, j);
        break;
        default:
          ctxmain.drawImage(trt, coordx[i]+tileW/2-dimtur/2, coordy[j]+tileH/2-dimtur/2, dimtur, dimtur);
          for(var t=0; t<turrets.length; t++){
            if(i == turrets[t].mati && j == turrets[t].matj){
              turrets[t].ridim(i, j);
            }
          }

          helpsrc(trt, bgmatrix[i][j]-7);
        break;
      }
    }
  }
  maincanvas.style.zIndex = "2";

}




//utility

function checkmat(){
  //parto da 0,0 che è dove sono sicuro sta la partenza, poi controllo il percorso a seconda dei pezzi che trovo mano a mano e mi salvo gli indici,
  //poi scorro tutta la matrice e i pezzi che non ci dicono li pulisco
  //togo eh, ma preferirei suicidarmi, scorro tutta la matrice linearmente e vedo se c'ho qualcosa che sta attaccato o che sta attaccato a cazzo
  //mi raccomando cerca di non ridondare le condizioni che se no è finita, per ogni pezzo pensa a sè stesso
  for(var i=0; i<bgmatrix.length; i++){
    for(var j=0; j<bgmatrix[i].length; j++){
      switch(bgmatrix[i][j]){
        case 1:
          if(i==0 && j!=0) return false;
          if(i==xlen-1 && j!=ylen-1) return false;
          if(i>0)
            if(bgmatrix[i-1][j] == 2 || bgmatrix[i-1][j] == 3 || bgmatrix[i-1][j] == 6 || bgmatrix[i-1][j] == 0) return false;
          if(i<xlen-2)
            if(bgmatrix[i+1][j] == 2 || bgmatrix[i+1][j] == 4 || bgmatrix[i+1][j] == 5 || bgmatrix[i+1][j] == 0) return false;
        break;
        case 2:
          if(j==0 || j==ylen-1) return false;
          if(bgmatrix[i][j-1] == 1 || bgmatrix[i][j-1] == 3 || bgmatrix[i][j-1] == 4 || bgmatrix[i][j-1] == 0) return false;
          if(bgmatrix[i][j+1] == 1 || bgmatrix[i][j+1] == 5 || bgmatrix[i][j+1] == 6 || bgmatrix[i][j+1] == 0) return false;
        break;
        case 3:
          if(j==0 || i==0)  return false;
          if(bgmatrix[i-1][j] == 2 || bgmatrix[i-1][j] == 6 || bgmatrix[i-1][j] == 0) return false;
          if(bgmatrix[i][j-1] == 1 || bgmatrix[i][j-1] == 4 || bgmatrix[i][j-1] == 0) return false;
          if(bgmatrix[i-1][j] == 4 && bgmatrix[i][j-1 == 6])  return false;
        break;
        case 4:
          if(j==0 || i==xlen-1) return false;
          if(bgmatrix[i][j-1] == 1 || bgmatrix[i][j-1] == 4 || bgmatrix[i][j-1] == 0) return false;
          if(bgmatrix[i+1][j] == 2 || bgmatrix[i+1][j] == 5 || bgmatrix[i+1][j] == 0) return false;
          if(bgmatrix[i+1][j] == 3 && bgmatrix[i][j-1] == 5) return false;
        break;
        case 5:
          if(i==xlen-1 || j==ylen-1)  return false;
          if(bgmatrix[i+1][j] == 2 || bgmatrix[i+1][j] == 4 || bgmatrix[i+1][j] == 0) return false;
          if(bgmatrix[i][j+1] == 1 || bgmatrix[i][j+1] == 6 || bgmatrix[i][j+1] == 0) return false;
          if(bgmatrix[i+1][j] == 6 && bgmatrix[i][j-1] == 4)  return false;
        break;
        case 6:
          if(i==0 || j==ylen-1) return false;
          if(bgmatrix[i-1][j] == 2 || bgmatrix[i-1][j] == 3 || bgmatrix[i-1][j] == 0) return false;
          if(bgmatrix[i][j+1] == 1 || bgmatrix[i][j+1] == 5 || bgmatrix[i][j+1] == 0) return false;
          if(bgmatrix[i-1][j] == 5 && bgmatrix[i][j+1] == 3)  return false;
        break;
      }
    }
  }
  return true;
}

function makepath(){
  map[0] = {p:1, x:0, y:0};
  var i=1;
  var j=0;
  var oldi = 0;
  var oldj = 0;
  var counter = 1;
  while(i<xlen && j<ylen){
    switch(bgmatrix[i][j]){
      case 1:
        map[counter] = {p:1, x:i, y:j};
        if(oldi<i){
          oldi=i;
           i++;
         }
        else{
          oldi=i;
          i--;
        }
        counter++;
      break;
      case 2:
        map[counter] = {p:2, x:i, y:j};
        if(oldj<j){
          oldj=j;
          j++;
        }
        else {
          oldj=j;
          j--;
        }
        counter++;
      break;
      case 3:
        map[counter] = {p:3, x:i, y:j};
        if(oldi<i){
           j--;
           oldi=i;
        }
        if(oldj<j){
           i--;
           oldj=j;
        }
        counter++;
      break;
      case 4:
        map[counter] = {p:4, x:i, y:j};
        if(oldi>i){
          oldi=i;
          j--;
        }
        if(oldj<j){
          oldj=j;
          i++;
        }
        counter++;
      break;
      case 5:
        map[counter] = {p:5, x:i, y:j};
        if(oldi>i){
          oldi=i;
          j++;
        }
        if(oldj>j){
          oldj=j;
          i++;
        }
        counter++;
      break;
      case 6:
        map[counter] = {p:6, x:i, y:j};
        if(oldi<i){
          oldi=i;
          j++;
        }
        if(oldj>j){
          oldj=j;
          i--;
        }
        counter++;
      break;
    }
  }
}

function initmat(){
  bgmatrix = new Array(xlen);
  for(var i=0; i<xlen; i++)
    bgmatrix[i] = new Array(ylen);

  for(var i=0; i<xlen; i++){
    for(var j=0; j<ylen; j++){
      bgmatrix[i][j]=0;
    }
  }
}
