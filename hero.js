class Hero{
  constructor(coordX, coordY){
    this.x=coordX-75;
    this.y=coordY-75;
    this.pos=1; /*0 = sx, 1=up, 2=dx, 3=down*/
    this.dim = [];
    this.img=[];
    for(var i=0; i<44; i++){
      this.img[i] = new Image();
      this.img[i].src = 'imgs/hero/hero'+i+'.png';
      this.dim[i] = {x: this.img[i].clientWidth, y: this.img[i].clientHeight};
    }
    this.anim=11;
    this.flagatt=false;
    this.step=8;this.step

  }
  //0-10
  //11-21
  //22-32
  //33-43
  show(wave){
    herocanvas.style.zIndex = "10";
    ctxhero.drawImage(this.img[this.anim], this.x, this.y, 75, 75);
    if(this.pos==0){
      if(this.anim>7 && this.flagatt){
        this.anim++;
        if(this.anim>10){
          this.anim=0;
          this.flagatt=false;
        }
      }else if(this.anim>7 && !this.flagatt) this.anim=0;
    }else if(this.pos==1){
      if(this.anim>18 && this.flagatt){
        this.anim++;
        if(this.anim>21){
          this.anim=11;
          this.flagatt=false;
        }
      }else if(this.anim>18 && !this.flagatt) this.anim=11;
    }else if(this.pos==2){
      if(this.anim>29 && this.flagatt){
        this.anim++;
        if(this.anim>32){
          this.anim=22;
          this.flagatt=false;
        }
      }else if(this.anim>29 && !this.flagatt) this.anim=22;
    }else if(this.pos==3){
      if(this.anim>40 && this.flagatt){
        this.anim++;
        if(this.anim>43){
          this.anim=33;
          this.flagatt=false;
        }
      }else if(this.anim>40 && !this.flagatt) this.anim=33;
    }
  }
  move(code){
    if(code == 87){
      this.pos=1;
      this.y-=this.step;
    }
    if(code == 83){
      this.pos=3;
      this.y+=this.step;
    }
    if(code == 65){
      this.pos=0;
      this.x-=this.step;
    }
    if(code == 68){
      this.pos=2;
      this.x+=this.step;
    }
    this.anim++;
    if(code == 88){
      if(this.pos==0)this.anim=8;
      if(this.pos==1)this.anim=19;
      if(this.pos==2)this.anim=30;
      if(this.pos==3)this.anim=41;
      this.flagatt=true;
      this.attack(wave);
    }
  }

  resetPos(){
    if(this.pos==0)this.anim=0;
    if(this.pos==1)this.anim=11;
    if(this.pos==2)this.anim=22;
    if(this.pos==3)this.anim=33;

  }
  resizeHero(coordX, coordY){
    this.x = coordX-75;
    this.y = coordY-75;
  }
  attack(e){
    for(var i=0; i<e.length; i++){
      if(((e[i].x-this.x)*(e[i].x-this.x) + (e[i].y-this.y)*(e[i].y-this.y)) < 50*50){
        if(e[i].alive)
          e[i].lives-=3;
        if(e[i].lives<=0 && e[i].alive)
          e[i].alive=false
      }
    }
  }

}
