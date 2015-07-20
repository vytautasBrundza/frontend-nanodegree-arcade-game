// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keypress', function(e) {
    var allowedKeys = {
        38: 'up',
        40: 'down',
    };
    if(e.keyCode=32){paused=!paused;};
    player.MoveRow(allowedKeys[e.keyCode]);
})

function GetKeyState(){
    e = window.event;
    if (e.left) {return 'left';}
    if (e.right) { return 'right';}
}
/*
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        39: 'right'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});*/
