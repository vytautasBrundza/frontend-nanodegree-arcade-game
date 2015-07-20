// DECLARATIONS OF GAME OBJECTS

// custom image decorator

var CImageDecorator= function(obj,x,y,img){
	obj.x=x;
	obj.y=y;
	obj.img=img;
	obj.DrawImage=CImageDecorator.prototype.Draw;
	obj.SetImgPos=CImageDecorator.prototype.SetPos;
	return obj;
};

CImageDecorator.prototype.Draw= function(){
		ctx.drawImage(Resources.get(this.img),this.x,this.y);
	}

CImageDecorator.prototype.SetPos= function(x,y){
		this.x=x;
		this.y=y;
	}

// custom sprite decorator

var CSpriteDecorator = function(obj,num)
{
	obj.num=num;
	obj.slide=0;
	obj.speed=1;
	obj.spriteTime=0;
	obj.UpdateSprite=CSpriteDecorator.prototype.Update;
	obj.NextSprite=CSpriteDecorator.prototype.Next;
	obj.DrawSprite=CSpriteDecorator.prototype.Draw;
	return obj;
};

CSpriteDecorator.prototype.Draw= function(){
	image=Resources.get(this.img);
		ctx.drawImage(image,
           this.slide * image.width / num,
           0,
           image.width / num,
           image.height,
           this.x,
           this.y,
           image.width / num,
           image.height);
		}

CSpriteDecorator.prototype.Update=function(dt){this.spriteTime=this.spriteTime+dt; if(this.spriteTime=this.speed) {this.Next(); this.spriteTime=0;}};

CSpriteDecorator.prototype.Next=function(){ if(this.slide==this.num)this.slide=0; else this.slide++;};

// moving object decorator

var MoveDecorator = function(obj, speed)
{
	obj.MakeMove=MoveDecorator.prototype.MakeMove;
	obj.speed=speed;
	return obj;
};

MoveDecorator.prototype.MakeMove= function(dt) {
    this.x=this.x+dt*this.speed*100;
    if(this.speed>0)if(this.x>=canvas.width){mapRow[this.row].movingObjects.shift();}
    else if(this.x<0-Resources.get(this.img).width){mapRow[this.row].movingObjects.shift();}
}

// custom game objects constructors

// enemy constructor

var Enemy= function(img, row, speed){
	obj={};
	var y=row*tileHeight;
	obj.row=row;
	var startingPos;
	if(speed>0) startingPos=-Resources.get(img).width; else startingPos=canvas.width;
	obj=CImageDecorator(obj,startingPos,y,img);
	obj=MoveDecorator(obj, speed);
	obj.Update=Enemy.prototype.Update;
	return obj;
};

Enemy.prototype.Update=function(dt){
	this.MakeMove(dt);
}

// player constructor

var Player= function(img, speed){
	obj={};
	obj.row=mapRow.length-1;
	var y=obj.row*tileHeight;
	var startingPos=(canvas.width-Resources.get(this.img).width)/2;
	obj=CImageDecorator(obj,startingPos,y,img);
	obj=MoveDecorator(obj, speed);
	obj.Update=Player.prototype.Update;
	obj.MoveRow=Player.prototype.MoveRow;
	return obj;
};

Player.prototype.Update=function(dt){
	var keystate= GetKeyState();
	if(keystate)console.log(keystate);
	if(keystate=='left') this.x=this.x-dt*this.speed*100;
	if(keystate=='right') this.x=this.x+dt*this.speed*100;
}

// player should be jumping between rows, rather than moving

Player.prototype.MoveRow=function(direction){
	if(direction=='up'){
		if(this.row<mapRow.length-1) this.row++;
	}
	else if(this.row>0 && direction=='down') this.row--;
	this.y=this.row*tileHeight;
}

