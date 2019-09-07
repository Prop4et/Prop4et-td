"use strict"

class Missile{

  constructor(coordX, coordY, indexi, indexj, dim){
    this.x = coordX;
    this.y = coordY;
    this.range = Missile.computeRange();
    this.mati = indexi;
    this.matj = indexj;
    this.shooting = false;
    this.pstep = 3.5;
    this.px = this.x;
    this.py = this.y;
    this.pdim = dim/6;
    this.enemyi;

  }

  setX(x){
    this.x = x;
  }

  setY(y){
    this.y = y;
  }
  ridim(i, j){
    this.setX(coordx[i]+tileW/2-dimtur/2);
    this.setY(coordy[j]+tileH/2-dimtur/2);
    this.range = computeRange();
  }

  setStep(s){
    this.step = s;
  }

  shot(enemy){
    ctxenemy.fillStyle = "rgb(204, 51, 153)";

    if(((enemy.x-this.x)*(enemy.x-this.x) + (enemy.y-this.y)*(enemy.y-this.y)) < (this.range*this.range) && !this.shooting){//fire
      this.shooting=true;
      this.enemyi=enemy.index;
      ctxenemy.beginPath();
      ctxenemy.fillRect(this.px-this.pdim/2, this.py-this.pdim/2, this.pdim, this.pdim);

    }

    if(this.shooting && enemy.index == this.enemyi){

      if(Missile.move(this, enemy, this.pstep)){
        enemy.lives--;
        if(enemy.lives<=0) enemy.alive=false;
        this.shooting=false;
        ctxenemy.beginPath();
        ctxenemy.arc(this.px-this.pdim/2, this.py-this.pdim/2, this.pdim*3, 0, 2*Math.PI);
        ctxenemy.fill();
        this.px = this.x;
        this.py = this.y;
      }else{
        ctxenemy.fillRect(this.px-this.pdim/2, this.py-this.pdim/2, this.pdim, this.pdim);
      }
    }
  }

  static computeRange(){
    if(tileW < tileH)
      return tileW*2.2;
    else return tileH*2.2;
  }

  static drawRange(){
    var range = this.computeRange();
    var mousePos = getMousePos(maincanvas, event);
    var indexes = getIndexes(mousePos);
    if(indexes.i >= 0 && indexes.i < xlen && indexes.j >= 0 && indexes.j < ylen && bgmatrix[indexes.i][indexes.j]!=0){
      ctxdragturret.fillStyle = "rgba(255, 0, 0, 0.2)";
    }else{
    ctxdragturret.fillStyle = "rgba(37, 142, 37, 0.2)";
    }
    ctxdragturret.beginPath();
    ctxdragturret.arc(coordx[indexes.i]+tileW/2, coordy[indexes.j]+tileH/2, range, 0, 2 * Math.PI);
    ctxdragturret.fill();
  }


  static move(obj, target, speed) {
  	var distx = target.x - obj.px;
  	var disty = target.y - obj.py;
  	var angle = Math.atan2(disty, distx);

  	obj.px += speed * Math.cos(angle);
  	obj.py += speed * Math.sin(angle);

  	return (distx < 0 ? -distx : distx) + (disty < 0 ? -disty : disty) < 2;
  }
}
