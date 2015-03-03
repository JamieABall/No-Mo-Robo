/************************************
    Global Constants
************************************/
var CANVAS = document.getElementById('canvas');
var CANVAS_WIDTH = CANVAS.width;
var CANVAS_HEIGHT = CANVAS.height;


var MAX_TURRETS = 50; //max number of turrets on the field
var NUM_LANES = 5; //the number of lanes
var LANE_HEIGHT = CANVAS_HEIGHT / 10 ; //the height of each lane
var LANE_WIDTH  = LANE_HEIGHT; // dstance between the tile grid and the bottom of the screen

// Turret constants
var TURRET_CONDITION = 25;
var TURRET_FIRE_RATE = 1;
var TURRET_DAMAGE = 5;
var TURRET_SPRITE_SRC = "http://i.imgur.com/rKsSu90.gif";
var TURRET_SPRITE_HEIGHT = CANVAS_HEIGHT / 11;
var TURRET_SPRITE_WIDTH = TURRET_SPRITE_HEIGHT;

// Projectile Constants
var PROJECTILE_SPEED = 8;
var PROJECTILE_SPRITE_SRC = "http://i.imgur.com/fzuYUF4.png";
var PROJECTILE_SPRITE_WIDTH = 10;
var PROJECTILE_SPRITE_HEIGHT = 10;
var FIRE_DIR = { x: -1, y: 0 };

// House Constants
var HOUSE_CONDITION = 100;
var HOUSE_POSITION = {x: 0, y: 0};
var HOUSE_SPRITE_SRC = "http://i.imgur.com/GjCuaSO.png";
var HOUSE_SPRITE_WIDTH = 200;
var HOUSE_SPRITE_HEIGHT = CANVAS_HEIGHT;

// Enemy Constants
var MAX_ENEMY_COUNT = 5;
var ENEMY_CONDITION = 25;
var ENEMY_SPEED = 5;
var ENEMY_DAMAGE = 1;
var ENEMY_SPRITE_SRC = "http://i.imgur.com/M3HSmOw.gif";
var ENEMY_SPRITE_HEIGHT = CANVAS_HEIGHT / 11;
var ENEMY_SPRITE_WIDTH = ENEMY_SPRITE_HEIGHT;
/***********************************/





/************************************
    Main
************************************/
var gameOver = false;
use2D = true;
    
function Main() {
    
    var stage = new Stage();
    var ph = new PlayerHandler(stage);
    var eh = new EnemyHandler();
    var ch = new CollisionHandler();
    
    world.update = function(dt) {
        console.log(ph.house().condition());
        if(!gameOver) {
            ph.update(dt);
            eh.update(dt);
            ch.update(eh.enemies(), ph.projectiles(), ph.turrets(), ph.house());
        } else {
            ph = new PlayerHandler(stage);
            eh = new EnemyHandler();
            ch = new CollisionHandler();
        }
    }
}

Main();
/***********************************/
