// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keydown', function(e) {
    if(!paused){
        if(e.keyCode==37){player.moveLeft=true;};
        if(e.keyCode==39){player.moveRight=true;};
        var allowedKeys = {
            38: 'up',
            40: 'down',
        };
        player.MoveRow(allowedKeys[e.keyCode]);
    }
    if(e.keyCode==32){paused=!paused;};
});

document.addEventListener('keyup', function(e) {
    if(!paused){
        if(e.keyCode==37){player.moveLeft=false;};
        if(e.keyCode==39){player.moveRight=false;};
    }
});

var floaters=[];

var CreateFloater= function(x,y,text){
    floaters.push(Floater(x,y,text));
}

var UpdateFloaters=function(dt){
    var toRemove=[];
    for (var i = 0; i < floaters.length; i++) {
        floaters[i].y=floaters[i].y-dt*FLOATER_SPEED*100;
        if(floaters[i].y<0){
            toRemove.push(floaters[i]);
        }
    };
    for (var i = 0; i < toRemove.length; i++) {
        floaters.splice(floaters.indexOf(toRemove[i]),i);
    };

}

var RenderFloaters=function(){
    for (var i = 0; i < floaters.length; i++) {
        floaters[i].Draw();
    };
}

var Floater= function(x,y,text){
    obj={};
    obj.x=x;
    obj.y=y;
    obj.text=text;
    obj.Draw=Floater.prototype.Draw;
    return obj;
}

Floater.prototype.Draw = function() {
    ctx.font = "48px arial";
    ctx.fillStyle = 'blue';
    ctx.fillText(this.text, this.x, this.y);
};

var DrawPaused= function(){
    ctx.font = "48px arial";
    ctx.fillStyle = 'grey';
    ctx.fillText("PAUSED", CANVAS_WIDTH/3,CANVAS_HEIGHT*0.5);
}
