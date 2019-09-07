class Taser{
  constructor(coordX, coordY, indexi, indexj){
    this.x = coordX;
    this.y = coordY;
    this.range = Taser.computeRange();
    this.mati = indexi;
    this.matj = indexj;
    this.vel = 2;
    this.slowed = [];
    this.counter = 0;
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

  setVel(v){
    this.vel=v;
  }

  shot(enemy){
    ctxenemy.fillStyle = "rgba(230, 230, 230, 0.5)";
    if(((enemy.x-this.x)*(enemy.x-this.x) + (enemy.y-this.y)*(enemy.y-this.y)) < (this.range*this.range)){//fire
      if(!this.slowed[enemy.index]){
        this.slowed[enemy.index] = true;
        enemy.step = this.vel/2;
        this.counter++;
      }
      if(this.counter-enemy.index==1){
        ctxenemy.beginPath();
        ctxenemy.arc(this.x, this.y, this.range, 0, 2*Math.PI);
        ctxenemy.fill();
      }
    }else{
      if(this.slowed[enemy.index]){
        enemy.step=this.vel;
        this.slowed[enemy.index] = false;
      }
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
