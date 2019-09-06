"use strict"

var r1;
var r2;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getI(mousePos){
  var i;
  for(i=0; i<coordx.length-1; i++){
    if(mousePos.x >= coordx[i] && mousePos.x < coordx[i+1]) return i;
  }
}

function getJ(mousePos){
  var j;
  for(j=0; j<coordy.length-1; j++){
    if((mousePos.y >= coordy[j]) && (mousePos.y < coordy[j+1])) return j;
  }
}

function getIndexes(mousePos){
  return{
    i: getI(mousePos),
    j: getJ(mousePos)
  };
}

/*function getIndexs(x, y){
  var i, j;
  for(i=0; i<coordx.length-1; i++){
    if(x >= coordx[i] && x < coordx[i+1]) break;
  }

  for(j=0; j<coordy.length-1; j++){
    if((y >= coordy[j]) && (y < coordy[j+1])) break;
  }
  return {i:i, j:j};
}*/

function dragHorizontal(x, y){
  ctxdragdrop.beginPath();
  ctxdragdrop.moveTo(x-tileW/2, y-piecedistance/2);
  ctxdragdrop.lineTo(x+tileW/2, y-piecedistance/2);
  ctxdragdrop.moveTo(x-tileW/2, y+piecedistance/2);
  ctxdragdrop.lineTo(x+tileW/2, y+piecedistance/2);
  ctxdragdrop.stroke();
  evidenceAoE(x, y);
}

function dragVertical(x, y){
  ctxdragdrop.beginPath();
  ctxdragdrop.moveTo(x-piecedistance/2, y-tileH/2);
  ctxdragdrop.lineTo(x-piecedistance/2, y+tileH/2);
  ctxdragdrop.moveTo(x+piecedistance/2, y-tileH/2);
  ctxdragdrop.lineTo(x+piecedistance/2, y+tileH/2);
  ctxdragdrop.stroke();
  evidenceAoE(x, y);
}

function dragCurve1(x, y){
  ctxdragdrop.moveTo(x, y);
  ctxdragdrop.beginPath();
  ctxdragdrop.arc(x-piecedistance/2, y+pad-tileH/2, tileH-pad, 0, 0.5*Math.PI);
  ctxdragdrop.stroke();
  ctxdragdrop.closePath();

  ctxdragdrop.moveTo(x, y);
  ctxdragdrop.beginPath();
  ctxdragdrop.arc(x-piecedistance/2, y+pad-tileH/2, tileH-pad-piecedistance, 0, 0.5*Math.PI);
  ctxdragdrop.stroke();
  ctxdragdrop.closePath();
  evidenceAoE(x, y);
}

function dragCurve2(x, y){
  ctxdragdrop.moveTo(x, y);
  ctxdragdrop.beginPath();
  ctxdragdrop.arc(x+piecedistance/2, y+pad-tileH/2, tileH-pad,  0.5*Math.PI,  1*Math.PI);
  ctxdragdrop.stroke();
  ctxdragdrop.closePath();

  ctxdragdrop.moveTo(x, y);
  ctxdragdrop.beginPath();
  ctxdragdrop.arc(x+piecedistance/2, y+pad-tileH/2, tileH-pad-piecedistance,  0.5*Math.PI, 1*Math.PI);
  ctxdragdrop.stroke();
  ctxdragdrop.closePath();
  evidenceAoE(x, y);
}

function dragCurve3(x, y){
  ctxdragdrop.moveTo(x, y);
  ctxdragdrop.beginPath();
  ctxdragdrop.arc(x+piecedistance*2/3, y+tileH/2-pad, tileH-pad,  1*Math.PI,  1.5*Math.PI);
  ctxdragdrop.stroke();
  ctxdragdrop.closePath();

  ctxdragdrop.moveTo(x, y);
  ctxdragdrop.beginPath();
  ctxdragdrop.arc(x+piecedistance*2/3, y+tileH/2-pad, tileH-pad-piecedistance,  1*Math.PI, 1.5*Math.PI);
  ctxdragdrop.stroke();
  ctxdragdrop.closePath();
  evidenceAoE(x, y);
}

function dragCurve4(x, y){
  ctxdragdrop.moveTo(x, y);
  ctxdragdrop.beginPath();
  ctxdragdrop.arc(x-piecedistance/2, y+tileH/2-pad, tileH-pad, 1.5*Math.PI,  2*Math.PI);
  ctxdragdrop.stroke();
  ctxdragdrop.closePath();

  ctxdragdrop.moveTo(x, y);
  ctxdragdrop.beginPath();
  ctxdragdrop.arc(x-piecedistance/2, y+tileH/2-pad, tileH-pad-piecedistance,  1.5*Math.PI, 2*Math.PI);
  ctxdragdrop.stroke();
  ctxdragdrop.closePath();
  evidenceAoE(x, y);
}

function evidenceAoE(x, y){

  var mousePos = getMousePos(maincanvas, event);
  var indexes = getIndexes(mousePos);
  if(indexes.i >= 0 && indexes.i < xlen && indexes.j >= 0 && indexes.j < ylen && bgmatrix[indexes.i][indexes.j]!=0){
    ctxdragdrop.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctxdragdrop.beginPath();
    ctxdragdrop.arc(x, y, piecedistance*2, 0, 2 * Math.PI);
    ctxdragdrop.fill();
  }
}

function drawHorizontal(i, j){

  ctxmain.beginPath();
  ctxmain.moveTo(coordx[i], coordy[j]+pad);
  ctxmain.lineTo(coordx[i+1], coordy[j]+pad);
  ctxmain.moveTo(coordx[i], coordy[j]+piecedistance+pad);
  ctxmain.lineTo(coordx[i+1], coordy[j]+piecedistance+pad);
  ctxmain.stroke();
  bgmatrix[i][j]=1;
}

function drawVertical(i, j){
  /*su sta cosa del pad ci sta da ragionacce poi quando faccio le curve puttana di eva*/
  ctxmain.beginPath();
  var point = (tileW-piecedistance)/2;
  ctxmain.moveTo(coordx[i]+point, coordy[j]);
  ctxmain.lineTo(coordx[i]+point, coordy[j+1]);
  ctxmain.moveTo(coordx[i]+point+piecedistance, coordy[j]);
  ctxmain.lineTo(coordx[i]+point+piecedistance, coordy[j+1]);
  ctxmain.stroke();
  bgmatrix[i][j]=2;
}

function drawCurve1(i, j){
  ctxmain.beginPath();
  ctxmain.arc(coordx[i]+centerx, coordy[j], r1, 0, 0.5*Math.PI);
  ctxmain.stroke();
  ctxmain.closePath();

  ctxmain.beginPath();
  ctxmain.arc(coordx[i]+centerx, coordy[j], pad, 0, 0.5*Math.PI);
  ctxmain.stroke();
  ctxmain.closePath();
  attachCurve(i, j, 0);
  bgmatrix[i][j]=3;
}

function drawCurve2(i, j){

  ctxmain.beginPath();
  ctxmain.arc(coordx[i+1]-centerx, coordy[j], r1,  0.5*Math.PI, 1*Math.PI);

  ctxmain.stroke();
  ctxmain.closePath();

  ctxmain.beginPath();
  ctxmain.arc(coordx[i+1]-centerx, coordy[j], pad, 0.5*Math.PI, 1*Math.PI);
  ctxmain.stroke();
  ctxmain.closePath();
  attachCurve(i, j, 1);
  bgmatrix[i][j]=4;
}


function drawCurve3(i, j){
  ctxmain.beginPath();
  if(tileH>tileW)
    ctxmain.arc(coordx[i+1], coordy[j]+2*pad+piecedistance, r2,  1*Math.PI, 1.5*Math.PI);
  else
    ctxmain.arc(coordx[i+1]-centerx, coordy[j+1], r2,  1*Math.PI, 1.5*Math.PI);

  ctxmain.stroke();
  ctxmain.closePath();

  ctxmain.beginPath();
  if(tileH>tileW)
    ctxmain.arc(coordx[i+1], coordy[j]+2*pad+piecedistance, tileW-pad, 1*Math.PI, 1.5*Math.PI);
  else
    ctxmain.arc(coordx[i+1]-centerx, coordy[j+1], tileH-pad, 1*Math.PI, 1.5*Math.PI);


  ctxmain.stroke();
  ctxmain.closePath();
  if(tileH>tileW)
    attachCurve(i, j, 2);
  else
    attachCurve(i, j, 1);
  bgmatrix[i][j]=5;
}

function drawCurve4(i, j){
  ctxmain.beginPath();
  if(tileH>tileW)
    ctxmain.arc(coordx[i], coordy[j]+2*pad+piecedistance, r2,  1.5*Math.PI, 0*Math.PI);
  else
    ctxmain.arc(coordx[i]+centerx, coordy[j+1], r2,  1.5*Math.PI, 0*Math.PI);

  ctxmain.stroke();
  ctxmain.closePath();

  ctxmain.beginPath();
  if(tileH>tileW)
    ctxmain.arc(coordx[i], coordy[j]+2*pad+piecedistance, tileW-pad, 1.5*Math.PI, 0*Math.PI);
  else
    ctxmain.arc(coordx[i]+centerx, coordy[j+1], tileH-pad, 1.5*Math.PI, 0*Math.PI);


  ctxmain.stroke();
  ctxmain.closePath();
  if(tileH>tileW)
    attachCurve(i, j, 2);
  else
    attachCurve(i, j, 0);
  bgmatrix[i][j]=6;
}

/*direction 0 = horizontal left
  1 = horizontal right
  2 = bot to top*/
function attachCurve(i, j, direction){
  if(direction == 0){
    ctxmain.beginPath();
    ctxmain.moveTo(coordx[i], coordy[j]+pad);
    ctxmain.lineTo(coordx[i]+centerx+2, coordy[j]+pad);
    ctxmain.moveTo(coordx[i], coordy[j]+piecedistance+pad);
    ctxmain.lineTo(coordx[i]+centerx+2, coordy[j]+piecedistance+pad);
    ctxmain.stroke();
  }else if(direction == 1){
    ctxmain.beginPath();
    ctxmain.moveTo(coordx[i+1], coordy[j]+pad);
    ctxmain.lineTo(coordx[i+1]-(centerx)-2, coordy[j]+pad);
    ctxmain.moveTo(coordx[i+1], coordy[j]+piecedistance+pad);
    ctxmain.lineTo(coordx[i+1]-(centerx)-2, coordy[j]+piecedistance+pad);
    ctxmain.stroke();
  }else if(direction == 2){
    ctxmain.beginPath();
    ctxmain.moveTo(coordx[i]+pad, coordy[j]+2*pad+piecedistance);
    ctxmain.lineTo(coordx[i]+pad, coordy[j+1]);
    ctxmain.moveTo(coordx[i]+pad+piecedistance, coordy[j]+2*pad+piecedistance);
    ctxmain.lineTo(coordx[i]+pad+piecedistance, coordy[j+1]);
    ctxmain.stroke();
  }
}

function helpsrc(trt, i){
  if(i==0)
    trt.src = 'imgs/turrets/laser.png';
  else if(i==1)
    trt.src = 'imgs/turrets/missile.png';
  else if(i==2)
    trt.src = 'imgs/turrets/mortar.png';
  else if(i==3)
    trt.src = 'imgs/turrets/tazer.png';
}
