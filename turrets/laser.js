class Laser{
  constructor(coordX, coordY, indexi, indexj){
    this.x = coordX;
    this.y = coordY;
    this.range = Missile.computeRange();
    this.mati = indexi;
    this.matj = indexj;
    this.enemyi;
    this.time = 0;
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

  setTime(t){
    this.time=t;
  }

  shot(enemy, c, time){
    ctxenemy.fillStyle = "rgb(204, 51, 153)";

    if(((enemy.x-this.x)*(enemy.x-this.x) + (enemy.y-this.y)*(enemy.y-this.y)) < (this.range*this.range)  && time-this.time>=500){//fire
      this.time=time;
      ctxenemy.strokeStyle = "rgb(36, 57, 204)";
      ctxenemy.lineWidth = 5;
      ctxenemy.beginPath();
      ctxenemy.moveTo(this.x, this.y);
      ctxenemy.lineTo(enemy.x, enemy.y);
      ctxenemy.stroke();
      enemy.lives--;
      if(enemy.lives<=0) enemy.alive=false;
    }
  }

  static computeRange(){
    if(tileW < tileH)
      return tileH;
    else return tileW;
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
}
