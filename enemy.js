
class Enemy{

  constructor(coordX, coordY, piecedistance, i){
    this.x = coordX;
    this.y = coordY;
    this.alive = true;
    this.lives = 4;
    this.radius = piecedistance/6;
    this.radiants = [Math.PI*0, Math.PI*0.5, Math.PI, Math.PI*1.5, Math.PI*2];
    this.radiantscopy;
    this.step = 2;
    this.incradiants = 0.05;
    this.init = 0;
    this.index = i;
  }

  static computePath(){

  }

  drawEnemy(){
      ctxenemy.fillStyle = "#000";
      ctxenemy.beginPath();
      ctxenemy.arc(this.x, this.y, this.radius, this.radiants[0], this.radiants[4]);
      //a seconda del pezzo devo incrementare la x, la y o entrambe
      ctxenemy.fill();
     if(this.x < 0){
         this.x += this.step;
     }else{
      var arrindex = map.findIndex(indexeq, this);
      if(arrindex == 0 || arrindex == map.length-1){
        this.x+=this.step;
        if(this.x>=coordx[xlen]){//game over
          pauseGame();
          flaggameover=true;
          gameOver();
        }
      }else{
        //fix dello spostamento sulle curve
        switch(map[arrindex].p){
          case 1:
            if(map[arrindex].x>map[arrindex-1].x)
              this.x+=this.step;
            else
              this.x-=this.step;
          break;
          case 2:
            if(map[arrindex].y>map[arrindex-1].y)
              this.y+=this.step;
            else
              this.y-=this.step;

          break;
          case 3:
            if(map[arrindex-1].p == 1) {
              this.fromleft3(arrindex);
            } else if(map[arrindex-1].p == 2){
              this.fromover3(arrindex);
            } else if(map[arrindex-1].p == 4){
                this.fromleft3(arrindex);
            } else if(map[arrindex-1].p == 5){
                if(map[arrindex-1].x == map[arrindex].x){//il pezzo viene da sopra
                  this.fromover3(arrindex);
                }else if(map[arrindex-1].y == map[arrindex].y)//il pezzo viene dal fianco
                  this.fromleft3(arrindex);
            } else if(map[arrindex-1].p == 6){
              this.fromover3(arrindex);
            }
          break;
          case 4:
            if(map[arrindex-1].p == 1) {
              this.fromright4(arrindex);
            } else if(map[arrindex-1].p == 2){
              this.fromover4(arrindex);
            } else if(map[arrindex-1].p == 3){
              this.fromright4(arrindex);
            } else if(map[arrindex-1].p == 5){
              this.fromover4(arrindex);
            } else if(map[arrindex-1].p == 6){
              if(map[arrindex-1].x == map[arrindex].x){//il pezzo viene da sopra
                this.fromover4(arrindex);
              }else if(map[arrindex-1].y == map[arrindex].y)//il pezzo viene dal fianco
                this.fromright4(arrindex);
            }
          break;
          case 5:
            if(map[arrindex-1].p == 1) {
              this.fromright5(arrindex);
            } else if(map[arrindex-1].p == 2){
              this.frombelow5(arrindex);
            } else if(map[arrindex-1].p == 3){
              if(map[arrindex-1].x == map[arrindex].x){//il pezzo viene da sotto
                this.frombelow5(arrindex);
              }else if(map[arrindex-1].y == map[arrindex].y)//il pezzo viene dal fianco
                this.fromright5(arrindex);
            } else if(map[arrindex-1].p == 4){
              this.frombelow5(arrindex);
            } else if(map[arrindex-1].p == 6){
              this.fromright5(arrindex);

            }
          break;
          case 6:
            if(map[arrindex-1].p == 1) {
              this.fromleft6(arrindex);
            } else if(map[arrindex-1].p == 2){
              this.frombelow6(arrindex);
            } else if(map[arrindex-1].p == 3){
              this.frombelow6(arrindex);
            } else if(map[arrindex-1].p == 4){
              if(map[arrindex-1].x == map[arrindex].x){//il pezzo viene da sotto
                this.frombelow6(arrindex);
              }else if(map[arrindex-1].y == map[arrindex].y)//il pezzo viene dal fianco
                this.fromleft6(arrindex);
            } else if(map[arrindex-1].p == 5){
              this.fromleft6(arrindex);
            }
          break;
        }
      }
    }
  }

  setStep(s){
    this.step=s;
  }

  setIncRad(ir){
    this.incradiants=ir;
  }

  setX(x){
    this.x=x;
  }

  setY(y){
    this.y=y;
  }

    fromleft3(arrindex){
      if(this.init!=3){
        !this.radiantscopy ? this.radiantscopy=this.radiants[1] : {};
        this.init=3;
      }
      if(this.x < coordx[map[arrindex].x]+(tileW-piecedistance)/2){
        this.x+=this.step;
      }else if(this.radiantscopy && this.radiantscopy>this.radiants[0]){
        this.x = coordx[map[arrindex].x] + (tileW-piecedistance)/2 + Math.cos(this.radiantscopy)*piecedistance/2;
        this.y = coordy[map[arrindex].y] + pad + Math.sin(this.radiantscopy)*piecedistance/2;
        this.radiantscopy-=this.incradiants;
        this.radiantscopy < this.radiants[0] ? this.radiantscopy=this.radiants[0] : {};
      }else{
        this.y-=this.step;
        this.radiantscopy=null;
      }
    }

    fromover3(arrindex){
      if(this.init!=3){
        !this.radiantscopy ? this.radiantscopy=this.radiants[1] : {};
        this.init=3;
      }
      if(this.y < coordy[map[arrindex].y]+pad){
        this.y+=this.step;

      }else if(this.radiantscopy && this.radiantscopy>this.radiants[0]){
        this.x = coordx[map[arrindex].x] + (tileW-piecedistance)/2 + Math.sin(this.radiantscopy)*piecedistance/2;
        this.y = coordy[map[arrindex].y] + pad + Math.cos(this.radiantscopy)*piecedistance/2;

        this.radiantscopy-=this.incradiants;
        this.radiantscopy < this.radiants[0] ? this.radiantscopy=this.radiants[0] : {};
      }else{
        this.x-=this.step;
        this.radiantscopy=null;
      }
    }

    fromover4(arrindex){
      if(this.init!=4){
        !this.radiantscopy ? this.radiantscopy=this.radiants[2] : {};
        this.init=4;
      }
      if(this.y < coordy[map[arrindex].y]+pad){
        this.y+=this.step;

      }else if(this.radiantscopy && this.radiantscopy>this.radiants[1]){
        this.x = coordx[map[arrindex].x+1] - (tileW-piecedistance)/2 + Math.cos(this.radiantscopy)*piecedistance/2;
        this.y = coordy[map[arrindex].y] + pad + Math.sin(this.radiantscopy)*piecedistance/2;
        this.radiantscopy-=this.incradiants;
        this.radiantscopy < this.radiants[1] ? this.radiantscopy=this.radiants[1] : {};
      }else{
        this.x+=this.step;
        this.radiantscopy=null;
      }
    }

    fromright4(arrindex){
      if(this.init!=4){
        !this.radiantscopy ? this.radiantscopy=this.radiants[1] : {};
        this.init=4;
      }

      if(this.x > coordx[map[arrindex].x+1]-(tileW-piecedistance)/2){
        this.x-=this.step;
      }else if(this.radiantscopy && this.radiantscopy<this.radiants[2]){
        this.x = coordx[map[arrindex].x+1] - (tileW-piecedistance)/2 + Math.cos(this.radiantscopy)*piecedistance/2;
        this.y = coordy[map[arrindex].y] + pad + Math.sin(this.radiantscopy)*piecedistance/2;

        this.radiantscopy+=this.incradiants;
        this.radiantscopy > this.radiants[2] ? this.radiantscopy=this.radiants[2] : {};
      }else{
        this.y-=this.step;
        this.radiantscopy=null;
      }

    }

    fromright5(arrindex){
      if(this.init!=5){
        !this.radiantscopy ? this.radiantscopy=this.radiants[2] : {};
        this.init=5;
      }
      if(this.x > coordx[map[arrindex].x+1] -(tileW-piecedistance)/2){
        this.x-=this.step;
      }
      else if(this.radiantscopy && this.radiantscopy<this.radiants[3]){
        this.x = coordx[map[arrindex].x+1]-(tileW-piecedistance)/2 + Math.sin(this.radiantscopy)*piecedistance/2;
        this.y = coordy[map[arrindex].y]+pad+piecedistance + Math.cos(this.radiantscopy) *piecedistance/2;
        this.radiantscopy+=this.incradiants;
        this.radiantscopy > this.radiants[3] ? this.radiantscopy=this.radiants[3] : {};
      }else{
        this.y+=this.step;
        this.radiantscopy=null;
      }
    }

    frombelow5(arrindex){
      if(this.init!=5){
        !this.radiantscopy ? this.radiantscopy=this.radiants[2] : {};
        this.init=5;
      }

      if(this.y > coordy[map[arrindex].y+1]-pad){
        this.y-=this.step;
      }else if(this.radiantscopy && this.radiantscopy<this.radiants[3]){
        this.x = coordx[map[arrindex].x+1]-(tileW-piecedistance)/2 + Math.cos(this.radiantscopy)*piecedistance/2;
        this.y = coordy[map[arrindex].y]+pad+piecedistance + Math.sin(this.radiantscopy) *piecedistance/2;
        this.radiantscopy+=this.incradiants;
        this.radiantscopy > this.radiants[3] ? this.radiantscopy=this.radiants[3] : {};
      }else{
        this.x+=this.step;
        this.radiantscopy=null;
      }
    }
    frombelow6(arrindex){
      if(this.init!=6){
        !this.radiantscopy ? this.radiantscopy=this.radiants[4] : {};
        this.init=6;
      }
      if(this.y > coordy[map[arrindex].y+1]-pad){
        this.y-=this.step;
      }
      else if(this.radiantscopy && this.radiantscopy>this.radiants[3]){
        this.x = coordx[map[arrindex].x]+ (tileW-piecedistance)/2 + Math.cos(this.radiantscopy)*piecedistance/2;
        this.y = coordy[map[arrindex].y]+ pad + piecedistance + Math.sin(this.radiantscopy) *piecedistance/2;
        this.radiantscopy-=this.incradiants;
        this.radiantscopy < this.radiants[3] ? this.radiantscopy=this.radiants[3] : {};
      }else{
        this.x-=this.step;
        this.radiantscopy ? this.radiantscopy = null : {};
      }
    }

    fromleft6(arrindex){
      if(this.init!=6){
        !this.radiantscopy ? this.radiantscopy=this.radiants[3] : {};
        this.init=6;
      }

      if(this.x < coordx[map[arrindex].x]+(tileW-piecedistance)/2){
        this.x+=this.step;
      }
      else if(this.radiantscopy && this.radiantscopy<this.radiants[4]){
        this.x = coordx[map[arrindex].x] + (tileW-piecedistance)/2 + Math.cos(this.radiantscopy)*piecedistance/2;
        this.y = coordy[map[arrindex].y] + pad + piecedistance + Math.sin(this.radiantscopy) *piecedistance/2;
        this.radiantscopy+=this.incradiants;
        this.radiantscopy > this.radiants[4] ? this.radiantscopy=this.radiants[4] : {};
      }else{
        this.y+=this.step;
        this.radiantscopy ? this.radiantscopy = null : {};
      }
  }

}

function indexeq(element, index, array) {
  var indexes = getIndexes(this);
  return indexes.i == element.x && indexes.j == element.y
}
