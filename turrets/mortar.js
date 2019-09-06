class Mortar{
  constructor(coordX, coordY, indexi, indexj, dim){
    this.x = coordX;
    this.y = coordY;
    this.range = Mortar.computeRange();
    this.mati = indexi;
    this.matj = indexj;
    this.shooting = false;
    this.pstep = 1.5;
    this.px = [];
    this.py = [];
    this.pdim = dim/6;
    this.target = [];
    this.toshot =  [];
    this.time=0;
    this.targeti = 0;
    this.enemyi = [];
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

  shot(enemy, all, time){
    ctxenemy.fillStyle = "rgba(0, 102, 0, 0.5)";
    if(((enemy.x-this.x)*(enemy.x-this.x) + (enemy.y-this.y)*(enemy.y-this.y)) < (this.range*this.range) && time-this.time>=1500){//fire
      this.enemyi[this.targeti]=enemy.index;
      this.time=time;
      this.target[this.targeti] = { x: enemy.x/1, y: enemy.y/1};
      this.px[this.targeti] = this.x/1;
      this.py[this.targeti] = this.y/1;
      this.toshot[this.targeti] = true;
      ctxenemy.beginPath();
      ctxenemy.fillRect(this.px[this.targeti]-this.pdim/2, this.py[this.targeti]-this.pdim/2, this.pdim, this.pdim);
      this.targeti++;
    }
    //bugged dunno why tbh
    for(var indext = 0; indext<this.targeti; indext++){
      if(this.toshot[indext] && enemy.index == this.enemyi[indext]){
        if(Mortar.move(this, this.target[indext], this.pstep, indext)){
          for(var i=0; i<all.length; i++){
            if(all[i].x > this.px[indext] -this.pdim/2 - this.pdim*5 && all[i].x < this.px[indext] -this.pdim/2+this.pdim*5){
              if(all[i].y > this.py[indext]-this.pdim/2-this.pdim*5 && all[i].y < this.py[indext]-this.pdim/2+this.pdim*5)
                if(all[i].alive)
                  all[i].lives-=2;
            }
            if(all[i].lives<=0 && all[i].alive)
              all[i].alive=false
          }
          ctxenemy.beginPath();
          ctxenemy.arc(this.px[indext]-this.pdim/2, this.py[indext]-this.pdim/2, this.pdim*5, 0, 2*Math.PI);
          ctxenemy.fill();
          this.toshot[indext] = false;
        }else{
          ctxenemy.beginPath();
          ctxenemy.fillRect(this.px[indext]-this.pdim/2, this.py[indext]-this.pdim/2, this.pdim, this.pdim);
        }
      }

    }
  }


  static computeRange(){
    if(tileW < tileH)
      return tileW*3;
    else return tileH*3;
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

  static move(obj, target, speed, targeti) {
  	var distx = target.x - obj.px[targeti];
  	var disty = target.y - obj.py[targeti];
  	var angle = Math.atan2(disty, distx);
  	obj.px[targeti] += (speed * Math.cos(angle));
  	obj.py[targeti] += (speed * Math.sin(angle));


  	return (distx < 0 ? -distx : distx) + (disty < 0 ? -disty : disty) < 2;
  }
}
