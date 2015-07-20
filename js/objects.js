// DECLARATIONS OF GAME OBJECTS

// Decorator is a pattern that adds functionality to object - extends it

// custom image decorator

var CImageDecorator= function(obj,x,y,img){
	obj.x=x;
	obj.y=y;
	obj.img=img;
	obj.DrawImage=CImageDecorator.prototype.Draw;
	return obj;
}

CImageDecorator.prototype.Draw= function(){
		ctx.drawImage(Resources.get(this.img),this.x,this.y);
}

// custom sprite decorator - animated image

var CSpriteDecorator = function(obj,num)
{
	obj.num=num;
	obj.slide=0;
	obj.spriteSpeed=1;
	obj.spriteTime=0;
	obj.UpdateSprite=CSpriteDecorator.prototype.Update;
	obj.NextSprite=CSpriteDecorator.prototype.Next;
	obj.DrawSprite=CSpriteDecorator.prototype.Draw;
	return obj;
}

CSpriteDecorator.prototype.Draw= function(){
	image=Resources.get(this.img);
	ctx.drawImage(image,
       this.slide * image.width / this.num,
       0,
       image.width / this.num,
       image.height,
       this.x,
       this.y,
       image.width / this.num,
       image.height);
}

CSpriteDecorator.prototype.Update=function(dt){this.spriteTime=this.spriteTime+dt; if(this.spriteTime>=this.spriteSpeed) {this.NextSprite(); this.spriteTime=0;}};

CSpriteDecorator.prototype.Next=function(){if(this.slide==this.num-1)this.slide=0; else this.slide++;};

// moving object decorator

var MoveDecorator = function(obj, speed)
{
	obj.MakeMove=MoveDecorator.prototype.MakeMove;
	obj.speed=speed;
	return obj;
}

MoveDecorator.prototype.MakeMove= function(dt) {
    this.x=this.x+dt*this.speed*100;
    if(this.speed>0)if(this.x>=canvas.width){mapRow[this.row].movingObjects.shift();}
    else if(this.x<0-Resources.get(this.img).width){mapRow[this.row].movingObjects.shift();}
}

// custom game objects constructors

// object moving on scene constructor

var Actor= function(img, row, speed){
	obj={};
	var y=row*TILE_HEIGHT;
	obj.row=row;
	var startingPos;
	if(speed>0) startingPos=-Resources.get(img).width; else startingPos=canvas.width;
	obj=CImageDecorator(obj,startingPos,y,img);
	obj=MoveDecorator(obj, speed);
	obj.Update=Actor.prototype.Update;
	return obj;
}

Actor.prototype.Update=function(dt){
	this.MakeMove(dt);
}

var BonusObject= function(img, x, row, value){
	obj={};
	var y=row*TILE_HEIGHT;
	obj.row=row;
	var startingPos;
	obj=CImageDecorator(obj,x,y,img);
	obj=CSpriteDecorator(obj,2);
	obj.value=value;
	return obj;
}

// player constructor

var Player= function(img, speed){
	obj={};
	obj.row=NUM_ROWS-1;
	var y=obj.row*TILE_HEIGHT;
	var startingPos=CANVAS_WIDTH/2;
	obj=CImageDecorator(obj,startingPos,y,img);
	obj=MoveDecorator(obj, speed);
	obj.Update=Player.prototype.Update;
	obj.MoveRow=Player.prototype.MoveRow;
	obj.Reset=Player.prototype.Reset;
	obj.moveLeft=false;
	obj.moveRight=false;
	obj.riding=false;
	return obj;
}

Player.prototype.Update=function(dt){
	if(this.moveLeft) this.x=this.x-dt*this.speed*100;
	if(this.moveRight) this.x=this.x+dt*this.speed*100;
	if(this.riding){this.x=this.x+dt*mapRow[this.row].speed*100;}
	if(this.x<0)this.x=this.x>0;
	var imgwidth=Resources.get(this.img).width;
	if(this.x>CANVAS_WIDTH-imgwidth)this.x=CANVAS_WIDTH-imgwidth;
}
Player.prototype.Reset=function(){
	this.row=NUM_ROWS-1;
	this.y=this.row*TILE_HEIGHT;
	this.x=CANVAS_WIDTH/2;
	this.riding=false;
	this.moveLeft=false;
	this.moveRight=false;
}

// player should be jumping between rows, rather than moving

Player.prototype.MoveRow=function(direction){
	if(direction=='down'){
		if(this.row<NUM_ROWS-1) this.row++;
	}
	else if(this.row>0 && direction=='up') {this.row--; if(this.row==0)GameOver(true);}
	this.y=this.row*TILE_HEIGHT;
	if(mapRow[this.row].walkable){this.riding=false;}
	else{this.riding=true;}
}

