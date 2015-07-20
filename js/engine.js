/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

 var Row=function(speed, cooldown, rindex, walkable, objects)
{
    var obj={};
    obj.rindex=rindex;
    obj.walkable=walkable;
    obj.movingObjectsType=objects;
    obj.movingObjects=[];
    obj.staticObjects=[];
    obj.speed=speed;
    obj.cooldownTime=cooldown;
    obj.cooldown=cooldown*0.5;
    obj.Update=Row.prototype.Update;
    obj.Render=Row.prototype.Render;
    return obj;
}

Row.prototype.Update= function(dt){
    //update static objects - sprites
    for (var j = 0; j < this.staticObjects.length; j++) {
            this.staticObjects[j].UpdateSprite(dt);
        };
    // update moving objects
    if(this.movingObjectsType!="none"){
        // move objects
        for (var j = 0; j < this.movingObjects.length; j++) {
            this.movingObjects[j].Update(dt);
        };
        // spawn new objects
        this.cooldown=this.cooldown-dt;
        if(this.cooldown<=0){
            switch(this.movingObjectsType) {
                case "bug":
                    if(this.speed>0)
                        this.movingObjects.push(Actor('images/enemy-bug-right.png',this.rindex,this.speed));
                    else
                        this.movingObjects.push(Actor('images/enemy-bug-left.png',this.rindex,this.speed));
                    break;
                case "log":
                    this.movingObjects.push(Actor('images/log.png',this.rindex,this.speed));
                    break;
            }
            // reset spawn cooldown
            this.cooldown=this.cooldownTime;
        }
    }
}

Row.prototype.Render= function(dt){
    for (var i = 0; i < this.staticObjects.length; i++) {
        this.staticObjects[i].DrawSprite();
    };
    for (var j = 0; j < this.movingObjects.length; j++) {
        this.movingObjects[j].DrawImage();
    };
}

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    var Map = [
            'images/grass-block.png',   // Top row
            'images/grass-block.png',
            'images/stone-block.png',
            'images/water-block.png',
            'images/stone-block.png',
            'images/grass-block.png'    // Bottom row
        ],
        row, col;
    var mapRow=[];

    // add rows

    mapRow.push(Row(0,0,0,true,"none"));
    mapRow.push(Row(-1,3,1,true,"bug"));
    mapRow.push(Row(1.5,2,2,true,"bug"));
    mapRow.push(Row(-1,3,3,false,"log"));
    mapRow.push(Row(1.5,2,4,true,"bug"));
    mapRow.push(Row(0,5,true,"none"));

    // add static objects

    mapRow[4].staticObjects.push(BonusObject('images/gem-blue-shining.png', CANVAS_WIDTH/3,4,20));
    mapRow[2].staticObjects.push(BonusObject('images/gem-blue-shining.png', CANVAS_WIDTH/2,2,20));

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    doc.body.appendChild(canvas);

    var player=Player(playerImage, 1.5);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
            var now = Date.now(),
                dt = (now - lastTime) / 1000.0;

            /* Call our update/render functions, pass along the time delta to
             * our update function since it may be used for smooth animation.
             */
            update(dt);
            render();

            /* Set our lastTime variable which is used to determine the time delta
             * for the next time this function is called.
             */
            lastTime = now;
        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        if(!paused){
            updateEntities(dt);
            CheckCollisions();
        }
        UpdateFloaters(dt);
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        // update map rows
        for (var i = 0; i < mapRow.length; i++) {
            mapRow[i].Update(dt);
        };
        // update player
        player.Update(dt);
    }

    function CheckCollisions(dt) {
        var row=mapRow[player.row];
        // check if player is not falling down or not being hit by enemy
        if(row.walkable){
            for (var i = 0; i < row.movingObjects.length; i++) {
                var colObj=row.movingObjects[i];
                if(colObj.x+Resources.get(colObj.img).width-COLLISION_REDUCTION>player.x && player.x+Resources.get(player.img).width-COLLISION_REDUCTION>colObj.x){
                    // player is not on walkable object
                    GameOver(false);
                }
            }
        }else{
            var onWalkable=false;
            for (var i = 0; i < row.movingObjects.length; i++) {
                var colObj=row.movingObjects[i];
                if(player.x+Resources.get(player.img).width-WALK_COLLISION_REDUCTION>colObj.x && colObj.x+Resources.get(colObj.img).width-WALK_COLLISION_REDUCTION>player.x){
                   // player is on one of walkable objects
                   onWalkable=true;
                }
            }
            if(!onWalkable)
            {GameOver(false);}
        };
        // check collision with static objects - at this point only bonus items are static
        for (var k = 0; k < row.staticObjects.length; k++) {
            var colObj=row.staticObjects[k];
            if(colObj.x+Resources.get(colObj.img).width-COLLISION_REDUCTION>player.x && player.x+Resources.get(player.img).width-COLLISION_REDUCTION>colObj.x){
                // add score
                score=score+colObj.value;
                // remove item
                row.staticObjects.splice(row.staticObjects.indexOf(colObj),1);
            }
        }
    }

    function GameOver(win) {
        if(win){CreateFloater(CANVAS_WIDTH/3,CANVAS_HEIGHT*3/4,"You won!");}
        else{CreateFloater(CANVAS_WIDTH/3,CANVAS_HEIGHT*3/4,"You lost!");}
        reset();
        paused=true;
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        // clear context
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw map
        for (row = 0; row < NUM_ROWS; row++) {
            for (col = 0; col < NUM_COLUMNS; col++) {
                ctx.drawImage(Resources.get(Map[row]), col * TILE_WIDTH, row * TILE_HEIGHT);
            }
        }
        // draw player and other objects
        renderEntities();
        DrawScore();
        // render floating text boxes
        RenderFloaters();
        // draw paused text
        if(paused){DrawPaused();};
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        // render each row (row renders all objects that belongs to it)
        for (var i = 0; i < mapRow.length; i++) {
            mapRow[i].Render();
        };
        // draw player
        player.DrawImage();
    }

    // reset after player lost or won
    function reset() {
        // empty rows static objects
        for (var i = 0; i < mapRow.length; i++) {
            mapRow[i].staticObjects=[];
        }
        // add a new set of static objects
        mapRow[4].staticObjects.push(BonusObject('images/gem-blue-shining.png', CANVAS_WIDTH/3,4,20));
        mapRow[2].staticObjects.push(BonusObject('images/gem-blue-shining.png', CANVAS_WIDTH/2,2,20));
        // reset player
        player.Reset();
        //reset score;
        score=0;
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug-left.png',
        'images/enemy-bug-right.png',
        'images/log.png',
        'images/gem-blue-shining.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.canvas = canvas;
    global.mapRow = mapRow;
    global.player = player;
    global.GameOver=GameOver;
})(this);
