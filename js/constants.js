// The list of constants and global variables

NUM_ROWS = 6;
NUM_COLUMNS = 6;
TILE_WIDTH=101;
TILE_HEIGHT=83;
CANVAS_WIDTH=TILE_WIDTH*NUM_COLUMNS;
CANVAS_HEIGHT=TILE_HEIGHT*(NUM_ROWS+1);
playerImage='images/char-boy.png';
playing=false;
paused=false;
FLOATER_SPEED=2;
COLLISION_REDUCTION=20;  // reduce collision area
WALK_COLLISION_REDUCTION=30;  // reduce collision area for walking even more
score=0;